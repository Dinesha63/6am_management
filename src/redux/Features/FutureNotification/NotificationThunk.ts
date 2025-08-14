
import { createAsyncThunk } from '@reduxjs/toolkit';
import notificationApi from './NotificationApi';    
import { CreateStoreNotificationRequest } from './Notification.types';

export const createStoreNotification = createAsyncThunk<
  boolean,
  CreateStoreNotificationRequest,
  { rejectValue: string }
>(
  'notification/createStoreNotification',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await notificationApi.createStoreNotificationAPI(payload);
      if (res.success) {
        return res.data;
      } else {
        // Surface server errors
        const msg = res.errors?.join(', ') || 'Unknown server error';
        return rejectWithValue(msg);
      }
    } catch (err: any) {
      // Network-level failure
      return rejectWithValue(err.message || 'Network error');
    }
  }
);
