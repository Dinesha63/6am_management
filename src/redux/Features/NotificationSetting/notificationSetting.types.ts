export interface NotificationSetting {
    phoneNumber: string;
    sms:         boolean;
    email:       boolean;
  }
  
  export interface NotificationSettingResponse {
    success:    boolean;
    errors:     any[];
    data:       NotificationSetting;
    statusCode: number | null;
  }
  
  export interface UpdateNotificationSettingRequest {
    phoneNumber: string;
    sms:         boolean;
    email:       boolean;
  }
  
  export interface UpdateNotificationSettingResponse {
    success:    boolean;
    errors:     any[];
    data:       boolean;
    statusCode: number | null;
  }
  
  export interface NotificationSettingState {
    setting:       NotificationSetting | null;
    loading:       boolean;
    error:         string | null;
    updating:      boolean;
    updateError:   string | null;
    updateSuccess: boolean;
  }
  