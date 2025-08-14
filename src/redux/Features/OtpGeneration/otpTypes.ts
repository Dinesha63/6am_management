export interface OtpState {
  isOtpSent: boolean;
  isOtpVerified: boolean;
  loading: boolean;
  error: string | null;
}

export interface SendOtpPayload {
  phone: string;
  isResending: boolean;
}

export interface VerifyOtpPayload {
  phone: string;
  otp: string;
} 