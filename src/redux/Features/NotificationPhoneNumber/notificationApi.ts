// notificationApi.ts
import API from '../../../services/api';
import {
  CreateStoreNotificationRequest,
  CreateStoreNotificationResponse,
} from './notification.types';

const createStoreNotificationAPI = async (
  body: CreateStoreNotificationRequest
): Promise<CreateStoreNotificationResponse> => {
  const res = await API.post<CreateStoreNotificationResponse>(
    '/Notification/CreateNewStoreNotification',
    body
  );
  return res.data;
};

export default { createStoreNotificationAPI };
