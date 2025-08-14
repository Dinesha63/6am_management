
export interface CouponResponse {
    minValue: number;
    description: string;
    isValid: boolean;
    message: string | null;
  }
  
  export interface APIResponse {
    success: boolean;
    data: CouponResponse;
    errors: string[];
    statusCode: number | null;
  }

  export interface ValidateCouponParams {
    phoneNumber: string;
    couponCode: string;
  }
  