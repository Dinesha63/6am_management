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
export interface CustomerInfo {
  userType: string;
  customerName: string;
  walletAmount: number;
  dueAmount: number;
  dueFor: string;
  cartCount: number;
  showReview: boolean;
}
export interface CustomerAddress {
    customerAddressId: string;
    fullName:          string;
    phoneNumber:       string;
    email:             string;
    addressLine1:      string;
    addressLine2:      string;
    location:          string;
    pincode:           string;
    addressType:       string;
    latitude:          string;
    longitude:         string;
    image1:            null;
    image2:            null;
    isDefault:         boolean;
  customerPhoneNumber?: string;

}

