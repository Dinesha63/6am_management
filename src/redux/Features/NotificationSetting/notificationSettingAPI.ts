import API from '../../../services/api';
import {
  NotificationSettingResponse,
  UpdateNotificationSettingRequest,
  UpdateNotificationSettingResponse,
} from './notificationSetting.types';

const getNotificationSettingAPI = async (
  phoneNumber: string
): Promise<NotificationSettingResponse> => {
  const response = await API.get<NotificationSettingResponse>(
    '/Notification/GetNotificationSetting',
    { params: { PhoneNumber: phoneNumber } }
  );
  return response.data;
};

const updateNotificationSettingAPI = async (
  payload: UpdateNotificationSettingRequest
): Promise<UpdateNotificationSettingResponse> => {
  const response = await API.post<UpdateNotificationSettingResponse>(
    '/Notification/UpdateNotificationSetting',
    payload
  );
  return response.data;
};

export default {
  getNotificationSettingAPI,
  updateNotificationSettingAPI,
};
