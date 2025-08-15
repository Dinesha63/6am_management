import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import mockUserData from '../utils/mock-data/mockUserData.json';

interface UserState {
  has_active_subscription: boolean;
  isGuest: boolean;
  isAuthenticated: boolean;
  userRole: 'superAdmin' | 'admin' | null;
  username: string | null;
}

const initialState: UserState = {
  ...mockUserData,
  isGuest: false, // TRUE OR FALSE
  isAuthenticated: false,
  userRole: null,
  username: null,
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
    setUserAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setUserRole(state, action: PayloadAction<'superAdmin' | 'admin' | null>) {
      state.userRole = action.payload;
    },
    setUsername(state, action: PayloadAction<string | null>) {
      state.username = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.userRole = null;
      state.username = null;
      state.isGuest = false;
    },
  },
});

export const { 
  updateSubscriptionStatus, 
  setGuestState, 
  setUserAuthenticated, 
  setUserRole, 
  setUsername, 
  logout 
} = userSlice.actions;
export default userSlice.reducer;
