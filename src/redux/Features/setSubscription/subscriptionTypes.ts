// src/features/subscription/subscriptionTypes.ts

export interface DeliverySchedule {
  deliveryScheduleId: string;
  deliveryScheduleName: string;
}

export interface DeliverySlot {
  deliverySlotId: string;
  deliverySlotName: string;
}

export interface SubscriptionData {
  productSkuCode: string;
  productSkuName: string;
  price: number;
  deliverySchedule: DeliverySchedule[];
  deliverySlot: DeliverySlot[];
}

export interface SubscriptionResponse {
  success: boolean;
  errors: string[];
  data: SubscriptionData | null;
  statusCode: number | null;
}

export interface SubscriptionState {
  loading: boolean;
  error: string | null;
  subscription: SubscriptionData | null;
  subscriptionResponse?: SaveSubscriptionResponse | null;
}
export interface SaveSubscriptionPayload {
  customerPhoneNumber: string;
  deliveryScheduleId: string;
  deliverySlotId: string;
  startDate: string;
  productSkuCode: string;
  quantity: number;
}
export interface SaveSubscriptionResponse {
  success: boolean;
  errors: string[];
  data: true | null;
  statusCode: number;
}
