import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeliverySummaryByProduct, DeliverySummaryByProductSku, TodayDelivery } from './delivery.types';
import { RootState } from '../../store';
import { fetchTodayDeliveryList, fetchTodayDeliverySummaryByProduct, fetchTodayDeliverySummaryByProductSKU } from './deliveryThunk';

export interface DeliveryState {
  deliverySummaryByProduct: DeliverySummaryByProduct[];
  deliverySummaryByProductSku: DeliverySummaryByProductSku[];
  todayDeliveryList: TodayDelivery[];
  loading: boolean;
  error: string | null;
}

const initialState: DeliveryState = {
  deliverySummaryByProduct: [],
  deliverySummaryByProductSku: [],
  todayDeliveryList: [],
  loading: false,
  error: null,
};
const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    resetDeliveryState: (state) => {
      state.deliverySummaryByProduct = [];
      state.deliverySummaryByProductSku = [];
      state.todayDeliveryList = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodayDeliverySummaryByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayDeliverySummaryByProduct.fulfilled, (state, action: PayloadAction<DeliverySummaryByProduct[]>) => {
        state.loading = false;
        state.deliverySummaryByProduct = action.payload;
      })
      .addCase(fetchTodayDeliverySummaryByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      .addCase(fetchTodayDeliverySummaryByProductSKU.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayDeliverySummaryByProductSKU.fulfilled, (state, action: PayloadAction<DeliverySummaryByProductSku[]>) => {
        state.loading = false;
        state.deliverySummaryByProductSku = action.payload;
      })
      .addCase(fetchTodayDeliverySummaryByProductSKU.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      .addCase(fetchTodayDeliveryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayDeliveryList.fulfilled, (state, action: PayloadAction<TodayDelivery[]>) => {
        state.loading = false;
        state.todayDeliveryList = action.payload;
      })
      .addCase(fetchTodayDeliveryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });

  },
});

export const { resetDeliveryState } = deliverySlice.actions;
export default deliverySlice.reducer;
export const selectDelivery = (state: RootState) => state.delivery;