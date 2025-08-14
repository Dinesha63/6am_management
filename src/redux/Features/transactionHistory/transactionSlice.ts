// redux/slices/transactionSlice.ts
import {createSlice} from '@reduxjs/toolkit';
import {fetchTransactions} from '../transactionHistory/fetchTransactionsThunk';
import type { TransactionItem} from '../transactionHistory/transactionTypes';

interface TransactionState {
  data: TransactionItem[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  data: [],
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    resetTransactionState: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTransactions.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        console.log(action.payload, 'Transaction data fetched successfully');
        state.data = action.payload.data as TransactionItem[];
        state.loading = false;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetTransactionState } = transactionSlice.actions;
export default transactionSlice.reducer;
