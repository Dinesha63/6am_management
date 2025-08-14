
import { createSlice } from '@reduxjs/toolkit';
import { WalletBonusState } from './credits.types';
import { fetchWalletBonus } from './creditsThunk';
import { RootState } from '../../store';

const initialState: WalletBonusState = {
   tiers: {
    minWalletRechargeAmount: 0,
    minSubscriptionDays: 0,
    maxWalletRechargeAmount: 0,
    walletBonus: [],
  },
  loading: false,
  error: null,
};

const walletBonusSlice = createSlice({
  name: 'walletBonus',
  initialState,
  reducers: {
    clearWalletBonus: (state) => {
      state.tiers = {
        minSubscriptionDays: 0,
        minWalletRechargeAmount: 0,
        maxWalletRechargeAmount: 0,
        walletBonus: [],
      };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletBonus.pending, (state) => {
        state.loading = true;
        state.error = null; 
      })
      .addCase(fetchWalletBonus.fulfilled, (state, action) => {
        state.loading = false;
        state.tiers = action.payload;
        state.error = null;
      })
      .addCase(fetchWalletBonus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Failed to fetch wallet bonus';
      });
  },
});

export const { clearWalletBonus } = walletBonusSlice.actions;
export const sixAMCreditsSelector = (state: RootState) => state.walletBonus;
export const walletBonusReducer = walletBonusSlice.reducer;
