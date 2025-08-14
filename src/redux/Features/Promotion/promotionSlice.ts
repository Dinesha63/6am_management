import { createSlice } from '@reduxjs/toolkit';
import { PromotionState } from './promotion.types';
import { 
  fetchPromotionImage,
  fetchHomeBanner,
  fetchProductDetailBanner,
  fetchPaymentSuccessBanner,
  fetchHomeSubscribedBanner
} from './promotionThunk';
import { RootState } from '../../store';

const initialState: PromotionState = {
  // Generic data for backward compatibility
  data: null,
  
  // Specific banner data
  homeBanner: null,
  productDetailBanner: null,
  paymentSuccessBanner: null,
  homeSubscribedBanner: null,
  
  // Loading states
  loading: false,
  homeBannerLoading: false,
  productDetailBannerLoading: false,
  paymentSuccessBannerLoading: false,
  homeSubscribedBannerLoading: false,
  
  // Error states
  error: null,
  homeBannerError: null,
  productDetailBannerError: null,
  paymentSuccessBannerError: null,
  homeSubscribedBannerError: null,
};

const promotionSlice = createSlice({
  name: 'promotion',
  initialState,
  reducers: {
    resetPromotionState: (state) => {
      state.data = null;
      state.homeBanner = null;
      state.productDetailBanner = null;
      state.paymentSuccessBanner = null;
      state.homeSubscribedBanner = null;
      state.loading = false;
      state.homeBannerLoading = false;
      state.productDetailBannerLoading = false;
      state.paymentSuccessBannerLoading = false;
      state.homeSubscribedBannerLoading = false;
      state.error = null;
      state.homeBannerError = null;
      state.productDetailBannerError = null;
      state.paymentSuccessBannerError = null;
      state.homeSubscribedBannerError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generic fetchPromotionImage (backward compatibility)
      .addCase(fetchPromotionImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromotionImage.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.error = null;
      })
      .addCase(fetchPromotionImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Home Banner
      .addCase(fetchHomeBanner.pending, (state) => {
        state.homeBannerLoading = true;
        state.homeBannerError = null;
      })
      .addCase(fetchHomeBanner.fulfilled, (state, action) => {
        state.homeBannerLoading = false;
        state.homeBanner = action.payload.data;
        state.homeBannerError = null;
      })
      .addCase(fetchHomeBanner.rejected, (state, action) => {
        state.homeBannerLoading = false;
        state.homeBannerError = action.payload as string;
      })
      
      // Product Detail Banner
      .addCase(fetchProductDetailBanner.pending, (state) => {
        state.productDetailBannerLoading = true;
        state.productDetailBannerError = null;
      })
      .addCase(fetchProductDetailBanner.fulfilled, (state, action) => {
        state.productDetailBannerLoading = false;
        state.productDetailBanner = action.payload.data;
        state.productDetailBannerError = null;
      })
      .addCase(fetchProductDetailBanner.rejected, (state, action) => {
        state.productDetailBannerLoading = false;
        state.productDetailBannerError = action.payload as string;
      })
      
      // Payment Success Banner
      .addCase(fetchPaymentSuccessBanner.pending, (state) => {
        state.paymentSuccessBannerLoading = true;
        state.paymentSuccessBannerError = null;
      })
      .addCase(fetchPaymentSuccessBanner.fulfilled, (state, action) => {
        state.paymentSuccessBannerLoading = false;
        state.paymentSuccessBanner = action.payload.data;
        state.paymentSuccessBannerError = null;
      })
      .addCase(fetchPaymentSuccessBanner.rejected, (state, action) => {
        state.paymentSuccessBannerLoading = false;
        state.paymentSuccessBannerError = action.payload as string;
      })
      
      // Home Subscribed Banner
      .addCase(fetchHomeSubscribedBanner.pending, (state) => {
        state.homeSubscribedBannerLoading = true;
        state.homeSubscribedBannerError = null;
      })
      .addCase(fetchHomeSubscribedBanner.fulfilled, (state, action) => {
        state.homeSubscribedBannerLoading = false;
        state.homeSubscribedBanner = action.payload.data;
        state.homeSubscribedBannerError = null;
      })
      .addCase(fetchHomeSubscribedBanner.rejected, (state, action) => {
        state.homeSubscribedBannerLoading = false;
        state.homeSubscribedBannerError = action.payload as string;
      });
  },
});

export const { resetPromotionState } = promotionSlice.actions;
export const promotionSelctor=(state:RootState)=>state.promotion

// Specific banner selectors
export const homeBannerSelector = (state: RootState) => state.promotion.homeBanner;
export const productDetailBannerSelector = (state: RootState) => state.promotion.productDetailBanner;
export const paymentSuccessBannerSelector = (state: RootState) => state.promotion.paymentSuccessBanner;
export const homeSubscribedBannerSelector = (state: RootState) => state.promotion.homeSubscribedBanner;

// Loading selectors
export const homeBannerLoadingSelector = (state: RootState) => state.promotion.homeBannerLoading;
export const productDetailBannerLoadingSelector = (state: RootState) => state.promotion.productDetailBannerLoading;
export const paymentSuccessBannerLoadingSelector = (state: RootState) => state.promotion.paymentSuccessBannerLoading;
export const homeSubscribedBannerLoadingSelector = (state: RootState) => state.promotion.homeSubscribedBannerLoading;

// Error selectors
export const homeBannerErrorSelector = (state: RootState) => state.promotion.homeBannerError;
export const productDetailBannerErrorSelector = (state: RootState) => state.promotion.productDetailBannerError;
export const paymentSuccessBannerErrorSelector = (state: RootState) => state.promotion.paymentSuccessBannerError;
export const homeSubscribedBannerErrorSelector = (state: RootState) => state.promotion.homeSubscribedBannerError;

export default promotionSlice.reducer; 