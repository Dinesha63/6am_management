import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPromotionImageAPI } from './promotionApi';
import { PromotionImageResponse } from './promotion.types';

export const fetchPromotionImage = createAsyncThunk<
  PromotionImageResponse,
  string,
  { rejectValue: string }
>(
  'promotion/fetchPromotionImage',
  async (widget, { rejectWithValue }) => {
    try {
      const data = await fetchPromotionImageAPI(widget);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.errors?.[0] || 'Failed to fetch promotional image');
    }
  }
);

export const fetchHomeBanner = createAsyncThunk<
  PromotionImageResponse,
  void,
  { rejectValue: string }
>('promotion/fetchHomeBanner', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchPromotionImageAPI('Home');
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.errors?.[0] || 'Failed to fetch Home banner');
  }
});

export const fetchProductDetailBanner = createAsyncThunk<
  PromotionImageResponse,
  void,
  { rejectValue: string }
>('promotion/fetchProductDetailBanner', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchPromotionImageAPI('Product Detail');
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.errors?.[0] || 'Failed to fetch Product Detail banner');
  }
});

export const fetchPaymentSuccessBanner = createAsyncThunk<
  PromotionImageResponse,
  void,
  { rejectValue: string }
>('promotion/fetchPaymentSuccessBanner', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchPromotionImageAPI('Payment Success');
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.errors?.[0] || 'Failed to fetch Payment Success banner');
  }
});

export const fetchHomeSubscribedBanner = createAsyncThunk<
  PromotionImageResponse,
  void,
  { rejectValue: string }
>('promotion/fetchHomeSubscribedBanner', async (_, { rejectWithValue }) => {
  try {
    const data = await fetchPromotionImageAPI('Home - Subscribed');
    return data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.errors?.[0] || 'Failed to fetch Home Subscribed banner');
  }
}); 