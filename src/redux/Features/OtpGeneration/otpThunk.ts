import {createAsyncThunk} from '@reduxjs/toolkit';
import {sendOtpAPI, verifyOtpAPI} from './otpApi';
import {SendOtpPayload, VerifyOtpPayload} from './otpTypes';
import {storeUserPhoneAndVerification} from '../../../config/storage';
import * as Keychain from 'react-native-keychain';
export const sendOtp = createAsyncThunk(
  'otp/sendOtp',
  async (payload: SendOtpPayload, {rejectWithValue}) => {
    try {
      const data = await sendOtpAPI(payload.phone, payload.isResending);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send OTP');
    }
  },
);

export const verifyOtp = createAsyncThunk(
  'otp/verifyOtp',
  async (payload: VerifyOtpPayload, {rejectWithValue}) => {
    try {
      console.log('payload verifyOtp:', payload);
      const data = await verifyOtpAPI(payload.phone, payload.otp);
      console.log('data verifyOtp:', data);
      if (data) {
        console.log('data verifyOtp:', data);
        if (data?.data) {
          const token = data.data; // your JWT token
          console.log('Received token:', token);
          await Keychain.resetGenericPassword();
          await Keychain.setGenericPassword('auth', token, {
            accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
          });
          await storeUserPhoneAndVerification(payload.phone);
        }
      }
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to verify OTP');
    }
  },
);
