import { createSlice } from '@reduxjs/toolkit';
import { NotificationState } from './notification.types';
import { sendStoreNotification } from './notificationThunk';

const initialState: NotificationState = {
  loading: false,
  success: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    resetNotification: state => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(sendStoreNotification.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendStoreNotification.fulfilled, state => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendStoreNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? null;
      });
  },
});

export const { resetNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
