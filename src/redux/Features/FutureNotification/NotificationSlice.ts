// notificationSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { NotificationState } from './Notification.types';
import { createStoreNotification } from './NotificationThunk';

const initialState: NotificationState = {
  notified: false,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    clearNotification: (state) => {
      state.notified = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createStoreNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStoreNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notified = action.payload;
      })
      .addCase(createStoreNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Failed to notify';
      });
  },
});

export const { clearNotification } = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;
