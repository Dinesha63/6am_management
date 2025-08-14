import { createSlice } from '@reduxjs/toolkit';
import { CustomerInfo } from '../types/customer.types';
import { createCustomerAddress, fetchCustomerInfo } from '../thunks/customerThunk';

interface CustomerInfoState {
  data: CustomerInfo | null;
  loading: boolean;
  error: string | null;
  addressCreationLoading?: boolean;
  addressCreationError?: string | null;
  addressCreationSuccess?: boolean;
}

const initialState: CustomerInfoState = {
  data: null,
  loading: false,
  error: null,
  addressCreationLoading: false,
  addressCreationError: null,
  addressCreationSuccess: false,
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    resetCustomerState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.addressCreationLoading = false;
      state.addressCreationError = null;
      state.addressCreationSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.error = null;
      })
      .addCase(fetchCustomerInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCustomerAddress.pending, (state) => {
        state.addressCreationLoading = true;
        state.addressCreationError = null;
        state.addressCreationSuccess = false;
      })
      .addCase(createCustomerAddress.fulfilled, (state, action) => {
        state.addressCreationLoading = false;
        state.addressCreationSuccess = true;
        state.addressCreationError = null;
      })
      .addCase(createCustomerAddress.rejected, (state, action) => {
        state.addressCreationLoading = false;
        state.addressCreationError = action.payload as string;
        state.addressCreationSuccess = false;
      });
  },
});

export const { resetCustomerState } = customerSlice.actions;
export default customerSlice.reducer; 