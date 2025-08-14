// notificationThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import notificationApi from './notificationApi';
import {
  CreateStoreNotificationRequest,
  CreateStoreNotificationResponse,
} from './notification.types';

export const sendStoreNotification = createAsyncThunk<
  CreateStoreNotificationResponse,
  CreateStoreNotificationRequest,
  { rejectValue: string }
>(
  'notification/sendStoreNotification',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await notificationApi.createStoreNotificationAPI(payload);
      if (res.success) {
        return res;
      } else {
        return rejectWithValue(
          res.errors.join(', ') || 'Failed to create notification'
        );
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
