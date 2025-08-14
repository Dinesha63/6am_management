import { createAsyncThunk } from '@reduxjs/toolkit';
import notificationSettingApi from './notificationSettingAPI';
import {
  NotificationSetting,
  UpdateNotificationSettingRequest,
} from './notificationSetting.types';

export const fetchNotificationSetting = createAsyncThunk<
  NotificationSetting,
  string,
  { rejectValue: string }
>(
  'notificationSetting/fetch',
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const res = await notificationSettingApi.getNotificationSettingAPI(
        phoneNumber
      );
      console.log('fetchNotificationSetting API response:', res);
      if (res.success) {
        return res.data;
      } else {
        return rejectWithValue(
          res.errors.join(', ') || 'Failed to fetch settings'
        );
      }
    } catch (err: any) {
      console.error('fetchNotificationSetting API error:', err);
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Network error'
      );
    }
  }
);

export const updateNotificationSetting = createAsyncThunk<
  UpdateNotificationSettingRequest,
  UpdateNotificationSettingRequest,
  { rejectValue: string }
>(
  'notificationSetting/update',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await notificationSettingApi.updateNotificationSettingAPI(
        payload
      );
      console.log('updateNotificationSetting API response:', res);
      if (res.success) {
        // return the new settings so we can store them in state
        return payload;
      } else {
        return rejectWithValue(
          res.errors.join(', ') || 'Failed to update settings'
        );
      }
    } catch (err: any) {
      console.error('updateNotificationSetting API error:', err);
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Network error'
      );
    }
  }
);
