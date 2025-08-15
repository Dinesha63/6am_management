import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Colors} from '../../constants/colors';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {
  addEmployeeApi,
  fetchEmployeeByIdApi,
} from '../../redux/thunks/employeeApiThunks';
import {resetEmployeeApiStatus} from '../../redux/slices/employeeApiSlice';
import {storeEmployeeData, storeEmployeeStores} from '../../utils/storage';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {fetchRegions} from '../../redux/thunks/regionThunks';
import {
  regionSelector,
  resetRegionApiStatus,
} from '../../redux/slices/regionsSlice';
import Dropdown from './Component/DropDown';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rs,
} from '../../constants/ResponsiveScreen';


interface DeliveryBoyBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  phoneNumber: string;
}

const emojiRegex =
  /(\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;

const validateAddress = (value: string) => {
  if (!value || value.trim().length < 5) {
    return 'Address must be at least 5 characters.';
  }
  if (emojiRegex.test(value)) {
    return 'Emoji characters are not allowed.';
  }
  return true;
};

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .test(
      'min-if-filled',
      'Name must be at least 3 Characters',
      value => !value || value.length >= 3,
    )
    .matches(
      /^[A-Za-z0-9\s]+$/,
      'Name must contain only letters, numbers, and spaces',
    ),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  address: yup
    .string()
    .required('Address is required')
    .test(
      'min-length',
      'Address must be at least 5 characters',
      value => value?.trim().length >= 5,
    )
    .test(
      'no-emoji',
      'Address cannot contain emoji',
      value => !emojiRegex.test(value || ''),
    ),

  regionId: yup.string().required('Region is required'),
  routeId: yup.string().required('Route is required'),
});

const DeliveryBoyBottomSheet: React.FC<DeliveryBoyBottomSheetProps> = ({
  visible,
  onClose,
  phoneNumber,
}) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {data, fetchLoad1, status} = useAppSelector(regionSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // console.log(data,fetchLoad,status, 'datasdkf');

  useEffect(() => {
    console.log(data, fetchLoad1, status, 'datasdkf');
  }, [data, fetchLoad1, status]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      phone: phoneNumber || '',
      address: '',
      regionId: '',
      routeId: '',
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    dispatch(fetchRegions());
  }, []);

  useEffect(() => {
    if (fetchLoad1 === 'succeeded') {
      dispatch(resetRegionApiStatus());
    }
  }, [fetchLoad1]);

  useEffect(() => {
    if (phoneNumber) {
      reset(prev => ({...prev, phone: phoneNumber}));
    }
  }, [phoneNumber]);

  const onSubmit = async (data: any) => {
    // console.log(data, "skdjfdkjf")
    console.log(data, 'dsfjdsfjk');
    // return
    setIsLoading(true);
    try {
      const addResponse = await dispatch(
        addEmployeeApi({
          name: data.name,
          address1: data.address,
          mobile: data.phone,
          routeId: data.routeId,
          stores: [data.regionId],
        }),
      ).unwrap();

      dispatch(resetEmployeeApiStatus());

      if (addResponse?.success) {
        const fetchResponse = await dispatch(
          fetchEmployeeByIdApi(data.phone),
        ).unwrap();

        if (fetchResponse?.data) {
          const employee = fetchResponse.data;
          await storeEmployeeData(employee);
          await storeEmployeeStores(employee.employeeStores);
          navigation.replace('Map');
        }
      }
    } catch (error) {
      console.error('Failed to save or fetch employee:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('isKeyboardVisible ::');
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{flex: 1}}>
          <View style={styles.overlay}>
            <Pressable style={styles.backdrop} onPress={handleClose} />
            <View style={styles.bottomSheet}>
              <View style={styles.header}>
                <Text style={styles.title}>Add Delivery Boy Details</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}>
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.description}>
                Please provide delivery boy information for phone number:{' '}
                {phoneNumber}
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name *</Text>
                <Controller
                  control={control}
                  name="name"
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={[styles.input, errors.name && styles.inputError]}
                      placeholder="Enter delivery boy name"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name.message}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number *</Text>
                <Controller
                  control={control}
                  name="phone"
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={[styles.input, errors.phone && styles.inputError]}
                      placeholder="Enter phone number"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                  )}
                />
                {errors.phone && (
                  <Text style={styles.errorText}>{errors.phone.message}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Address *</Text>
                <Controller
                  control={control}
                  name="address"
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={[
                        styles.input,
                        errors.address && styles.inputError,
                      ]}
                      placeholder="Enter address"
                      value={value}
                      onChangeText={onChange}
                      // multiline
                    />
                  )}
                />
                {errors.address && (
                  <Text style={styles.errorText}>{errors.address.message}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Controller
                  control={control}
                  name="regionId"
                  render={({
                    field: {onChange, value},
                    fieldState: {error, isTouched},
                  }) => (
                    <Dropdown
                      label={{region: 'Select Region', route: 'Select Route'}}
                      value={value}
                      options={data.map(region => ({
                        label: region.name,
                        value: region.storeId,
                      }))}
                      onSelect={(selectedRouteId, selectedRegionId) => {
                        onChange(selectedRegionId);
                        setValue('routeId', selectedRouteId ?? '');
                      }}
                      error={error?.message}
                      touched={isTouched}
                    />
                  )}
                />

                {errors.regionId && (
                  <Text style={styles.errorText}>
                    {errors.regionId.message}
                  </Text>
                )}
              </View>
              {!isKeyboardVisible && (
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSubmit(onSubmit)}
                  disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: rs(20),
    borderTopRightRadius: rs(20),
    padding: rs(20),
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rs(15),
  },
  title: {
    fontSize: sp(18),
    fontWeight: 'bold',
    color: Colors.dark,
  },
  closeButton: {
    padding: rs(5),
  },
  closeIcon: {
    fontSize: sp(20),
    color: Colors.listSeconary,
  },
  description: {
    fontSize: sp(14),
    color: Colors.listSeconary,
    marginBottom: rs(20),
  },
  inputContainer: {
    marginBottom: rs(15),
  },
  label: {
    fontSize: sp(14),
    fontWeight: 'bold',
    marginBottom: rs(5),
    color: Colors.dark,
  },
  input: {
    borderWidth: rs(1),
    borderColor: Colors.greyBackground,
    borderRadius: rs(8),
    padding: rs(10),
    fontSize: sp(16),
    color: Colors.dark,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    color: Colors.danger,
    fontSize: sp(12),
    marginTop: rs(5),
  },
  saveButton: {
    backgroundColor: '#36A546',
    borderRadius: rs(8),
    padding: rs(12),
    alignItems: 'center',
    marginTop: rs(10),
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: sp(16),
  },
  dropdown: {
    borderWidth: rs(1),
    borderColor: '#ccc',
    borderRadius: rs(5),
    padding: rs(8),
  },
  dropdownItem: {
    paddingVertical: rs(6),
    paddingHorizontal: rs(8),
  },
  selectedItem: {
    backgroundColor: '#e0e0e0',
  },
});

export default DeliveryBoyBottomSheet;

function addDeliveryApi(deliveryData: {
  customerName: string;
  address: string;
  phoneNumber: string;
  status: string;
  date: string;
}): any {
  throw new Error('Function not implemented.');
}
