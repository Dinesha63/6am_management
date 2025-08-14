import { createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchCustomerSubscriptionInfoAPI, 
  cancelNextDeliveryAPI, 
  restoreNextDeliveryAPI,
  cancelAllSubscriptionsAPI,
  fetchCancelSubscriptionReasonAPI
} from './customerSubscriptionApi';
import { 
  CustomerSubscriptionResponse, 
  CancelNextDeliveryRequest, 
  CancelNextDeliveryResponse, 
  RestoreNextDeliveryRequest, 
  RestoreNextDeliveryResponse,
  CancelAllSubscriptionsResponse 
} from './customerSubscription.types';

export const fetchCustomerSubscriptionInfo = createAsyncThunk<
  CustomerSubscriptionResponse,
  string,
  { rejectValue: string }
>(
  'customer/fetchCustomerSubscriptionInfo',
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const data = await fetchCustomerSubscriptionInfoAPI(phoneNumber);
      console.log("fetchCustomerSubscriptionInfo :", data)
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.errors?.[0] || 'Failed to fetch customer subscription info');
    }
  }
);

export const cancelNextDelivery = createAsyncThunk<
  CancelNextDeliveryResponse,
  CancelNextDeliveryRequest,
  { rejectValue: string }
>(
  'customer/cancelNextDelivery',
  async (payload, { rejectWithValue }) => {
    console.log('📦 [THUNK] cancelNextDelivery called');
    console.log('➡️ Payload:', payload);

    try {
      const data = await cancelNextDeliveryAPI(payload);
      console.log('✅ [API SUCCESS] cancelNextDelivery response:', data);
      return data;
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.errors?.[0] || 'Failed to cancel next delivery';
      console.error('❌ [API ERROR] cancelNextDelivery failed:', errorMsg, err);
      return rejectWithValue(errorMsg);
    }
  }
);

export const restoreNextDelivery = createAsyncThunk<
  RestoreNextDeliveryResponse,
  RestoreNextDeliveryRequest,
  { rejectValue: string }
>(
  'customer/restoreNextDelivery',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await restoreNextDeliveryAPI(payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.errors?.[0] || 'Failed to restore next delivery');
    }
  }
);

export const cancelAllSubscriptions = createAsyncThunk<
  CancelAllSubscriptionsResponse,
  {phoneNumber: string, cancelReason: string},
  { rejectValue: string }
>(
  'customer/cancelAllSubscriptions',
  async ({phoneNumber, cancelReason}    , { rejectWithValue }) => {
    console.log('📦 [THUNK] cancelAllSubscriptions called');
    console.log('➡️ PhoneNumber:', phoneNumber);
    console.log('➡️ CancelReason:', cancelReason);
    try {
      const data = await cancelAllSubscriptionsAPI(phoneNumber,cancelReason);
      console.log('✅ [API SUCCESS] cancelAllSubscriptions response:', data);
      return data;
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.errors?.[0] || 'Failed to cancel all subscriptions';
      console.error('❌ [API ERROR] cancelAllSubscriptions failed:', errorMsg, err);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchCancelReasons = createAsyncThunk(
  'cancelReason/fetchCancelReasons',
  async (_, { rejectWithValue }) => {
    try {
      const reasons = await fetchCancelSubscriptionReasonAPI();
      return reasons;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);


