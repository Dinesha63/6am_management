import { createAsyncThunk } from '@reduxjs/toolkit';
import { validateCouponCode } from './couponApi';
import { CouponResponse } from './coupon.types';

interface ValidateParams {
  phoneNumber: string;
  couponCode: string;
}

export const validateCouponCodeThunk = createAsyncThunk<
  CouponResponse,
  ValidateParams,
  { rejectValue: string }
>(
  'coupon/validateCoupon',
  async ({ phoneNumber, couponCode }, { rejectWithValue }) => {
    try {
      const response = await validateCouponCode({ phoneNumber, couponCode });
      console.log(response, ' :: validateCouponCodeThunk response');
      if (response.success && response.data.isValid) {
        return response.data;
      } else {
        return rejectWithValue(response.data?.message || 'Invalid coupon');
      }
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);
