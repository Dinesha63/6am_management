// Navigation types
import { BottomTabParamList } from '../navigation/BottomTabNavigator';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Main: { screen?: keyof BottomTabParamList };
  CustomerInfo: { customerId: string } | undefined;
};

//Address Type
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

