export interface CustomerSubscriptionProduct {
  productSkuCode: string;
  productName: string;
  quantity: number;
  isCancelled: boolean;
}

export interface CustomerSubscriptionNextDelivery {
  orderId: string;
  orderDate: string;
  deliverySlotDescription: string;
  products: CustomerSubscriptionProduct[];
}

export interface CustomerSubscriptionData {
  isSubscribed: boolean;
  isServiceArea: boolean;
  nextDeliveries: CustomerSubscriptionNextDelivery[];
}

export interface CustomerSubscriptionResponse {
  success: boolean;
  errors: string[];
  data: CustomerSubscriptionData;
  statusCode: number | null;
}

export interface CustomerSubscriptionState {
  data: CustomerSubscriptionData | null;
  loading: boolean;
  error: string | null;
}

export interface CancelNextDeliveryRequest {
  orderId: string;
  products: string[];
}

export interface CancelNextDeliveryResponse {
  success: boolean;
  errors: string[];
  statusCode: number | null;
}

export interface CancelNextDeliveryState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface RestoreNextDeliveryRequest {
  orderId: string;
}

export interface RestoreNextDeliveryResponse {
  success: boolean;
  errors: string[];
  statusCode: number | null;
}

export interface RestoreNextDeliveryState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface CancelAllSubscriptionsResponse {
  success: boolean;
  errors: string[];
  statusCode: number | null;
}

export interface CancelAllSubscriptionsState {
  loading: boolean;
  error: string | null;
  success: boolean;
} 


export interface CancelReasonState {
  reasons: string[];
  loading: boolean;
  error: string | null;
}

