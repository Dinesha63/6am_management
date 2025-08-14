import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import SimpleIcon from './SimpleIcon';
import {FontFamily} from '../utils/constant';
import Colors from '../utils/constants/colors';
import {imagePaths} from '../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../utils/constants/responsiveScreen';
import EnhancedMap from '../screens/LocationScreen/EnhancedMap';
import ImageSelectionBottomSheet from './ImageSelectionBottomSheet';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImagePickerResponse,
  Asset,
} from 'react-native-image-picker';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {useForm, Controller} from 'react-hook-form';
import ApiContext from '../context/ApiContext';
import {createCustomerAddressAPI, updateCustomerAddressAPI} from '../redux/Features/Address/address.api';
import {getStoredPhoneNumber} from '../config/storage';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import InputField from './InputField';
import { CustomerAddress } from '../redux/Features/Address/address.types';

interface AddAddressFormProps {
  onBack: () => void;
  onSubmit: (addressData: any) => void;
  editingAddress?: CustomerAddress | null;
  isEditMode?: boolean;
}

const AddAddressForm: React.FC<AddAddressFormProps> = ({
  onBack, 
  onSubmit, 
  editingAddress = null, 
  isEditMode = false
}) => {
  const apiContext = useContext(ApiContext);
  if (!apiContext) {
    throw new Error('AddAddressForm must be used within an ApiProvider');
  }
  const {api} = apiContext;
  const [isImageSheetVisible, setImageSheetVisible] = useState(false);
  const [currentUploadIndex, setCurrentUploadIndex] = useState<number | null>(
    null,
  );
  const [imageUris, setImageUris] = useState<(Asset | null)[]>([null, null]);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [fetchedAddress, setFetchedAddress] = useState<string>('');
  const [buttonText, setButtonText] = useState('Locate Me');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const addressTypes = ['Home', 'Work', 'Other'];
  const [selectedType, setSelectedType] = useState<string>(addressTypes[0]);

  const schema = yup.object().shape({
    fullName: yup.string().required('Full Name is required'),
    phoneNumber: yup
      .string()
      .required('Phone Number is required')
      .length(10, 'Phone Number must be 10 digits'),
    flatNumber: yup.string().required('Flat number is required'),
    streetAddress: yup.string().required('Street Address is required'),
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      flatNumber: '',
      streetAddress: '',
    },
  });

  // Pre-populate form when editing
  useEffect(() => {
    if (isEditMode && editingAddress) {
      setValue('fullName', editingAddress.fullName || '');
      setValue('phoneNumber', editingAddress.phoneNumber || '');
      setValue('flatNumber', editingAddress.addressLine1 || '');
      setValue('streetAddress', editingAddress.addressLine2 || '');
      setFetchedAddress(editingAddress.location || '');
      
      // Normalize address type like in LocationAddressScreen
      if (editingAddress.addressType) {
        const normalized = editingAddress.addressType.toLowerCase();
        const titleCased = normalized.charAt(0).toUpperCase() + normalized.slice(1);
        
        if (titleCased === 'Home' || titleCased === 'Work' || titleCased === 'Other') {
          setSelectedType(titleCased);
        } else {
          setSelectedType('Other');
        }
      } else {
        setSelectedType('Other');
      }
      
      if (editingAddress.latitude && editingAddress.longitude) {
        setLocation({
          latitude: parseFloat(editingAddress.latitude),
          longitude: parseFloat(editingAddress.longitude),
        });
      }

      // Pre-populate images if they exist
      const images = [];
      if (editingAddress.image1) {
        images.push({ uri: editingAddress.image1 } as Asset);
      }
      if (editingAddress.image2) {
        images.push({ uri: editingAddress.image2 } as Asset);
      }
      setImageUris([images[0] || null, images[1] || null]);
    }
  }, [isEditMode, editingAddress, setValue]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'We need access to your location to fetch your current location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS handles location permission differently
  };

  const checkGPSStatus = async () => {
    if (Platform.OS === 'android') {
      try {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return hasPermission;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const fetchLocation = async () => {
    console.log('Starting location fetch...');
    setButtonText('Loading...');
    try {
      setIsFetchingLocation(true);
      console.log('Requesting location permission...');
      const hasPermission = await requestLocationPermission();

      if (!hasPermission) {
        console.warn('Location permission denied');
        setButtonText('Locate Me');
        setIsFetchingLocation(false);
        return;
      }

      console.log('Checking GPS status...');
      const isGPSEnabled = await checkGPSStatus();
      if (!isGPSEnabled) {
        console.warn('GPS is disabled');
        setButtonText('Locate Me');
        setIsFetchingLocation(false);
        return;
      }

      console.log('Getting current position...');
      Geolocation.getCurrentPosition(
        async position => {
          console.log('Position obtained:', position);
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(coords);
          console.log('Coordinates set:', coords);

          handleLocationUpdate(coords);

          // Get address from coordinates using ApiContext
          try {
            console.log(
              'Fetching address from coordinates using ApiContext...',
            );
            const address = await api.getAddressFromCoordinates(
              coords.latitude,
              coords.longitude,
            );
            console.log('Fetched address from ApiContext:', address);
            setFetchedAddress(address || '');
          } catch (err) {
            console.error('Address fetch error from ApiContext:', err);
            setFetchedAddress('');
          }
        },
        error => {
          console.error('Error getting current position:', error);
          setButtonText('Get location');
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 10000,
        },
      );
    } catch (err) {
      console.error('Unexpected error in fetchLocation:', err);
      setButtonText('Get location');
    } finally {
      console.log('Location fetch attempt complete');
      setIsFetchingLocation(false);
    }
  };

  useEffect(() => {
    console.log('Auto-fetch location check - isEditMode:', isEditMode, 'editingAddress:', !!editingAddress);
    // Only auto-fetch location if not in edit mode AND no editing address
    if (!isEditMode && !editingAddress) {
      fetchLocation();
    }
  }, [isEditMode, editingAddress]);

  const handleLocationUpdate = (location: any) => {
    console.log('Location updated:', location, 'isEditMode:', isEditMode);
    
    // In edit mode, ignore location updates to prevent overwriting existing location
    if (isEditMode) {
      console.log('Ignoring location update in edit mode to preserve existing location');
      return;
    }
    
    setLocation(location);
  };

  const handleFetchLocation = () => {
    console.log('Fetch location pressed');
    if (isEditMode) {
      // In edit mode, allow updating the location
      fetchLocation();
    } else {
      // In add mode, fetch current location
      fetchLocation();
    }
  };

  const handleUpload = (index: number) => {
    setCurrentUploadIndex(index);
    setImageSheetVisible(true);
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

  const handleFormSubmit = async (data: any) => {
    try {
      console.log('Form Data:', data);

      // Validate required fields
      if (!data.fullName?.trim()) {
        Alert.alert('Error', 'Please enter your full name.');
        return;
      }

      if (!data.phoneNumber?.trim()) {
        Alert.alert('Error', 'Please enter your phone number.');
        return;
      }

      if (!data.flatNumber?.trim()) {
        Alert.alert('Error', 'Please enter your flat/house number.');
        return;
      }

      if (!data.streetAddress?.trim()) {
        Alert.alert('Error', 'Please enter your street address.');
        return;
      }

      // Get phone number from storage
      const getPhonenumber = await getStoredPhoneNumber();
      if (!getPhonenumber) {
        Alert.alert('Error', 'Phone number not found. Please login again.');
        return;
      }

      // Create FormData as required by the API
      const formData = new FormData();

      // Append text fields
      formData.append('customerPhoneNumber', getPhonenumber);
      formData.append('fullName', data.fullName || '');
      formData.append('phoneNumber', data.phoneNumber || '');
      formData.append('email', ''); // Email field removed from form, sending empty string
      formData.append('addressLine1', data.flatNumber || ''); // Flat, House No, Apartment
      formData.append('addressLine2', data.streetAddress || ''); // Locality, Area, Colony, Street
      formData.append('location', fetchedAddress || '');
      formData.append('pincode', ''); // Pincode field removed from form, sending empty string
      formData.append('addressType', selectedType);
      formData.append('isDefault', 'false');
      formData.append('latitude', location?.latitude?.toString() || '');
      formData.append('longitude', location?.longitude?.toString() || '');

      // Add customerAddressId for update operations
      if (isEditMode && editingAddress?.customerAddressId) {
        formData.append('customerAddressId', editingAddress.customerAddressId);
      }

      console.log('handleFormSubmit formData ::', formData);
      // Append images if they exist and are local files
      if (imageUris[0]?.uri?.startsWith('file://')) {
        const image1 = imageUris[0];
        formData.append('image1', {
          uri: image1.uri || '',
          name: image1.fileName || getFileNameFromUri(image1.uri || ''),
          type: image1.type || getMimeType(image1.uri || ''),
        } as any);
      }

      if (imageUris[1]?.uri?.startsWith('file://')) {
        const image2 = imageUris[1];
        formData.append('image2', {
          uri: image2.uri || '',
          name: image2.fileName || getFileNameFromUri(image2.uri || ''),
          type: image2.type || getMimeType(image2.uri || ''),
        } as any);
      }

      console.log('Submitting address FormData:', formData);

      // Call the appropriate API based on mode
      let response;
      if (isEditMode && editingAddress?.customerAddressId) {
        response = await updateCustomerAddressAPI(formData);
        console.log('Address updated successfully:', response);
        Alert.alert('Success', 'Address updated successfully!', [
          {
            text: 'OK',
            onPress: () => {
              // Call the onSubmit prop to handle navigation or other actions
              onSubmit(formData);
            },
          },
        ]);
      } else {
        response = await createCustomerAddressAPI(formData);
        console.log('Address created successfully:', response);
        Alert.alert('Success', 'Address added successfully!', [
          {
            text: 'OK',
            onPress: () => {
              // Call the onSubmit prop to handle navigation or other actions
              onSubmit(formData);
            },
          },
        ]);
      }
    } catch (error: any) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} customer address:`, error);

      // Provide more specific error messages
      let errorMessage = `Failed to ${isEditMode ? 'update' : 'add'} address. Please try again.`;

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
    }
  };

  const handleDoLater = () => {
    if (isEditMode) {
      // In edit mode, just go back without saving
      onBack();
    } else {
      // In add mode, this is "I'll do it later"
      onBack();
    }
  };

  const handleCamera = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'We need access to your camera to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
        } else {
          console.log('Camera permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
      }
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
      } else if (
        response.assets &&
        response.assets.length > 0 &&
        currentUploadIndex !== null
      ) {
        setImageUris(prev => {
          const updated = [...prev];
          updated[currentUploadIndex] = response.assets?.[0] ?? null;
          return updated;
        });
      }
    });
    setImageSheetVisible(false);
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
        } else if (
          response.assets &&
          response.assets.length > 0 &&
          currentUploadIndex !== null
        ) {
          setImageUris(prev => {
            const updated = [...prev];
            updated[currentUploadIndex] = response.assets?.[0] ?? null;
            return updated;
          });
        }
      },
    );
    setImageSheetVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <SimpleIcon
            source={imagePaths.back_icon || '←'}
            size={wp(5)}
            color={Colors.black}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditMode ? 'Edit Address' : 'Add Address'}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        {/* Map Section */}
        <View style={styles.mapContainer}>
          <View
            style={{
              height: hp(30),
              borderRadius: wp(2),
              overflow: 'hidden',
              marginBottom: hp(2),
            }}>
            <EnhancedMap
              onLocationUpdate={handleLocationUpdate}
              compactSearchBar
            />
          </View>

          <TouchableOpacity
            style={styles.fetchLocationButton}
            onPress={handleFetchLocation}>
            <SimpleIcon
              source={imagePaths.Location_Icon || '🧭'}
              size={wp(4)}
              color={Colors.white}
            />
            <Text style={styles.fetchLocationText}>
              {isEditMode ? 'Update Location' : 'Fetch Location'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View style={styles.inputSection}>
          <InputField
            control={control}
            name="fullName"
            errors={errors}
            placeholder="Full Name"
          />

          <InputField
            control={control}
            name="phoneNumber"
            errors={errors}
            placeholder="Phone Number (Entered Value)"
            keyboardType="phone-pad"
          />

          <InputField
            control={control}
            name="flatNumber"
            errors={errors}
            placeholder="Flat, House No, Apartment"
          />

          <InputField
            control={control}
            name="streetAddress"
            errors={errors}
            placeholder="Locality, Area, Colony, Street"
            multiline
          />
        </View>

        {/* Upload Section */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Upload Images</Text>
          <View style={styles.uploadContainer}>
            {[0, 1].map(index => (
              <View key={index} style={styles.uploadCard}>
                {imageUris[index] ? (
                  <View style={styles.imageWrapper}>
                    <Image
                      source={{uri: imageUris[index]?.uri}}
                      style={styles.imagePreview}
                    />
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => {
                        setImageUris(prev => {
                          const updated = [...prev];
                          updated[index] = null;
                          return updated;
                        });
                      }}>
                      <Text style={styles.closeButtonText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.uploadButtonCard}
                    onPress={() => handleUpload(index)}>
                    <Text style={styles.plusIcon}>＋</Text>
                    <Text style={styles.uploadText}>Upload {index + 1}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>
        <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: hp(1.2),
      }}
    >
      {addressTypes.map((type) => {
        const isSelected = selectedType === type;
        return (
          <TouchableOpacity
            key={type}
            onPress={() => setSelectedType(type)}
            style={{
              paddingVertical: hp(1.2),
              paddingHorizontal: wp(5),
              borderRadius: wp(5),
              backgroundColor: isSelected ? '#7CC467' : '#f0f0f0',
              marginHorizontal: wp(1.2),
            }}
          >
            <Text
              style={{
                color: isSelected ? '#fff' : '#444',
                fontSize: sp(14),
                fontWeight: isSelected ? 'bold' : 'normal',
              }}
            >
              {type}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>

        {/* Action Buttons */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(handleFormSubmit)}>
            <Text style={styles.submitButtonText}>{isEditMode ? 'Update' : 'Submit'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.doLaterButton}
            onPress={handleDoLater}>
            <Text style={styles.doLaterButtonText}>{isEditMode ? 'Cancel' : "I'll do it later"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ImageSelectionBottomSheet
        isVisible={isImageSheetVisible}
        onClose={() => setImageSheetVisible(false)}
        onCameraPress={handleCamera}
        onGalleryPress={handleGallery}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp(5),
    maxHeight: hp(80),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.4),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  backButton: {
    padding: wp(1),
  },
  headerTitle: {
    fontSize: sp(18),
    fontWeight: '600',
    color: Colors.black,
    marginBottom: hp(2),
    textAlign: 'center',
  },
  placeholder: {
    width: wp(10),
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: wp(4),
  },
  scrollViewContent: {
    paddingBottom: hp(1),
  },
  mapContainer: {
    marginTop: hp(2),
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: sp(10),
    color: Colors.grey,
    fontFamily: FontFamily.MEDIUM,
  },
  fetchLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
    marginTop: hp(1),
  },
  fetchLocationText: {
    fontSize: sp(14),
    fontFamily: FontFamily.MEDIUM,
    color: Colors.white,
    marginLeft: wp(2),
  },
  inputSection: {
    marginTop: hp(3),
  },
  sectionTitle: {
    fontSize: sp(12),
    fontFamily: FontFamily.SEMIBOLD,
    color: Colors.black,
    marginBottom: hp(2),
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
    marginBottom: hp(1),
    lineHeight: sp(18),
    minHeight: hp(6),
  },
  uploadSection: {
    // marginTop: hp(1),
  },
  uploadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    // marginTop: hp(1),
  },
  uploadCard: {
    width: '48%',
    aspectRatio: 1, // Ensures width and height are always equal
    borderRadius: wp(4),
    marginBottom: hp(1.5),
    backgroundColor: '#fff',
    overflow: 'hidden',
    position: 'relative',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: wp(4),
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: wp(4),
    resizeMode: 'cover',
  },
  uploadButtonCard: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: '#bbb',
    borderStyle: 'dashed',
    borderRadius: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafbfc',
  },
  plusIcon: {
    fontSize: sp(36),
    color: '#bbb',
    marginBottom: hp(0.5),
  },
  uploadText: {
    color: '#888',
    fontSize: sp(14),
    fontWeight: '500',
  },
  closeButton: {
    position: 'absolute',
    top: hp(0.6),
    right: wp(1.2),
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: wp(4),
    width: wp(6),
    height: wp(6),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: sp(18),
    fontWeight: 'bold',
    lineHeight: sp(20),
  },
  buttonSection: {
    marginTop: hp(1),
    marginBottom: hp(0.5),
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(2),
    borderRadius: wp(2),
    alignItems: 'center',
    marginBottom: hp(1),
  },
  submitButtonText: {
    fontSize: sp(12),
    fontFamily: FontFamily.SEMIBOLD,
    color: Colors.white,
  },
  doLaterButton: {
    paddingVertical: hp(1.5),
    alignItems: 'center',
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
  },
  doLaterButtonText: {
    fontSize: sp(12),
    fontFamily: FontFamily.MEDIUM,
    color: Colors.grey,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: hp(2),
  },

  errorIndicator: {
    position: 'absolute',
    right: wp(2),
    top: hp(1.7),
    width: wp(5),
    height: wp(5),
    borderRadius: wp(3),
    backgroundColor: Colors.danger,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorIcon: {
    color: Colors.white,
    fontSize: sp(14),
    fontWeight: 'bold',
  },

  errorMessage: {
    color: Colors.danger,
    fontSize: sp(12),
    marginTop: hp(0.5),
    marginLeft: wp(1),
  },
});

export default AddAddressForm;
