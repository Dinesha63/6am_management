// types.ts

export interface createOrderRequest {
  phoneNumber: string | null;
  amount: number;
  paymentMethod: string | null; // Assuming paymentMethod is a string, adjust as necessary
  couponCode: string | null;
}

export interface createOrderResponse {
  success: boolean;
  errors: string[];
  data: {
    token: string;
    orderId: string;
  };
  statusCode: number | null;
}

export interface createOrderState {
  loading: boolean;
  error: string | null;
  response: createOrderResponse | null;
}
