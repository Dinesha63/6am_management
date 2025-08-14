import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateCustomerAddressRequest, CustomerAddress } from "./address.types";
import { createCustomerAddressAPI, fetchCustomerAddressAPI, setDefaultAddressAPI, updateCustomerAddressAPI } from "./address.api";

export const createCustomerAddress = createAsyncThunk<
  any,
  FormData,
  {rejectValue: string}
>('customer/createCustomerAddress', async (formData, {rejectWithValue}) => {
  try {
    const data = await createCustomerAddressAPI(formData);
    return data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || 'Failed to create customer address',
    );
  }
});

export const fetchCustomerAddress = createAsyncThunk<
  CustomerAddress[], 
  string,
  { rejectValue: string }
>(
  'customer/fetchCustomerAddress',
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      console.log(phoneNumber, 'Fetching customer address for phone number');
      const response  = await fetchCustomerAddressAPI(phoneNumber);
      return response ?.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || 'Failed to fetch customer address',
      );
    }
  }
);

export const updateCustomerAddress = createAsyncThunk<
  any,
  FormData,
  {rejectValue: string}
>('customer/updateCustomerAddress', async (formData, {rejectWithValue}) => {
  try {
    const data = await updateCustomerAddressAPI(formData);
    return data;
  } catch (err: any) {
    console.log(err, 'Error in updateCustomerAddress thunk');
    return rejectWithValue(
      err.response?.data || 'Failed to update customer address',
    );
  }
});
export const setDefaultAddress = createAsyncThunk<
  any,
  {phoneNumber: string, customerAddressId: string},
  {rejectValue: string}
>('customer/setDefaultAddress', async ({phoneNumber, customerAddressId}, {rejectWithValue}) => {
  try {
    const data = await setDefaultAddressAPI({phoneNumber, customerAddressId});
    return data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data || 'Failed to set default address',
    );
  }
});