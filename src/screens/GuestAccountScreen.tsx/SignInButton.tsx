import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setGuestState } from '../../redux/userSlice';
import GuestUserBottomSheet from '../../components/GuestUserBottomSheet';
import ApiContext from '../../context/ApiContext';
import { sendOtp, verifyOtp } from '../../redux/Features/OtpGeneration/otpThunk';
import { CommonActions } from '@react-navigation/native';

interface SignInButtonProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const SignInButton: React.FC<SignInButtonProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [showGuestBottomSheet, setShowGuestBottomSheet] = useState(false);
  const [guestPhoneNumber, setGuestPhoneNumber] = useState<string>('');

  const apiContext = useContext(ApiContext);
  if (!apiContext) {
    throw new Error('SignInButton must be used within an ApiProvider');
  }
  const { api } = apiContext;

  const handleSignInPress = () => {
    setShowGuestBottomSheet(true);
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

      // Navigate to Home tab after successful verification
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'Main',
              params: { screen: 'Home' }
            }
          ],
        })
      );

      console.log('Guest verification success and navigation done');

    } catch (error) {
      console.error('Error verifying guest OTP:', error);
      Alert.alert('Error', 'You have entered wrong OTP');
    }
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
      throw error;
    }
  };


  const handleGuestClose = () => {
    setShowGuestBottomSheet(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button,]}
        onPress={handleSignInPress}>
        <Text style={styles.buttonText}>Sign In / Create Account</Text>
      </TouchableOpacity>

      <GuestUserBottomSheet
        isVisible={showGuestBottomSheet}
        onClose={handleGuestClose}
        onSave={handleGuestSave}
        onVerifyOtp={handleGuestVerifyOtp}
        onResendOtp={handleGuestResendOtp}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    left: 0,
    right: 0,
    padding: wp(4),
    borderTopColor: Colors.lineLight,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: wp(2),
    padding: hp(2),
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: sp(16),
    fontWeight: '600',
  },
});
export default SignInButton;
