import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import mockUserData from '../utils/mock-data/mockUserData.json';

interface UserState {
  has_active_subscription: boolean;
  isGuest: boolean;
}

const initialState: UserState = {
  ...mockUserData,
  isGuest: false, // TRUE OR FALSE
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateSubscriptionStatus(state, action: PayloadAction<boolean>) {
      state.has_active_subscription = action.payload;
    },
    setGuestState(state, action: PayloadAction<boolean>) {
      state.isGuest = action.payload;
    },
  },
});

export const { updateSubscriptionStatus, setGuestState } = userSlice.actions;
export default userSlice.reducer;
