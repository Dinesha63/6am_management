import { createSlice } from '@reduxjs/toolkit';
import { CouponResponse } from './coupon.types';
import { validateCouponCode } from './couponApi';
import { validateCouponCodeThunk } from './couponThunk';

interface CouponState {
  loading: boolean;
  validated: boolean;
  couponData: CouponResponse | null;
  error: string | null;
}

const initialState: CouponState = {
  loading: false,
  validated: false,
  couponData: null,
  error: null,
};

const couponSlice = createSlice({
  name: 'coupon',
  initialState,
  reducers: {
    clearCouponState: (state) => {
      state.validated = false;
      state.couponData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateCouponCodeThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateCouponCodeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.validated = true;
        state.couponData = action.payload;
      })
      .addCase(validateCouponCodeThunk.rejected, (state, action) => {
        state.loading = false;
        state.validated = false;
        state.error =
          action.payload || action.error.message || 'Failed to validate coupon';
      });
  },
});

export const { clearCouponState } = couponSlice.actions;
export default couponSlice.reducer;
