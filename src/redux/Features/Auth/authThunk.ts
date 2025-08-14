
import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginUserAPI } from './authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginPayload } from './auth.types';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const data = await loginUserAPI(payload);
      await AsyncStorage.setItem('authKey', data.token);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Login failed');
    }
  }
);
