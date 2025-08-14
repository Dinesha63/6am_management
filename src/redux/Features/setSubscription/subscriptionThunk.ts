// src/features/subscription/subscriptionThunk.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchSubscription, saveSubscription } from './subscriptionApi';
import { SaveSubscriptionPayload, SaveSubscriptionResponse, SubscriptionResponse } from './subscriptionTypes';
//import { number } from 'yup';
// import { Product } from '../../../types';

export const getSubscriptionThunk = createAsyncThunk<
  SubscriptionResponse['data'], // return type
  { productSkuCode: string | number },   // input type (productSkuCode)
  { rejectValue: string }
>(
  'subscription/getSubscription',
  async ({ productSkuCode }, { rejectWithValue }) => {
    try {
      const response = await fetchSubscription(productSkuCode);
      if (response.success) {
        return response.data!;
      } else {
        return rejectWithValue(response.errors.join(', ') || 'Unknown error');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'API request failed');
    }
  }
);
export const postSubscriptionThunk = createAsyncThunk<
  SaveSubscriptionResponse,
  SaveSubscriptionPayload,
  { rejectValue: string }
>(
  'subscription/postSubscription',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await saveSubscription(payload);
      if (response.success) {
        console.log(response, 'Subscription saved successfully');
        return response;

      } else {
        return rejectWithValue(response.errors.join(', ') || 'Unknown error');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'API request failed');
    }
  }
);