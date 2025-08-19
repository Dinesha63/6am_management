export interface GetTodayDeliverySummaryByProductResponse {
  success: boolean;
  errors: string[];
  data: DeliverySummaryByProduct[];
  statusCode: number | null;
}
export interface GetTodayDeliverySummaryBySkuResponse {
  success: boolean;
  errors: string[];
  data: DeliverySummaryByProductSku[];
  statusCode: number | null;
}

export interface DeliverySummaryByProduct {
  storeName: string;
  productName?: string;
  quantity: string;
}

export interface DeliverySummaryByProductSku {
  storeName: string;
  productSkuName: string;
  quantity: string;
}
export interface TodayDeliveryListResponse {
  success: boolean;
  errors: string[];
  data: TodayDelivery[];
  statusCode: number | null;
}

export interface TodayDelivery {
  customerId: string;
  customerName: string;
  phoneNumber: string;
  storeCode: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  pincode: string | null;
  orderDetails: OrderDetail[];
  orderId: string;
  orderNo: string;
  orderStatus: string;
  orderDate: string; // ISO string
}

export interface OrderDetail {
  productSkuCode: string;
  productSkuName: string;
  quantity: number;
}