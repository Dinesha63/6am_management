import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StoreListState, StoreListResponse } from './store.types';
import { fetchStoreList } from './storeThunk';
import { RootState } from '../../store';

const initialState: StoreListState = {
  nearbyStoreDistance: 0,
  stores: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    resetStoreState: (state) => {
      state.nearbyStoreDistance = 0;
      state.stores = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchStoreList.fulfilled,
        (state, action: PayloadAction<StoreListResponse>) => {
          state.loading = false;

          state.nearbyStoreDistance = action.payload.data.nearbyStoreDistance;
          state.stores = action.payload.data.storeList;
        }
      )
      .addCase(fetchStoreList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch store list';
      });
  },
});

export const { resetStoreState } = slice.actions;
export const selectStoreState = (state: RootState) => state.store;
export default slice.reducer;
