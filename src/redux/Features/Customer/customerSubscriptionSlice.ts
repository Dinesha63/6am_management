import { createSlice } from '@reduxjs/toolkit';
import { CustomerSubscriptionState, CancelNextDeliveryState, RestoreNextDeliveryState, CancelReasonState } from './customerSubscription.types';
import { fetchCustomerSubscriptionInfo, cancelNextDelivery, restoreNextDelivery, fetchCancelReasons } from './customerSubscriptionThunk';

const initialState: CustomerSubscriptionState = {
  data: null,
  loading: false,
  error: null,
};

const initialCancelNextDeliveryState: CancelNextDeliveryState = {
  loading: false,
  error: null,
  success: false,
};

const initialRestoreNextDeliveryState: RestoreNextDeliveryState = {
  loading: false,
  error: null,
  success: false,
};
const initialCancelReasonState: CancelReasonState = {
  reasons: [],
  loading: false,
  error: null,
};

const customerSubscriptionSlice = createSlice({
  name: 'customerSubscription',
  initialState: {
    ...initialState,
    cancelNextDelivery: initialCancelNextDeliveryState,
    restoreNextDelivery: initialRestoreNextDeliveryState,
    cancelReason: initialCancelReasonState,
  },
  
  reducers: {
    resetCustomerSubscriptionState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.cancelNextDelivery = initialCancelNextDeliveryState;
      state.restoreNextDelivery = initialRestoreNextDeliveryState;
      state.cancelReason = initialCancelReasonState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerSubscriptionInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerSubscriptionInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.error = null;
      })
      .addCase(fetchCustomerSubscriptionInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(cancelNextDelivery.pending, (state) => {
        state.cancelNextDelivery.loading = true;
        state.cancelNextDelivery.error = null;
        state.cancelNextDelivery.success = false;
      })
      .addCase(cancelNextDelivery.fulfilled, (state, action) => {
        state.cancelNextDelivery.loading = false;
        state.cancelNextDelivery.success = action.payload.success;
        state.cancelNextDelivery.error = null;
      })
      .addCase(cancelNextDelivery.rejected, (state, action) => {
        state.cancelNextDelivery.loading = false;
        state.cancelNextDelivery.error = action.payload as string;
        state.cancelNextDelivery.success = false;
      })
      .addCase(restoreNextDelivery.pending, (state) => {
        state.restoreNextDelivery.loading = true;
        state.restoreNextDelivery.error = null;
        state.restoreNextDelivery.success = false;
      })
      .addCase(restoreNextDelivery.fulfilled, (state, action) => {
        state.restoreNextDelivery.loading = false;
        state.restoreNextDelivery.success = action.payload.success;
        state.restoreNextDelivery.error = null;
      })
      .addCase(restoreNextDelivery.rejected, (state, action) => {
        state.restoreNextDelivery.loading = false;
        state.restoreNextDelivery.error = action.payload as string;
        state.restoreNextDelivery.success = false;
      })
      .addCase(fetchCancelReasons.pending, (state) => {
        state.cancelReason.loading = true;
        state.cancelReason.error = null;
      })
      .addCase(fetchCancelReasons.fulfilled, (state, action) => {
        state.cancelReason.loading = false;
        state.cancelReason.reasons = action.payload;
        state.cancelReason.error = null;
      })
      .addCase(fetchCancelReasons.rejected, (state, action) => {
        state.cancelReason.loading = false;
        state.cancelReason.error = action.payload as string;
      });
  },
});

export const { resetCustomerSubscriptionState } = customerSubscriptionSlice.actions;
export default customerSubscriptionSlice.reducer; 