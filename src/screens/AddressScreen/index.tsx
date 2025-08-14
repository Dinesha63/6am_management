import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Text as RNText,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import Header from './Header';
import LocationButton from './components/LocationButton';
import AddressTypeSelector from './components/AddressTypeSelector';
import SubmitButton from './components/SubmitButton';
import InfoTooltip from './components/InfoTooltip';
import {AddressValidateSchema} from './components/AddressValidation';
import FormField from './components/FormField';
import {FontFamily} from '../../utils/constant';
import SimpleIcon from '../../components/SimpleIcon';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import {useAppDispatch, useAppSelector} from '../../hooks/useAppDispatch';
import {RootStackParamList} from '../../types';
import {
  createCustomerAddress,
  updateCustomerAddress,
} from '../../redux/Features/Address/addressThunk';
import FloatingLabelInput from './components/FloatingLabelInput';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Address'>;

type AddressFormData = {
  fullName: string;
  phoneNumber: string;
  email: string;
  location: string;
  addressLine1: string;
  addressLine2?: string;
  pincode: string;
};

const AddressScreen: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<Props['route']>();
  const {addressCreationLoading, addressCreationError} = useAppSelector(
    s => s.customer,
  );
  const addressData = route.params?.addressData;
  const locationData = route.params?.formData;
  console.log(addressData, 'addressData in AddresddsScreen');
  console.log(locationData, 'locationData in AddressScreen');
  const goToPaymentOnBack = route?.params?.goToPaymentOnBack ?? false;
  const goToAccountOnBack = route?.params?.goToAccountOnBack ?? false;

  console.log('AddressScreen goToAccountOnBack ::', goToAccountOnBack);

  const [addressType, setAddressType] = useState<'Home' | 'Office' | 'Other'>(
    'Home',
  );
  const [agreed, setAgreed] = useState(false);
  const [savedLocation, setSavedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
    reset,
    setValue,
  } = useForm<AddressFormData>({
    resolver: yupResolver(AddressValidateSchema),
    mode: 'onTouched',
  });

  const locationValue = watch('location');

  console.log(errors, 'erroesaddres');

  useEffect(() => {
    if (addressData) {
      reset({
        fullName: addressData.fullName,
        phoneNumber: addressData.phoneNumber,
        email: addressData.email,
        location: addressData.location,
        addressLine1: addressData.addressLine1,
        addressLine2: addressData.addressLine2 ?? '',
        pincode: addressData.pincode,
      });
      if (addressData.latitude && addressData.longitude) {
        setSavedLocation({
          latitude: addressData?.latitude,
          longitude: addressData?.longitude,
        });
        setValue('location', addressData.location);
      }
    }
  }, [addressData, reset, setValue]);
 useEffect(() => {
    if (locationData) {
      reset({
        fullName: locationData.fullName,
        phoneNumber: locationData.phoneNumber,
        email: locationData.email,
        location: locationData.location,
        addressLine1: locationData.addressLine1,
        addressLine2: locationData.addressLine2 ?? '',
        pincode: locationData.pincode,
      });
      if (locationData.latitude && locationData.longitude) {
        setSavedLocation({
          latitude: locationData?.latitude,
          longitude: locationData?.longitude,
        });
        setValue('location', locationData.location);
      }
    }
  }, [locationData, reset, setValue]);

  const onPressLocation = () => {
    navigation.navigate('Location', {
      formData: {
        ...watch(),
        savedLocation,
        addressData,
      },
      addressData,
    });
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

  const onSubmitForm = handleSubmit(async data => {
    try {
      const phone = await AsyncStorage.getItem('userPhoneNumber');
      const savedLocation = route.params?.formData?.savedLocation;
      const images = savedLocation?.images || [];

      const formData = new FormData();

      // Append text fields
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
      formData.append('latitude', savedLocation?.latitude?.toString() || '');
      formData.append('longitude', savedLocation?.longitude?.toString() || '');

   // Append image1 and image2 if new images (local file URIs) are selected
if (images[0]?.uri?.startsWith('file://')) {
  const image1 = images[0];
  formData.append('image1', {
    uri: image1.uri,
    name: image1.fileName || getFileNameFromUri(image1.uri),
    type: image1.type || getMimeType(image1.uri),
  } as any);
}


if (images[1]?.uri?.startsWith('file://')) {
  const image2 = images[1];
  formData.append('image2', {
    uri: image2.uri,
    name: image2.fileName || getFileNameFromUri(image2.uri),
    type: image2.type || getMimeType(image2.uri),
  } as any);
}


      console.log('FormData ready for address creation:', formData,addressData?.customerAddressId);
// return
      // Dispatch the thunk or call API
      if (addressData?.customerAddressId) {
        formData.append('customerAddressId', addressData.customerAddressId);
        await dispatch(updateCustomerAddress(formData)).unwrap();
      } else {
       await dispatch(createCustomerAddress(formData)).unwrap();
      }

      // Navigate on success
      navigation.navigate('AddressSuccessScreen');
    } catch (error) {
      console.error('Failed to create customer address:', error);
      // Optional: Show alert or UI feedback here
    }
  });


  return (
    <SafeAreaView style={styles.container}>
      <Header
        goToPaymentOnBack={goToPaymentOnBack}
        goToAccountOnBack={goToAccountOnBack}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FloatingLabelInput
          label="Full Name"
          value={watch('fullName')}
          keyboardType="default"
          maxLength={50}
          onChangeText={text => {
            const cleaned = text.replace(/[^a-zA-Z\s]/g, '');
            setValue('fullName', cleaned, {shouldValidate: true});
          }}
        />
        {errors.fullName && <InfoTooltip message={errors.fullName.message} />}

        <FloatingLabelInput
          label="Phone Number"
          value={watch('phoneNumber')}
          keyboardType="phone-pad"
          maxLength={10}
          onChangeText={text => {
            const cleaned = text.replace(/[^0-9]/g, '');
            setValue('phoneNumber', cleaned, {shouldValidate: true});
          }}
        />
        {errors.phoneNumber && (
          <InfoTooltip message={errors.phoneNumber.message} />
        )}

        <FloatingLabelInput
          label="Email"
          value={watch('email')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={text => {
            // optional: strip spaces
            const cleaned = text.trim();
            setValue('email', cleaned, {shouldValidate: true});
          }}
        />
        {errors.email && <InfoTooltip message={errors.email.message} />}

        <View style={styles.viewInput}>
          <LocationButton
            value={watch('location')}
            onPress={onPressLocation}
            hasLocation={!!savedLocation}
          />
          {errors.location && <InfoTooltip message={errors.location.message} />}
        </View>

        <FloatingLabelInput
          label="Address Line 1"
          value={watch('addressLine1')}
          onChangeText={text =>
            setValue('addressLine1', text, {shouldValidate: true})
          }
        />
        {errors.addressLine1 && (
          <InfoTooltip message={errors.addressLine1.message} />
        )}

        <FloatingLabelInput
          label="Address Line 2"
          value={watch('addressLine2') ?? ''}
          onChangeText={text =>
            setValue('addressLine2', text, {shouldValidate: true})
          }
        />
        {errors.addressLine2 && (
          <InfoTooltip message={errors.addressLine2.message} />
        )}
        <FloatingLabelInput
          label="Pincode"
          value={watch('pincode')}
          keyboardType="numeric"
          maxLength={6}
          onChangeText={text => {
            const cleaned = text.replace(/[^0-9]/g, '');
            setValue('pincode', cleaned, {shouldValidate: true});
          }}
        />
        {errors.pincode && <InfoTooltip message={errors.pincode.message} />}

        <AddressTypeSelector
          selectedType={addressType}
          onTypeSelect={(type: string) => {
            if (type === 'Home' || type === 'Office' || type === 'Other')
              setAddressType(type);
          }}
        />

        {addressCreationError && (
          <RNText style={styles.errorText}>{addressCreationError}</RNText>
        )}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.termsContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setAgreed(prev => !prev)}>
            <View
              style={[styles.checkboxInner, agreed && styles.checkboxChecked]}
            />
          </TouchableOpacity>
          <RNText style={styles.termsText}>
            By submitting, you agree to our Terms of Service and Privacy Policy
          </RNText>
        </View>

        <SubmitButton
          onPress={onSubmitForm}
          disabled={!agreed || !!addressCreationLoading}
          title="Submit"
        />
        {addressCreationLoading && <ActivityIndicator style={styles.loading} />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
  scrollContent: {padding: 16, paddingBottom: 150},
  viewInput: {marginBottom: 16, position: 'relative'},
  errorText: {color: 'red', marginTop: 8},
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: 16,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {width: 14, height: 14},
  checkboxChecked: {backgroundColor: Colors.primary},
  termsText: {flex: 1},
  loading: {position: 'absolute', right: 32, bottom: 24},
});

export default AddressScreen;
