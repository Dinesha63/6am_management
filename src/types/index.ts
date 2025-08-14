// Navigation types
import { BottomTabParamList } from '../navigation/BottomTabNavigator';

export type RootStackParamList = {
  Splash: undefined;
  OtpVerification: undefined;
  VerifyNumber: {phoneNumber: string};
  Main: { screen?: keyof BottomTabParamList };
  // Main: { screen: keyof BottomTabParamList };
  Account: undefined;
  List: {category: string; showSubscribeButton?: boolean; headerTitle?: string};
  SingleProduct: {product: Product; productSkuCode?: string; quantity?: number};
  OrderDetail: {
    orderItems: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
      rating: number;
      description: string;
    }>;
  };
  Payment: {
    totalAmount: number;
    paymentData : any
  };
  // Address route removed - using LocationAddressScreen instead
  Location: {formData?: any; addressData?: any};
  LocationAddressScreen: {
    addressData?: any;
    formData?: {
      goToAccountOnBack?: boolean;
      goToPaymentOnBack?: boolean;
      existingAddresses?: any[];
      editingId?: string;
      savedLocation?: {
        latitude: number;
        longitude: number;
      };
    };
  };
  MyAddressScreen: {
    existingAddresses: any[];
    newAddress?: Address;
    goToAccountOnBack: boolean;
  };
  AddressSuccessScreen: undefined;
  AdminScreen: undefined;
  MarkVacationScreen: undefined;
  ManageProducts: undefined;
  ReportDamageScreen: undefined;
  ReportSubmitScreen: undefined;
  CancelSubscription: undefined;
  ModifyProduct: undefined;
  CreditScreen: {unitPrice: number,flowType?: string};
  StoreLocationScreen: undefined;
  TransactionScreen: undefined;
  GuestScreen: undefined;
  SetSubscriptionScreen: {product: Product; quantity?: number};
  EmptyCartScreen: undefined;
  AddCreditsToWallet: {
    amount: number;
    bonusPercent?: number;
    bonusAmount?: number;
    totalDue?: number;
    couponCode?: string;
    flowType?:string
  };
  CreditsScreenWallet: undefined;
  NoTransactionsScreen: undefined;
  DueSettlement: {totalDueAmount: number};
  ManageNotifications: undefined;
  AboutScreen: undefined;
  LegalScreen: undefined;
  PrivacyPolicyScreen: undefined;
  TermsAndConditionsScreen: undefined;
  HelpAndFAQScreen: undefined;
  SubscriptionSuccessScreen: undefined;
  GuestSubscriptionScreen: undefined;
};

//Address Type
// export type AddressData = {
//   id: string | number;
//   fullName: string;
//   phoneNumber: string;
//   email: string | undefined;
//   addressLine1: string;
//   addressLine2: string;
//   city: string;
//   state: string;
//   pincode: string;
//   country: string;
//   location: string;
// };




export interface AddressData {
  fullName: string;
  phoneNumber: string;
  email: string;
  location: string;
  addressLine1: string;
  addressLine2?: string;
  pincode: string;
  savedLocation?: any;
}

export interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  phone: string;
  email: string;
  location: string;
  pincode: string;
  type: 'HOME' | 'OFFICE' | 'DEFAULT';
  isDefault: boolean;
}

// export interface MyAddressProps {
//   addresses: any[];
//   onAddNewAddress: () => void;
//   onEditAddress: (addressId: string) => void;
//   onBack: () => void;
// }

// Product types
export interface Product {
  id: string | number;
  name: string;
  description?: string;
  image?: string;
  price?: number;
  today_price: number;
  category?: string;
  rating?: number;
  reviews?: number;
  is_favorite?: boolean;
  quantity?: number;
  unit?: string;
  productSkuCode?: string;
  imageUrl: string;
}

// User types
export interface User {
  phoneNumber?: string;
  isVerified?: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Subscription types
export interface RadioOption {
  id: string;
  label: string;
  hasInput?: boolean;
}


export type PaymentPayload = {
  customerPhoneNumber: string;
  deliveryScheduleId: string;
  deliverySlotId: string;
  startDate: string;
  productSkuCode: string;
  quantity: number;
  pricePerUnit: number;
};
