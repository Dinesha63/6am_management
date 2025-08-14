import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ToastAndroid,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SimpleIcon from '../../components/SimpleIcon';
import { FontFamily} from '../../utils/constant';
import { imagePaths } from '../../utils/constants/imagePaths';
import ApiContext from '../../context/ApiContext';
import {
  Asset,
  CameraOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import ImageSelectionBottomSheet from '../../components/ImageSelectionBottomSheet';
import ImageSelector from './ImageSelector';
import ImagePreviewModal from './ImagePreviewModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import EnhancedMap from './EnhancedMap';
import 'react-native-get-random-values';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/index';
// import { Header } from '@react-navigation/stack';
import Header from './header';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

interface SavedAddress {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  images: (Asset | null)[];
  timestamp: Date;
}

const LocationScreen = ({ route }: { route: { params: { formData?: any, addressData?: any } } }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const apiContext = useContext(ApiContext);
  if (!apiContext) {
    throw new Error('LocationScreen must be used within an ApiProvider');
  }
   const formData = route.params?.formData;
   const addressData = route.params?.addressData;
   console.log(addressData,'firsfsdfdddst',  formData)
  const {api} = apiContext;
  const [imageUris, setImageUris] = useState<(Asset | null)[]>([null, null]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<any>();
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);

  console.log(imageUris, 'imageUris');
  console.log(currentAddress, 'currentAddress');
  console.log(currentLocation, 'currentLocation');
useEffect(() => {
  const { formData } = route.params || {};

  if (formData && formData.addressData) {
    const {
      location,
      latitude,
      longitude,
      image1,
      image2,
    } = formData.addressData;

    setCurrentAddress(location || '');

    setCurrentLocation({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });

    const images = [];
    if (image1) images.push({ uri: image1 });
    if (image2) images.push({ uri: image2 });

    setImageUris([
      images[0] || null,
      images[1] || null,
    ]);
  }
}, []);


  const handleSaveLocation = () => {
    if (!currentLocation || !currentAddress.trim()) {
      ToastAndroid.show('Error, Please select a location on the map first', ToastAndroid.SHORT);
      return;
    }

    const newAddress: SavedAddress = {
      id: Date.now().toString(),
      address: currentAddress,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      images: imageUris,
      timestamp: new Date(),
    };

    setSavedAddresses(prev => [...prev, newAddress]);
    
    console.log('Address saved:', newAddress);
    
Alert.alert(
  'Success', 
  'Location saved successfully!',
  [
    {
      text: 'OK',
      onPress: () => {
        navigation.navigate('LocationAddressScreen', {
          addressData: route.params?.addressData,
          formData: {
            ...route.params?.formData,
            location: currentAddress,
            savedLocation: newAddress,
          },
        });
      },
    },
  ]
);
  };

  const handleSkip = () => {
    navigation.goBack();
  };

  const handleImageSelection = (index: number) => {
    setSelectedImageIndex(index);
    setIsBottomSheetVisible(true);
  };

  const handleLongPress = (index: number) => {
    const asset = imageUris[index];
    setPreviewImage(asset && typeof asset === 'object' ? asset.uri ?? null : null);
    setModalVisible(true);
  };

  const confirmDelete = () => {
    if (confirmDeleteIndex === null) {
      return;
    }

    setImageUris(prevUris =>
      prevUris.map((u, i) => (i === confirmDeleteIndex ? null : u)),
    );
    setConfirmDeleteIndex(null);
  };

  const handleLocationUpdate = (location: {latitude: number; longitude: number}, address: string) => {
    setCurrentLocation(location);
    setCurrentAddress(address);
  };

  const handleCamera = async () => {
    const hasPermission = await api.requestCameraPermission();
    if (!hasPermission) {
      console.log(
        'Permission Denied',
        'Camera access is required to take a photo.',
      );
      return;
    }

    const options: CameraOptions = {
      quality: 0.5,
      mediaType: 'photo',
      cameraType: 'back',
      saveToPhotos: true,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled camera picker');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        if (
          response.assets &&
          Array.isArray(response.assets) &&
          response.assets.length > 0
        ) {
          setImageUris(prev => {
            const updated = [...prev];
            updated[selectedImageIndex] = response.assets?.[0] ?? null;
            return updated;
          });
        }
      }
    });
  };

  const handleGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('Image Picker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          if (
            response.assets &&
            Array.isArray(response.assets) &&
            response.assets.length > 0
          ) {
            setImageUris(prev => {
              const updated = [...prev];
              updated[selectedImageIndex] = response.assets?.[0] ?? null;
              return updated;
            });
          }
        }
      },
    );
  };
  

  return (
    <SafeAreaView style={styles.container}>
     <Header />
      {/* Enhanced Map Component with reduced height */}
      <View style={styles.mapContainer}>
        <EnhancedMap onLocationUpdate={handleLocationUpdate} />
      </View>

      <Text style={styles.helpText}>
        Set your location to make our Service Better
      </Text>

      {/* Current Address Display */}
      {currentAddress ? (
        <View style={styles.addressDisplay}>
          <Text style={styles.addressLabel}>Selected Address:</Text>
          <Text style={styles.addressText}>{currentAddress}</Text>
        </View>
      ) : null}

      <View style={styles.imageSection}>
        <Text style={styles.imageTitle}>Add Door Image/ Front Elevation</Text>
        <View style={styles.imageContainer}>
          {imageUris.map((uri, index) => (
            <View key={index}>
              <ImageSelector
                key={index}
                uri={uri && typeof uri === 'object' ? uri.uri ?? null : null}
                onPress={() => handleImageSelection(index)}
                onLongPress={() => handleLongPress(index)}
              />
              {uri && (
                <TouchableOpacity
                  onPress={() => setConfirmDeleteIndex(index)}
                  style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>X</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!currentLocation || !currentAddress.trim()) && styles.disabledButton
          ]}
          onPress={handleSaveLocation}
          disabled={!currentLocation || !currentAddress.trim()}>
          <Text style={styles.saveButtonText}>Save Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>No, I do it later</Text>
        </TouchableOpacity>
      </View>

      <ImageSelectionBottomSheet
        isVisible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
        onCameraPress={handleCamera}
        onGalleryPress={handleGallery}
      />
      <ImagePreviewModal
        visible={modalVisible}
        image={previewImage}
        onClose={() => setModalVisible(false)}
      />
      <ConfirmDeleteModal
        visible={confirmDeleteIndex !== null}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteIndex(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  // header: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   padding: wp(4),
  // },
  // backIcon: {
  //   width: wp(6.4), // 24px
  //   height: wp(6.4),
  //   marginRight: wp(4.2),
  // },
  // title: {
  //   fontSize: sp(18),
  //   fontFamily: FontFamily.REGULAR,
  //   fontWeight: '600',
  // },
  mapContainer: {
    height: hp(34), 
    marginHorizontal: wp(4),
    marginBottom: hp(1),
    borderRadius: wp(2),
    overflow: 'hidden',
  },
  helpText: {
    textAlign: 'center',
    marginVertical: hp(1),
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.lightGrey,
  },
  addressDisplay: {
    marginHorizontal: wp(4),
    padding: wp(3.2),
    backgroundColor: Colors.SelectedCard,
    borderRadius: wp(2),
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  addressLabel: {
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
    color: Colors.lightGrey,

  },
  addressText: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
  },
  imageSection: {
    paddingRight: wp(20),
    paddingTop: hp(1),
    paddingLeft: wp(5),
    flex: 1,
  },
  imageTitle: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    marginBottom: hp(1.5),
    color: Colors.black,
  },
  imageContainer: {
    flexDirection: 'row',
    gap: wp(3.2),
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    position: 'relative',
  },
  buttonContainer: {
    padding: wp(4),
    paddingTop: hp(1),
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: wp(2),
    padding: wp(4),
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  disabledButton: {
    backgroundColor: Colors.greyBackground,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
  },
  skipButton: {
    backgroundColor: Colors.yellow,
    borderRadius: wp(2),
    padding: wp(4),
    alignItems: 'center',
  },
  skipButtonText: {
    color: Colors.black,
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
  },
  closeBtn: {
    backgroundColor: Colors.black,
    paddingVertical: hp(0.8),
    position: 'absolute',
    textAlign: 'right',
    left: wp(30.5),
    width: wp(9.3),
    height: wp(9.3),
    borderBottomLeftRadius: wp(5),
    borderTopRightRadius: wp(2.7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: Colors.white,
  },
});
export default LocationScreen;