import {createAsyncThunk} from '@reduxjs/toolkit';
import { CreateCustomerAddressRequest } from '../types/customer.types';
import { createCustomerAddressAPI, fetchCustomerInfoAPI } from '../api/customerApi';

export const fetchCustomerInfo = createAsyncThunk(
  'customer/fetchCustomerInfo',
  async (phoneNumber: string, {rejectWithValue}) => {
    try {
      // console.log('📞 Fetching customer info for:', phoneNumber);
      const data = await fetchCustomerInfoAPI(phoneNumber);
      console.log('✅ API Response:', data);
      return data;
    } catch (err: any) {
      console.error('❌ Error fetching customer info:', err);
      return rejectWithValue(
        err.response?.data || 'Failed to fetch customer info',
      );
    }
  },
);

export const createCustomerAddress = createAsyncThunk<
  any,
  CreateCustomerAddressRequest,
  {rejectValue: string}
>('customer/createCustomerAddress', async (payload, {rejectWithValue}) => {
  try {
    const data = await createCustomerAddressAPI(payload);
    return data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || 'Failed to create customer address',
    );
  }
});
