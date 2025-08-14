import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { imagePaths } from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setGuestState } from '../../redux/userSlice';
import GuestUserBottomSheet from '../../components/GuestUserBottomSheet';
import ApiContext from '../../context/ApiContext';
import { sendOtp, verifyOtp } from '../../redux/Features/OtpGeneration/otpThunk';

const menuItems = [
  {
    title: 'Subscription Details',
    icon: 'credit-card',
    color: Colors.primary,
    screen: 'OtpVerification',
    requiresAuth: true,
  },
  {
    title: 'My Address',
    icon: 'location-on',
    color: Colors.danger,
    screen: 'OtpVerification',
    requiresAuth: true,
  },
  {
    title: 'Transaction History',
    icon: 'receipt-long',
    color: Colors.primary,
    screen: 'OtpVerification',
    requiresAuth: true,
  },
 
  {
    title: 'Explore Our Stores',
    icon: 'store',
    color: Colors.primary,
    screen: 'StoreLocationScreen',
    requiresAuth: false,
  },
   {
    title: 'About 6 am',
    icon: 'info-outline',
    color: Colors.primary,
    screen: 'LegalScreen',
    requiresAuth: false,
  },
  {
    title: 'Help & FAQ',
    icon: 'help-outline',
    color: Colors.primary,
    screen: 'HelpAndFAQScreen',
    requiresAuth: false,
  },
];

const Menubar = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();
  const [showGuestBottomSheet, setShowGuestBottomSheet] = useState(false);
  const [guestPhoneNumber, setGuestPhoneNumber] = useState<string>('');
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>('');

  const apiContext = useContext(ApiContext);
  if (!apiContext) {
    throw new Error('Menubar must be used within an ApiProvider');
  }
  const { api } = apiContext;

  const handleMenuItemPress = (item: any) => {
    if (item.requiresAuth) {
      setSelectedMenuItem(item.title);
      setShowGuestBottomSheet(true);
    } else {
      if (item.screen) {
        navigation.navigate(item.screen);
      }
    }
  };

  const handleGuestSave = async (phoneNumber: string) => {
    try {
      console.log('Guest phone number saved:', phoneNumber);
      const result = await dispatch(
        sendOtp({ phone: phoneNumber, isResending: false }),
      ).unwrap();
      setGuestPhoneNumber(phoneNumber);
      console.log('OTP sent successfully:', result);
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };

  const handleGuestVerifyOtp = async (autoOtp?: string | React.SyntheticEvent) => {
    console.log('handleGuestVerifyOtp called with:', autoOtp);

    let finalOtp: string;
    if (typeof autoOtp === 'string') {
      finalOtp = autoOtp;
    } else {
      console.error('Invalid OTP format received');
      return;
    }

    console.log('finalOtp to verify:', finalOtp);

    try {
      const resultOtp = await dispatch(
        verifyOtp({ phone: guestPhoneNumber, otp: finalOtp })
      ).unwrap();

      console.log('verifyOtp result (guest):', resultOtp);

      try {
        await api.markOtpVerified();
      } catch (markErr) {
        console.warn('Warning: markOtpVerified failed', markErr);
      }

      await AsyncStorage.setItem('userPhoneNumber', guestPhoneNumber);

      setShowGuestBottomSheet(false);
      dispatch(setGuestState(false));

      // Navigate based on the selected menu item
      switch (selectedMenuItem) {
        case 'Transaction History':
          navigation.navigate('TransactionScreen');
          break;
        case 'My Address':
          navigation.navigate('MyAddressScreen');
          break;
        case 'Subscription Details':
          navigation.navigate('SubscriptionScreen');
          break;
        default:
          navigation.navigate('Main', { screen: 'Home' });
      }

      console.log('Guest verification success and navigation done');

    } catch (error) {
      console.error('Error verifying guest OTP:', error);
      Alert.alert('Error', 'You have entered wrong OTP');
    }
  };

  const handleGuestClose = () => {
    setShowGuestBottomSheet(false);
    setSelectedMenuItem('');
  };

  const handleGuestResendOtp = async (phoneNumber: string) => {
    try {
      console.log('Resending OTP for guest:', phoneNumber);
      const result = await dispatch(
        sendOtp({ phone: phoneNumber, isResending: true }),
      ).unwrap();
      console.log('OTP resent successfully:', result);
    } catch (error) {
      console.error('Error resending OTP:', error);
      throw error; // Re-throw to let the bottom sheet handle the error
    }
  };


  return (
    <>
      {menuItems.map((item, idx) => (
        <View key={idx}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuItemPress(item)}>
            <View style={styles.menuIconWrap}>
              {item.title === 'Subscription Details' ? (
                <Image
                  source={imagePaths.subscription_icon}
                  style={styles.customIcon}
                />
              ) : item.title === 'My Address' ? (
                <Image
                  source={imagePaths.my_address_icon}
                  style={styles.customIcon}
                />
              ) : item.title === 'Transaction History' ||
                item.title === 'About 6 am' ? (
                <Image
                  source={imagePaths.information_icon}
                  style={styles.customIcon}
                />
              ) : item.title === 'Explore Our Stores' ? (
                <Image
                  source={imagePaths.store_address_icon}
                  style={styles.customIcon}
                />
              ) : item.title === 'Help & FAQ' ? (
                <Image
                  source={imagePaths.help_icon}
                  style={styles.customIcon}
                />
              ) : item.title === 'Logout' ? (
                <Image
                  source={imagePaths.logout_icon}
                  style={styles.customIcon}
                />
              ) : (
                <></>
              )}
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>{item.title}</Text>
            </View>
            <Image
              source={imagePaths.Disclosure_Indicator_icon}
              style={styles.disclosureIcon}
            />
          </TouchableOpacity>
        </View>
      ))}

      <GuestUserBottomSheet
        isVisible={showGuestBottomSheet}
        onClose={handleGuestClose}
        onSave={handleGuestSave}
        onVerifyOtp={handleGuestVerifyOtp}
        onResendOtp={handleGuestResendOtp}
      />
    </>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(0.75),
    paddingBottom: hp(0.75),
    marginTop: hp(0.5),
    marginLeft: wp(5),
    marginRight: wp(7.5),
    marginBottom: hp(1.5),
  },
  menuIconWrap: {
    width: wp(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextWrap: {
    flex: 1,
    paddingLeft: wp(2.5),
  },
  menuTitle: {
    fontSize: sp(15),
    fontWeight: '500',
  },
  disclosureIcon: {
    width: wp(4.5),
    height: wp(4.5),
    resizeMode: 'contain',
    tintColor: Colors.grey,
  },
  customIcon: {
    width: wp(5.5),
    height: wp(5.5),
    resizeMode: 'contain',
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.75),
    marginTop: hp(2.5),
    backgroundColor: Colors.danger,
  },
});

export default Menubar;
