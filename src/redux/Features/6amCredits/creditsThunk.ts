
import { createAsyncThunk } from '@reduxjs/toolkit';
import creditsApi from './creditsApi';
import { WalletBonusTier } from './credits.types';

export const fetchWalletBonus = createAsyncThunk<
  WalletBonusTier,
  void,
  { rejectValue: string }
>(
  'walletBonus/fetchWalletBonus',
  async (_, { rejectWithValue }) => {
    try {
      const res = await creditsApi.getWalletBonusAPI();
      if (res.success) {
        console.log("creditsApi res ::",res.data)
        return res.data;
      } else {
        return rejectWithValue('Failed to fetch wallet bonus tiers');
      }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Network error'
      );
    }
  }
);
