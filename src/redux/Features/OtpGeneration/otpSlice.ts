import {createSlice} from '@reduxjs/toolkit';
import {OtpState} from './otpTypes';
import {sendOtp, verifyOtp} from './otpThunk';
import {RootState} from '../../store';

const initialState: OtpState = {
  isOtpSent: false,
  isOtpVerified: false,
  loading: false,
  error: null,
};

const otpSlice = createSlice({
  name: 'otp',
  initialState,
  reducers: {
    resetOtpState: state => {
      state.isOtpSent = false;
      state.isOtpVerified = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(sendOtp.pending, state => {
        state.loading = true;
        state.error = null;
        state.isOtpSent = false;
      })
      .addCase(sendOtp.fulfilled, state => {
        state.loading = false;
        state.isOtpSent = true;
        state.error = null;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.isOtpSent = false;
        state.error = (action.payload as string) || 'Failed to send OTP';
      })
      .addCase(verifyOtp.pending, state => {
        state.loading = true;
        state.error = null;
        state.isOtpVerified = false;
      })
      .addCase(verifyOtp.fulfilled, state => {
        state.loading = false;
        state.isOtpVerified = true;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.isOtpVerified = false;
        state.error = (action.payload as string) || 'Failed to verify OTP';
      });
  },
});

export const {resetOtpState} = otpSlice.actions;
export const otpSelector = (state: RootState) => state.otp;

export default otpSlice.reducer;
