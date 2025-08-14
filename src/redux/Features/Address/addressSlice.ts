import { createSlice } from '@reduxjs/toolkit';
import { CustomerAddress, CustomerInfo } from './address.types';
import { createCustomerAddress, fetchCustomerAddress, setDefaultAddress, updateCustomerAddress } from './addressThunk';

interface CustomerInfoState {
  data: CustomerInfo | null;
  loading: boolean;
  error: string | null;
  addressCreationLoading?: boolean;
  addressCreationError?: string | null;
  addressCreationSuccess?: boolean;
  customerAddresses: CustomerAddress[];
  addressFetchLoading: boolean;
  addressFetchError: string | null;
  addressUpdateLoading?: boolean;
  addressUpdateError?: string | null;
  addressUpdateSuccess?: boolean;
  setDefaultAddressLoading?: boolean;
  setDefaultAddressError?: string | null;
}

const initialState: CustomerInfoState = {
  data: null,
  loading: false,
  error: null,
  addressCreationLoading: false,
  addressCreationError: null,
  addressCreationSuccess: false,
  customerAddresses: [],
  addressFetchLoading: false,
  addressFetchError: null,
  setDefaultAddressLoading: false,
  setDefaultAddressError: null,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    resetAddressState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.addressCreationLoading = false;
      state.addressCreationError = null;
      state.addressCreationSuccess = false;
      state.customerAddresses = [];
      state.addressFetchLoading = false;
      state.addressFetchError = null;
      state.addressUpdateLoading = false;
      state.addressUpdateError = null;
      state.addressUpdateSuccess = false;
      state.setDefaultAddressLoading = false;
      state.setDefaultAddressError = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      })
       .addCase(fetchCustomerAddress.pending, (state) => {
        state.addressFetchLoading = true;
        state.addressFetchError = null;
      })
      .addCase(fetchCustomerAddress.fulfilled, (state, action) => {
        state.addressFetchLoading = false;
        state.customerAddresses = action.payload;
      })
      .addCase(fetchCustomerAddress.rejected, (state, action) => {
        state.addressFetchLoading = false;
        state.addressFetchError = action.payload as string;
      })
      .addCase(updateCustomerAddress.pending, (state) => {
        state.addressUpdateLoading = true;
        state.addressUpdateError = null;
        state.addressUpdateSuccess = false;
      })
      .addCase(updateCustomerAddress.fulfilled, (state, action) => {
        state.addressCreationLoading = false;
        state.addressCreationSuccess = true;
        state.addressCreationError = null;
      })
      .addCase(updateCustomerAddress.rejected, (state, action) => {
        state.addressCreationLoading = false;
        state.addressCreationError = action.payload as string;
        state.addressCreationSuccess = false;
      })
      .addCase(setDefaultAddress.pending, (state) => {
        state.setDefaultAddressLoading = true;
        state.setDefaultAddressError = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.setDefaultAddressLoading = false;
        state.setDefaultAddressError = null;
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.setDefaultAddressLoading = false;
        state.setDefaultAddressError = action.payload as string;
      });
  },
});

export const { resetAddressState } = addressSlice.actions;
export default addressSlice.reducer;