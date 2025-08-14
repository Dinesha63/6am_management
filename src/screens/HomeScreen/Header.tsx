import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import SimpleIcon from '../../components/SimpleIcon';
import GuestUserBottomSheet from '../../components/GuestUserBottomSheet';
import {FontFamily} from '../../utils/constant';
import Colors from '../../utils/constants/colors';
import ApiContext from '../../context/ApiContext';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {imagePaths} from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import { setGuestState } from '../../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';

interface HeaderProps {
  isSubscribed: boolean;
  customerInfo?:
    | import('../../redux/Features/Customer/types/customer.types').CustomerInfo
    | null;
}

const Header: React.FC<HeaderProps> = ({
  isSubscribed,
  customerInfo,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const apiContext = useContext(ApiContext);

  if (!apiContext) {
    throw new Error('Header must be used within an ApiProvider');
  }
  const dispatch = useDispatch<AppDispatch>();

  const {api} = apiContext;
  const [isGuestUser, setIsGuestUser] = useState<boolean>(true); 
  const [plusCode, setPlusCode] = useState<string>('');
  const [showGuestBottomSheet, setShowGuestBottomSheet] = useState<boolean>(false);
  const isGuest = useSelector((state: RootState) => state.user.isGuest);

  useEffect(() => {
    api.getCurrentLocation().then(loc => {
      api.getPlusCode(loc.latitude, loc.longitude).then(setPlusCode);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Greet the user */}
        <Text style={styles.greeting}>
          Hello{' '}
          {customerInfo?.customerName ? customerInfo?.customerName : 'Guest'}
        </Text>

        {/* Wallet Card */}
        <TouchableOpacity
          style={[
            styles.walletWrapper,
            {
              backgroundColor: !isSubscribed
                ? Colors.primary
                : Colors.orangeColour,
            },
          ]}
          onPress={() => {
            if(isGuest) {
              setShowGuestBottomSheet(true);
             return;
            }
            const walletAmount = customerInfo?.walletAmount ?? 0;
            if (walletAmount === 0) {
              navigation.navigate('CreditScreen', { unitPrice: 0, flowType: 'Main' });
            } else {
              navigation.navigate('CreditsScreenWallet');
            }
          }}>
          <SimpleIcon
            source={imagePaths.Wallet_Icon}
            style={styles.walletIcon}
          />
          <Text style={styles.walletText}>
            {isGuest ? `${customerInfo?.walletAmount ?? ""}` : `₹ ${customerInfo?.walletAmount ?? ""}`}
          </Text>
        </TouchableOpacity>

        {/* Shopping Cart V1 - Not Available */} 
        {/* <TouchableOpacity
          style={styles.cartWrapper}
          onPress={() => navigation.navigate('EmptyCartScreen')}>
          <SimpleIcon
            source={imagePaths.Shopping_Cart_icon}
            style={styles.cartIcon}
          />
          {(customerInfo?.cartCount || 0) > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{customerInfo?.cartCount}</Text>
            </View>
          )}
        </TouchableOpacity> */}
      </View>

      <View style={styles.locationRow}>
        <SimpleIcon
          source={imagePaths.Location_Icon}
          style={styles.locationIcon}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('StoreLocationScreen')}>
          <Text style={styles.locationText}>
          {isGuestUser ? plusCode : plusCode}
          

          </Text>
        </TouchableOpacity>

      </View>

      <GuestUserBottomSheet
        isVisible={showGuestBottomSheet}
        onClose={() => setShowGuestBottomSheet(false)}
        onSave={(phoneNumber: string) => {
          console.log('Guest user phone number saved:', phoneNumber);
          // Handle successful phone number save
        }}
        onVerifyOtp={async (otp: string) => {
          console.log('Guest user OTP verified:', otp);
          // Handle successful OTP verification
          setShowGuestBottomSheet(false);
          dispatch(setGuestState(false));
          
          // Reset navigation stack and navigate to CreditScreen
          // This prevents back navigation to guest screens
          navigation.reset({
            index: 1,
            routes: [
              { name: 'Main' },
              { name: 'CreditScreen', params: { unitPrice: 0, flowType: 'Main' } }
            ],
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(1.5),
    backgroundColor: Colors.white,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: sp(20),
    fontFamily: FontFamily.REGULAR,
    // fontWeight: 'bold',
    color: '#000',
    width: '50%',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(1),
  },
  locationIcon: {
    width: wp(4),
    height: wp(4),
    marginRight: wp(1.5),
  },
  locationText: {
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
    color: '#444',
  },
  toggleText: {
    marginLeft: wp(3),
    fontSize: sp(12),
    color: Colors.primary,
    fontStyle: 'italic',
  },
  cartWrapper: {
    position: 'relative',
    padding: wp(2.5),
    backgroundColor: '#EDF9FA',
    borderRadius: wp(6.5),
  },
  cartIcon: {
    width: wp(6),
    height: wp(6),
    tintColor: '#000',
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: -hp(0.5),
    backgroundColor: 'red',
    width: wp(4),
    height: wp(4),
    borderRadius: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: sp(10),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
  },
  walletWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: wp(3),
    backgroundColor: Colors.primary,
    borderRadius: wp(7.5),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
  },
  walletIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: '#fff',
    // marginRight: wp(2),
  },
  walletText: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    color: '#fff',
  },
});

export default Header;
