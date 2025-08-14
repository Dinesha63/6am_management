// rechargeSlice.ts

import { createSlice } from '@reduxjs/toolkit';
import { createOrderState } from './createOrderTypes';
import { createOrder } from './createOrderThunk';

const initialState: createOrderState = {
  loading: false,
  error: null,
  response: null,
};

const createOrderSlice = createSlice({
  name: 'createOrder',
  initialState,
  reducers: {
    resetCreateOrderState: (state) => {
      state.loading = false;
      state.error = null;
      state.response = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.response = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });
  },
});

export const { resetCreateOrderState } = createOrderSlice.actions;
export default createOrderSlice.reducer;
