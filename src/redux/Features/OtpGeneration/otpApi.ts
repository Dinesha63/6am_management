import API from '../../../services/api';
import { ACTIVE_API_BASE_URL } from '../../../config/api';

export const sendOtpAPI = async (phone: string, isResending: boolean) => {
  const url = isResending
    ? `${ACTIVE_API_BASE_URL}/Login/ResendOtp?phoneNumber=${phone}`
    : `${ACTIVE_API_BASE_URL}/Login/GenerateOtp?phoneNumber=${phone}`;
  
  console.log('Sending OTP to:', phone);
  console.log('Is Resending:', isResending);
  console.log('Request URL:', url);

  try {
    const response = await API.post(url, null, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('OTP Send Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in sendOtpAPI:', error);
    throw error;
  }
};

export const verifyOtpAPI = async (phone: string, otp: string) => {
  const url = `${ACTIVE_API_BASE_URL}/Login/ValidateOtp?phoneNumber=${phone}&otpCode=${otp}`;
  
  console.log('Verifying OTP for phone:', phone);
  console.log('Entered OTP:', otp);
  console.log('Request URL:', url);

  try {
    const response = await API.post(url, null, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('OTP Verification Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in verifyOtpAPI:', error);
    throw error;
  }
};
