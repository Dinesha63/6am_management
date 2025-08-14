export interface CustomerInfo {
  userType: string;
  customerName: string;
  walletAmount: number;
  dueAmount: number;
  dueFor: string;
  cartCount: number;
  showReview: boolean;
  isSubscribed :boolean;
  lowWalletBalanceAlert : boolean
}

export interface CustomerInfoState {
  data: CustomerInfo | null;
  loading: boolean;
  error: string | null;
}

export interface CreateCustomerAddressRequest {
  customerPhoneNumber: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  location: string;
  pincode: string;
  addressType: string;
  isDefault: boolean;
  latitude?: string;
  longitude?: string;
  image1?: string;
  image2?: string;
} 