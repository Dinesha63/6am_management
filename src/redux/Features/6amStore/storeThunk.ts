import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchStoreListAPI }   from './storeApi';
import { StoreListResponse }    from './store.types';

export const fetchStoreList = createAsyncThunk<
  any,
  {},
  { rejectValue: string }
>(
  'store/fetchStoreList',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchStoreListAPI();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch stores');
    }
  }
); 