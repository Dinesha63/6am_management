import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  FlatList,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {
  Asset,
  CameraOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import ImageSelectionBottomSheet from '../../components/ImageSelectionBottomSheet';

import Header from './Header';
import EnhancedMap from './EnhancedMap';
import FloatingLabelInput from './FloatingLabelInput';
import ImageSelector from './ImageSelector';
import AddressTypeSelector from './AddressTypeSelector';
import ImagePreviewModal from '../LocationScreen/ImagePreviewModal';
import ConfirmDeleteModal from '../LocationScreen/ConfirmDeleteModal';
import SuccessModal from './SuccessModal';

import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import ApiContext from '../../context/ApiContext';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from '../../redux/hooks';
import {
  createCustomerAddress,
  updateCustomerAddress,
} from '../../redux/Features/Address/addressThunk';

interface LocationAddressFormData {
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  location: string;
  addressLine1: string;
  addressLine2: string;
  pincode?: string | null;
  latitude: number;
  longitude: number;
}
type Props = NativeStackScreenProps<
  RootStackParamList,
  'LocationAddressScreen'
>;

const LocationAddressScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  const route = useRoute<Props['route']>();
  const addressData = route.params?.addressData;
  const locationData = route.params?.formData;
  const apiContext = useContext(ApiContext);
  if (!apiContext) {
    throw new Error('LocationScreen must be used within an ApiProvider');
  }
  const {api} = apiContext;

  // Form state
  // const [formData, setFormData] = useState<LocationAddressFormData>({
  //   fullName: '',
  //   phoneNumber: '',
  //   email: '',
  //   location: '',
  // });

  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [isFormFieldFocused, setIsFormFieldFocused] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const mapHeightAnim = useRef(new Animated.Value(hp(40))).current;
  const mapRef = useRef<{ fetchCurrentLocation: () => void }>(null);

  const schema = yup.object().shape({
    fullName: yup
      .string()
      .required('Full name is required')
      .min(3, 'Name must be at least 3 characters'),
    phoneNumber: yup
      .string()
      .required('Phone number is required')
      .matches(/^[0-9]+$/, 'Phone number can only contain digits')
      .length(10, 'Phone number must be exactly 10 digits'),
    location: yup.string().required('Location is required'),
    addressLine1: yup.string().required('Address Line 1 is required'),
    addressLine2: yup.string().required('Address Line 2 is required'),
    latitude: yup.number().required(),
    longitude: yup.number().required(),
  });
  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
    setValue,
  } = useForm<LocationAddressFormData>({
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      location: '',
      addressLine1: '',
      addressLine2: '',
      pincode: '',
      latitude: 0,
      longitude: 0,
    },
    resolver: yupResolver(schema),
  });
  const [imageUris, setImageUris] = useState<(Asset | null)[]>([null, null]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(
    null,
  );
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  // Address type state
  const [addressType, setAddressType] = useState<'Home' | 'Office' | 'Other'>(
    'Home',
  );

  // Populate form with existing address data when editing
  useEffect(() => {
    if (addressData) {
      setValue('fullName', addressData.fullName || '');
      setValue('phoneNumber', addressData.phoneNumber || '');
      setValue('email', addressData.email || '');
      setValue('location', addressData.location || '');
      setValue('addressLine1', addressData.addressLine1 || '');
      setValue('addressLine2', addressData.addressLine2 || '');
      setValue('pincode', addressData.pincode || '');
      setValue('latitude', parseFloat(addressData.latitude) || 0);
      setValue('longitude', parseFloat(addressData.longitude) || 0);
      const images = [];
      if (addressData.image1) images.push({uri: addressData.image1});
      if (addressData.image2) images.push({uri: addressData.image2});

      setImageUris([images[0] || null, images[1] || null]);
      if (addressData.addressType) {
        const normalized = addressData.addressType.toLowerCase();
        const titleCased =
          normalized.charAt(0).toUpperCase() + normalized.slice(1);

        if (
          titleCased === 'Home' ||
          titleCased === 'Office' ||
          titleCased === 'Other'
        ) {
          setAddressType(titleCased as 'Home' | 'Office' | 'Other');
        }
      }

      // Set current location for map
      if (addressData.latitude && addressData.longitude) {
        setCurrentLocation({
          latitude: parseFloat(addressData.latitude),
          longitude: parseFloat(addressData.longitude),
        });
      }
    }
  }, [addressData, setValue]);

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsFormFieldFocused(true);
      setIsKeyboardVisible(true);
      // Animate map to smaller height when keyboard shows
      Animated.timing(mapHeightAnim, {
        toValue: hp(20),
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsFormFieldFocused(false);
      setIsKeyboardVisible(false);
      // Animate map back to full height when keyboard hides
      Animated.timing(mapHeightAnim, {
        toValue: hp(40),
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, [mapHeightAnim]);

  const handleLocationUpdate = (
    location: {latitude: number; longitude: number},
    address: string,
  ) => {
    setCurrentLocation(location);

    setValue('location', address);
    setValue('latitude', location.latitude);
    setValue('longitude', location.longitude);
  };

  const handleImageSelection = (index: number) => {
    setSelectedImageIndex(index);
    setIsBottomSheetVisible(true);
  };

  const handleLongPress = (index: number) => {
    const asset = imageUris[index];
    setPreviewImage(
      asset && typeof asset === 'object' ? asset.uri ?? null : null,
    );
    setModalVisible(true);
  };

  const confirmDelete = () => {
    if (confirmDeleteIndex === null) return;

    setImageUris(prevUris =>
      prevUris.map((u, i) => (i === confirmDeleteIndex ? null : u)),
    );
    setConfirmDeleteIndex(null);
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
        setImageUris(prev => {
          const updated = [...prev];
          updated[selectedImageIndex] = response.assets?.[0] ?? null;
          return updated;
        });
      }
    });
    setIsBottomSheetVisible(false);
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
          setImageUris(prev => {
            const updated = [...prev];
            updated[selectedImageIndex] = response.assets?.[0] ?? null;
            return updated;
          });
        }
      },
    );
    setIsBottomSheetVisible(false);
  };

  const handleFetchLocation = () => {
    Alert.alert(
      'Fetch Location',
      'This will get your current location automatically',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => {
          if (mapRef.current) {
            mapRef.current.fetchCurrentLocation();
          }
        }},
      ],
    );
  };

  const getFileNameFromUri = (uri: string) => {
    return uri.split('/').pop() || `image-${Date.now()}.jpg`;
  };

  const getMimeType = (uri: string) => {
    const ext = uri.split('.').pop();
    if (!ext) return 'image/jpeg';
    if (ext === 'png') return 'image/png';
    if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
    return 'image/jpeg';
  };

  // Handle form field focus/blur
  const handleFormFieldFocus = () => {
    setIsFormFieldFocused(true);
    // Only animate map height if keyboard is not already visible
    if (!isKeyboardVisible) {
      Animated.timing(mapHeightAnim, {
        toValue: hp(20),
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleFormFieldBlur = () => {
    setIsFormFieldFocused(false);
    // Only expand map if keyboard is not visible
    if (!isKeyboardVisible) {
      setTimeout(() => {
        if (!isFormFieldFocused && !isKeyboardVisible) {
          Animated.timing(mapHeightAnim, {
            toValue: hp(40),
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      }, 200);
    }
  };

  const handleMapPress = () => {
    setIsFormFieldFocused(false);
    setIsKeyboardVisible(false);
    Keyboard.dismiss();
    // Animate map to full height when map is pressed
    Animated.timing(mapHeightAnim, {
      toValue: hp(40),
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const onSubmit = async (data: LocationAddressFormData) => {
    console.log('📦 Submitted Data:', data);
    try {
      const phone = await AsyncStorage.getItem('userPhoneNumber');
      const savedLocation = route.params?.formData?.savedLocation;
      const images = imageUris || [];

      const formData = new FormData();

      formData.append('customerPhoneNumber', phone || '');
      formData.append('fullName', data.fullName);
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('email', data.email);
      formData.append('addressLine1', data.addressLine1);
      formData.append('addressLine2', data.addressLine2 || '');
      formData.append('location', data.location);
      formData.append('pincode', data.pincode);
      formData.append('addressType', addressType.toUpperCase());
      formData.append('isDefault', 'false');
      formData.append(
        'latitude',
        savedLocation?.latitude?.toString() || data.latitude.toString(),
      );
      formData.append(
        'longitude',
        savedLocation?.longitude?.toString() || data.longitude.toString(),
      );

      if (images[0]?.uri?.startsWith('file://')) {
        const image1 = images[0];
        formData.append('image1', {
          uri: image1.uri,
          name: image1.fileName || getFileNameFromUri(image1.uri || ''),
          type: image1.type || getMimeType(image1.uri || ''),
        } as any);
      }

      if (images[1]?.uri?.startsWith('file://')) {
        const image2 = images[1];
        formData.append('image2', {
          uri: image2.uri,
          name: image2.fileName || getFileNameFromUri(image2.uri || ''),
          type: image2.type || getMimeType(image2.uri || ''),
        } as any);
      }

      console.log(
        'FormData ready for address creation:',
        formData,
        addressData?.customerAddressId,
      );
      // return;
      // Dispatch the thunk or call API
      if (addressData?.customerAddressId) {
        formData.append('customerAddressId', addressData.customerAddressId);
        await dispatch(updateCustomerAddress(formData)).unwrap();
      } else {
        await dispatch(createCustomerAddress(formData)).unwrap();
      }

      // Show success modal
      setIsSuccessModalVisible(true);
    } catch (error) {
      console.error('Failed to create customer address:', error);
    }
  };
  const handleLaterAction = () => {
    navigation.goBack();
  };

  const handleSuccessModalDone = () => {
    const goToAccountOnBack = route.params?.formData?.goToAccountOnBack;
    const goToPaymentOnBack = route.params?.formData?.goToPaymentOnBack;

    if (goToAccountOnBack) {
      // Reset navigation stack to Main -> Account -> MyAddressScreen
      navigation.reset({
        index: 1,
        routes: [
          { name: 'Main', params: { screen: 'Account' } },
          { name: 'MyAddressScreen', params: { 
            existingAddresses: [],
            newAddress: undefined,
            goToAccountOnBack: true 
          }},
        ],
      });
    } else if (goToPaymentOnBack) {
      navigation.goBack(); 
    } else {
      // For other flows, navigate to AddressSuccessScreen
      navigation.navigate('AddressSuccessScreen');
    }
  };
  const houseTypeOptions = [
    {label: 'Apartment/Flat', value: 'Apartment'},
    {label: 'Individual House', value: 'Individual'},
  ];
  const formLocation = watch('location');
  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
                <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          contentContainerStyle={styles.scrollViewContent}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              {/* Map Section */}
              <Animated.View style={[
          styles.mapContainer,
          { height: mapHeightAnim }
        ]}>
          <EnhancedMap 
            ref={mapRef}
            onLocationUpdate={handleLocationUpdate} 
            onMapPress={handleMapPress}
            initialLocation={addressData ? {
              latitude: parseFloat(addressData.latitude) || 0,
              longitude: parseFloat(addressData.longitude) || 0
            } : undefined}
          />

          <TouchableOpacity
            style={styles.fetchLocationButton}
            onPress={handleFetchLocation}>
            <Text style={styles.fetchLocationText}>🎯 Fetch Location</Text>
          </TouchableOpacity>

          {/* Compact mode indicator */}
          {isFormFieldFocused && (
            <TouchableOpacity
              style={styles.expandMapButton}
              onPress={handleMapPress}>
              <Text style={styles.expandMapText}>🗺️ Tap to expand map</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Current Address Display - positioned right after map */}
        {formLocation ? (
          <View style={styles.locationContainer}>
            <View style={styles.locationIconContainer}>
              <Text style={styles.locationIcon}>📍</Text>
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationAddress}>{formLocation}</Text>
              <TouchableOpacity style={styles.editLocationButton}>
                <Text style={styles.editLocationText}>✏️</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Form Section */}
        <View style={styles.formContainer}>
          <Controller
            name="fullName"
            control={control}
            render={({field}) => (
              <FloatingLabelInput
                label="Full Name"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.fullName?.message}
                onFocus={handleFormFieldFocus}
                onBlur={handleFormFieldBlur}
              />
            )}
          />

          <Controller
            name="phoneNumber"
            control={control}
            render={({field}) => (
              <FloatingLabelInput
                label="Phone Number"
                value={field.value}
                onChangeText={field.onChange}
                keyboardType="phone-pad"
                maxLength={10}
                error={errors.phoneNumber?.message}
                onFocus={handleFormFieldFocus}
                onBlur={handleFormFieldBlur}
              />
            )}
          />

          <Controller
            name="addressLine1"
            control={control}
            render={({field}) => (
              <FloatingLabelInput
                label="Flat, House No, Apartment"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.addressLine1?.message}
                onFocus={handleFormFieldFocus}
                onBlur={handleFormFieldBlur}
              />
            )}
          />
          <Controller
            name="addressLine2"
            control={control}
            render={({field}) => (
              <FloatingLabelInput 
                label="Locality, Area, Colony, Street"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.addressLine2?.message}
                onFocus={handleFormFieldFocus}
                onBlur={handleFormFieldBlur}
              />
            )}
          />
          {/* Door Image Section */}
          <View style={styles.imageSection}>
            <Text style={styles.imageTitle}>🚪 Door Image</Text>
            <Text style={styles.imageSubtitle}>
              Upload a door image for accurate delivery
            </Text>

            <View style={styles.imageContainer}>
              {imageUris.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <ImageSelector
                    uri={
                      uri && typeof uri === 'object' ? uri.uri ?? null : null
                    }
                    onPress={() => handleImageSelection(index)}
                    onLongPress={() => handleLongPress(index)}
                  />
                  {uri && (
                    <TouchableOpacity
                      onPress={() => setConfirmDeleteIndex(index)}
                      style={styles.deleteButton}>
                      <Text style={styles.deleteButtonText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Address Type Selector - only show if form has data */}
          {currentLocation && (
            <AddressTypeSelector
              selectedType={addressType}
              onTypeSelect={(type: string) => {
                if (type === 'Home' || type === 'Office' || type === 'Other')
                  setAddressType(type);
              }}
            />
          )}
        </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>

        {/* Bottom Buttons */}
        <View style={styles.buttonContainer}>
        {currentLocation ? (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit(onSubmit)}>
            <Text style={styles.saveButtonText}>Save Address Details</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit(onSubmit)}>
            <Text style={styles.saveButtonText}>Save Address Details</Text>
          </TouchableOpacity>
        )}
        </View>
      </KeyboardAvoidingView>

      {/* Modals */}
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

      <SuccessModal
        isVisible={isSuccessModalVisible}
        onClose={() => setIsSuccessModalVisible(false)}
        onDonePress={handleSuccessModalDone}
        title='Address Saved!'
        subtitle='Your address has been saved successfully.'
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  mapContainer: {
    marginTop: hp(-1),
    overflow: 'hidden',
    position: 'relative',
  },
  fetchLocationButton: {
    position: 'absolute',
    bottom: hp(1),
    right: wp(2),
    backgroundColor: Colors.primary,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: wp(5),
  },
  fetchLocationText: {
    color: Colors.white,
    fontSize: sp(12),
    fontWeight: '600',
  },
  formContainer: {
    padding: wp(4),
    paddingTop: hp(3),
  },
  locationContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.SelectedCard,
    padding: wp(3),
    borderRadius: wp(2),
    marginHorizontal: wp(4),
    marginBottom: hp(2),
    marginTop: hp(2),
    borderLeftWidth: wp(1),
    borderLeftColor: Colors.primary,
  },
  locationIconContainer: {
    marginRight: wp(2),
  },
  locationIcon: {
    fontSize: sp(16),
  },
  locationTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationAddress: {
    flex: 1,
    fontSize: sp(14),
    color: Colors.dark,
    fontWeight: '500',
  },
  editLocationButton: {
    padding: wp(1),
  },
  editLocationText: {
    fontSize: sp(16),
  },
  imageSection: {
    marginVertical: hp(2),
  },
  imageTitle: {
    fontSize: sp(16),
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: hp(0.5),
  },
  imageSubtitle: {
    fontSize: sp(12),
    color: Colors.lightGrey,
    marginBottom: hp(2),
  },
  imageContainer: {
    flexDirection: 'row',
    gap: wp(4),
  },
  imageWrapper: {
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: -wp(1),
    right: -wp(1),
    backgroundColor: Colors.danger,
    borderRadius: wp(3),
    width: wp(6),
    height: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: Colors.white,
    fontSize: sp(14),
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: wp(4),
    backgroundColor: Colors.white,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: wp(2),
    padding: hp(2),
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: sp(16),
    fontWeight: '600',
  },
  laterButton: {
    backgroundColor: Colors.yellow,
    borderRadius: wp(2),
    padding: hp(2),
    alignItems: 'center',
  },
  laterButtonText: {
    color: Colors.dark,
    fontSize: sp(16),
    fontWeight: '600',
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedOptionButton: {
    backgroundColor: '#43A047',
    borderColor: '#388E3C',
  },
  optionText: {
    color: '#555',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
  expandMapButton: {
    position: 'absolute',
    top: hp(1),
    left: wp(2),
    backgroundColor: Colors.white,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    alignItems: 'center',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  expandMapText: {
    fontSize: sp(12),
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default LocationAddressScreen;
