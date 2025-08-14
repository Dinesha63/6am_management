export interface PromotionImageData {
  imageUrl: string;
  widget: string;
}

export interface PromotionImageResponse {
  success: boolean;
  errors: string[];
  data: PromotionImageData;
  statusCode: number | null;
}

export interface PromotionState {
  // Generic data for backward compatibility
  data: PromotionImageData | null;
  
  // Specific banner data
  homeBanner: PromotionImageData | null;
  productDetailBanner: PromotionImageData | null;
  paymentSuccessBanner: PromotionImageData | null;
  homeSubscribedBanner: PromotionImageData | null;
  
  // Loading states
  loading: boolean;
  homeBannerLoading: boolean;
  productDetailBannerLoading: boolean;
  paymentSuccessBannerLoading: boolean;
  homeSubscribedBannerLoading: boolean;
  
  // Error states
  error: string | null;
  homeBannerError: string | null;
  productDetailBannerError: string | null;
  paymentSuccessBannerError: string | null;
  homeSubscribedBannerError: string | null;
} 