export interface CreateStoreNotificationRequest {
    phoneNumber: string;
    latitude: string;
    longitude: string;
  }
  
  export interface CreateStoreNotificationResponse {
    success: boolean;
    errors: any[];
    data: boolean;
    statusCode: number | null;
  }
  
  export interface NotificationState {
    notified: boolean;
    loading: boolean;
    error: string | null;
  }