import { createSlice } from '@reduxjs/toolkit';
import {
  NotificationSettingState,
} from './notificationSetting.types';
import {
  fetchNotificationSetting,
  updateNotificationSetting,
} from './notificationSettingThunk';

const initialState: NotificationSettingState = {
  setting:       null,
  loading:       false,
  error:         null,
  updating:      false,
  updateError:   null,
  updateSuccess: false,
};

const slice = createSlice({
  name: 'notificationSetting',
  initialState,
  reducers: {
    clearNotificationSetting: (state) => {
      state.setting = null;
      state.error = null;
      state.updateError = null;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // GET
    builder
      .addCase(fetchNotificationSetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.setting = action.payload;
      })
      .addCase(fetchNotificationSetting.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || 'Failed to load settings';
      });

    // POST
    builder
      .addCase(updateNotificationSetting.pending, (state) => {
        state.updating = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateNotificationSetting.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        state.setting = action.payload;
      })
      .addCase(updateNotificationSetting.rejected, (state, action) => {
        state.updating = false;
        state.updateError =
          action.payload || action.error.message || 'Failed to update settings';
      });
  },
});

export const { clearNotificationSetting } = slice.actions;
export const notificationSettingReducer = slice.reducer;
