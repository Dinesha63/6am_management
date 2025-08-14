// redux/thunks/fetchTransactions.ts
import {createAsyncThunk} from '@reduxjs/toolkit';
import { TransactionResponse} from '../transactionHistory/transactionTypes';
import API from '../../../services/api';

export const fetchTransactions = createAsyncThunk<
  TransactionResponse,
  string,
  {rejectValue: string}
>('transactions/fetch', async (phoneNumber, {rejectWithValue}) => {
  try {
    const response = await API.get(
      `Payment/GetTransactionHistory?PhoneNumber=${phoneNumber}`,
    );
    console.log(response, 'Transaction history fetched successfully');
    return response.data as TransactionResponse;
  } catch (errorTy) {
    let errorMessage = 'Failed to fetch transactions';
    if (errorTy && typeof errorTy === 'object' && 'message' in errorTy) {
      errorMessage = (errorTy as {message: string}).message;
    }
    return rejectWithValue(errorMessage);
  }
});
