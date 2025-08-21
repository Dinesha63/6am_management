import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  DeliverySummaryByProduct,
  DeliverySummaryByProductSku,
  TodayDelivery,
  UpdateOrderStatusResponse,
} from './delivery.types';
import {RootState} from '../../store';
import {
  fetchTodayDeliveryList,
  fetchTodayDeliverySummaryByProduct,
  fetchTodayDeliverySummaryByProductSKU,
  fetchTomorrowDeliverySummaryByProduct,
  updateOrderStatus,
} from './deliveryThunk';

export interface DeliveryState {
  deliverySummaryByProduct: DeliverySummaryByProduct[];
  deliverySummaryByProductSku: DeliverySummaryByProductSku[];
  tomorrowDeliverySummaryByProduct: DeliverySummaryByProduct[];
  todayDeliveryList: TodayDelivery[];
  loading: boolean;
  error: string | null;
  updating: boolean;
  updateSuccess: boolean | null;
  updateError: string | null;
}

const initialState: DeliveryState = {
  deliverySummaryByProduct: [],
  deliverySummaryByProductSku: [],
  tomorrowDeliverySummaryByProduct: [],
  todayDeliveryList: [],
  loading: false,
  error: null,
  updating: false,
  updateSuccess: null,
  updateError: null,
};
const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    resetDeliveryState: state => {
      state.deliverySummaryByProduct = [];
      state.deliverySummaryByProductSku = [];
      state.todayDeliveryList = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodayDeliverySummaryByProduct.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTodayDeliverySummaryByProduct.fulfilled,
        (state, action: PayloadAction<DeliverySummaryByProduct[]>) => {
          state.loading = false;
          state.deliverySummaryByProduct = action.payload;
        },
      )
      .addCase(fetchTodayDeliverySummaryByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      .addCase(fetchTodayDeliverySummaryByProductSKU.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTodayDeliverySummaryByProductSKU.fulfilled,
        (state, action: PayloadAction<DeliverySummaryByProductSku[]>) => {
          state.loading = false;
          state.deliverySummaryByProductSku = action.payload;
        },
      )
      .addCase(
        fetchTodayDeliverySummaryByProductSKU.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Something went wrong';
        },
      )
      .addCase(fetchTodayDeliveryList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTodayDeliveryList.fulfilled,
        (state, action: PayloadAction<TodayDelivery[]>) => {
          state.loading = false;
          state.todayDeliveryList = action.payload;
        },
      )
      .addCase(fetchTodayDeliveryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      .addCase(fetchTomorrowDeliverySummaryByProduct.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTomorrowDeliverySummaryByProduct.fulfilled,
        (state, action: PayloadAction<DeliverySummaryByProduct[]>) => {
          state.loading = false;
          state.tomorrowDeliverySummaryByProduct = action.payload;
        },
      )
      .addCase(
        fetchTomorrowDeliverySummaryByProduct.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Something went wrong';
        },
      )
      .addCase(updateOrderStatus.pending, state => {
        state.updating = true;
        state.updateSuccess = null;
        state.updateError = null;
      })
      .addCase(
        updateOrderStatus.fulfilled,
        (state, action: PayloadAction<UpdateOrderStatusResponse>) => {
          state.updating = false;
          state.updateSuccess = action.payload.success;
          state.updateError = null;
        },
      )
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.updateError = action.payload ?? 'Failed to update status';
      });
  },
});

export const {resetDeliveryState} = deliverySlice.actions;
export default deliverySlice.reducer;
export const selectDelivery = (state: RootState) => state.delivery;
