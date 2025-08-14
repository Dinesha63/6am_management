import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {TabRoutes} from '../../navigation/routes';
import {BottomTabParamList} from '../../navigation/BottomTabNavigator';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {Routes} from '../../navigation/routes';
import Header from './Header';
import SimpleIcon from '../../components/SimpleIcon';
import {imagePaths} from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import {useAppDispatch} from '../../hooks/useAppDispatch';
import {
  fetchCustomerAddress,
  setDefaultAddress,
} from '../../redux/Features/Address/addressThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Address {
  customerAddressId: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  location: string;
  pincode: string;
  addressType: string;
  latitude: string;
  longitude: string;
  image1: null;
  image2: null;
  isDefault: boolean;
  customerPhoneNumber?: string;
}

type Props = NativeStackScreenProps<RootStackParamList, 'MyAddressScreen'>;

const MyAddressScreen: React.FC<Props> = ({}) => {
  const dispatch = useAppDispatch();
  const route = useRoute<Props['route']>();

  const goToAccountOnBack = route?.params?.goToAccountOnBack ?? false;

  type StackNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'MyAddressScreen'
  >;
  const Stacknavigation = useNavigation<StackNavigationProp>();
  type TabNavigationProp = BottomTabNavigationProp<
    BottomTabParamList,
    'Account'
  >;
  const Tabnavigation = useNavigation<TabNavigationProp>();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingDefaultId, setLoadingDefaultId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // const newAddress = route?.params?.newAddress;
  // const existingAddresses = route?.params?.existingAddresses || [];
  const fetchAddresses = async () => {
    const phone = await AsyncStorage.getItem('userPhoneNumber');
    console.log('Fetching addresses for phone:', phone);
    if (phone) {
      try {
        setIsLoading(true);
        const safeExistingAddresses = await dispatch(
          fetchCustomerAddress(phone || ''),
        ).unwrap();
        console.log(safeExistingAddresses, 'safeExistingAddresses');
        setAddresses(safeExistingAddresses || []);
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
        setAddresses([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.error('No phone number found in AsyncStorage');
      setAddresses([]);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Refresh addresses when screen comes into focus (after editing)
  useEffect(() => {
    const unsubscribe = Stacknavigation.addListener('focus', () => {
      fetchAddresses();
    });

    return unsubscribe;
  }, [Stacknavigation]);

  const getAddressTypeColor = (type: string) => {
    switch (type) {
      case 'DEFAULT':
        return '#6B46C1';
      case 'HOME':
        return '#7CC467';
      case 'OFFICE':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const handleAddNewAddress = () => {
    Stacknavigation.navigate({
      name: 'LocationAddressScreen', 
      params: {
        addressData: undefined,
        formData: { goToAccountOnBack }
      }
    });
  };

  const handleEditAddress = (address: Address) => {
    console.log('Editing address:', address);
    Stacknavigation.navigate({
      name: 'LocationAddressScreen',
      params: {
        addressData: address,
        formData: { 
          existingAddresses: addresses,
          editingId: address.customerAddressId,
          goToAccountOnBack 
        },
      },
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddresses(prevAddresses =>
      prevAddresses.filter(addr => addr.customerAddressId !== addressId),
    );
  };

  const handleSetDefault = async (addressId: string) => {
    console.log('Setting default address for ID:', addressId);
    // return;
    try {
      setLoadingDefaultId(addressId);
      const phoneNumber = await AsyncStorage.getItem('userPhoneNumber');
      const payload = {
        phoneNumber: phoneNumber || '',
        customerAddressId: addressId,
      };
      await dispatch(setDefaultAddress(payload)).unwrap();
     fetchAddresses();
    } catch (error) {
      console.error('Failed to set default address:', error);
      ToastAndroid.show('Failed to update default address', ToastAndroid.SHORT);
    } finally {
      setLoadingDefaultId(null);
    }
  };

  //   const handleBack = () => {
  //    Stacknavigation.navigate(TabRoutes.Account);
  // };

  const handleBack = () => {
    Tabnavigation.goBack();
  };

  // const handleBack = () => {
  //    Stacknavigation.navigate(Routes.Main, { screen: TabRoutes.Account });
  // };

  // const handleBack = () => {
  //   Stacknavigation.navigate('Account');
  // };

  // const handleBack = () => {
  //   Stacknavigation.navigate(Routes.Main, { screen: 'Account' });
  // };

  const renderAddressCard = (address: any) => {
    console.log(address, 'Rendering address cSDFDard');
    return (
      <View
        key={address.customerAddressId}
        style={[
          styles.addressCard,
          {borderColor: address.isDefault ? '#6B46C1' : '#E5E7EB'},
        ]}>
        <View style={styles.cardTopRow}>
          <View style={styles.leftColumn}>
            <TouchableOpacity
              style={styles.checkboxCircle}
              disabled={loadingDefaultId !== null}
              onPress={() => handleSetDefault(address.customerAddressId)}>
              {/* {address.isDefault && <View style={styles.checkedDot} />} */}
              {loadingDefaultId === address.customerAddressId ? (
                <ActivityIndicator size="small" color="#6B46C1" />
              ) : (
                address.isDefault && <View style={styles.checkedDot} />
              )}
            </TouchableOpacity>
            <View style={styles.addressContent}>
              {address.fullName && (
                <Text style={styles.nameText}>{address.fullName}</Text>
              )}
              {address.addressLine1 && (
                <Text style={styles.addressText}>{address.addressLine1}</Text>
              )}
              {address.addressLine2 && (
                <Text style={styles.addressText}>{address.addressLine2}</Text>
              )}
              {address.location && (
                <Text style={styles.addressText}>{address.location}</Text>
              )}
              {address.pincode && (
                <Text style={styles.addressText}>Pincode: {address.pincode}</Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditAddress(address)}
            activeOpacity={0.7}>
            <SimpleIcon source={imagePaths.Edit_icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.phoneRow}>
          {address.phoneNumber && (
            <Text style={styles.phoneText}>📞 +91 {address.phoneNumber}</Text>
          )}
          <View style={styles.tagsContainer}>
            {address.isDefault && (
              <View style={styles.defaultTag}>
                <Text style={styles.tagText}>DEFAULT</Text>
              </View>
            )}
            <View
              style={[
                styles.typeTag,
                {backgroundColor: getAddressTypeColor(address.addressType)},
              ]}>
              <Text style={styles.tagText}>{address.addressType}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading addresses...</Text>
          </View>
        ) : Array.isArray(addresses) && addresses.length > 0 ? (
          addresses?.map(renderAddressCard)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No addresses found</Text>
            <Text style={styles.emptyStateSubtext}>
              Add your first address to get started
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={handleAddNewAddress}>
              <Text style={styles.emptyStateButtonText}>Add New Address</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {Array.isArray(addresses) && addresses.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddNewAddress}>
            <Text style={styles.addButtonText}>Add New Address</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(8),
  },
  emptyStateText: {
    fontSize: sp(18),
    fontWeight: '600',
    color: Colors.blackText,
    marginBottom: hp(1),
  },
  emptyStateSubtext: {
    fontSize: sp(14),
    color: Colors.lightGrey,
    textAlign: 'center',
    marginBottom: hp(3),
  },
  emptyStateButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp(8),
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
  },
  emptyStateButtonText: {
    color: Colors.white,
    fontSize: sp(16),
    fontWeight: '600',
  },
  addressCard: {
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(1.5),
  },
  leftColumn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: wp(3),
    flex: 1,
  },
  checkboxCircle: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    borderWidth: 2,
    borderColor: Colors.darkPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(0.5),
  },
  checkedDot: {
    width: wp(2.5),
    height: wp(2.5),
    borderRadius: wp(1.25),
    backgroundColor: Colors.darkPurple,
  },
  editButton: {
    padding: wp(1),
  },
  addressContent: {
    flex: 1,
  },
  nameText: {
    fontSize: sp(16),
    fontWeight: '600',
    color: Colors.navyBlue,
    marginBottom: hp(0.5),
  },
  addressText: {
    fontSize: sp(14),
    color: Colors.lightGrey,
    lineHeight: hp(2.5),
    marginBottom: hp(0.3),
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(1),
  },
  phoneText: {
    fontSize: sp(14),
    color: Colors.lightGrey,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  defaultTag: {
    backgroundColor: Colors.darkPurple,
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
  },
  typeTag: {
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
  },
  tagText: {
    color: Colors.white,
    fontSize: sp(12),
    fontWeight: '600',
  },
  footer: {
    padding: wp(4),
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(2),
    borderRadius: wp(2),
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.white,
    fontSize: sp(16),
    fontWeight: '600',
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(8),
  },
  loadingText: {
    fontSize: sp(16),
    color: Colors.lightGrey,
    marginTop: hp(2),
  },
});

export default MyAddressScreen;
