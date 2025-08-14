// src/features/subscription/subscriptionSlice.ts

import { createSlice } from '@reduxjs/toolkit';
import { SubscriptionState } from './subscriptionTypes';
import { getSubscriptionThunk, postSubscriptionThunk } from './subscriptionThunk';

const initialState: SubscriptionState = {
  loading: false,
  error: null,
  subscription: null,
  subscriptionResponse: null,
  
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    resetSubscriptionState: (state) => {
      state.loading = false;
      state.error = null;
      state.subscription = null;
      state.subscriptionResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubscriptionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubscriptionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload;
      })
      .addCase(getSubscriptionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
       .addCase(postSubscriptionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postSubscriptionThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(postSubscriptionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
      
  },
});

export const { resetSubscriptionState } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
