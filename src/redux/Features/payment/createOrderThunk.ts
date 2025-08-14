// rechargeThunk.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
//import axios from 'axios';
import { createOrderRequest, createOrderResponse } from './createOrderTypes';
import API from '../../../services/api';

// Replace with your actual endpoint
//const API_URL = 'https://api.example.com/recharge';

export const createOrder = createAsyncThunk<
  createOrderResponse,
  createOrderRequest,
  { rejectValue: string }
>(
  'order/createOrder',
  async (payload, { rejectWithValue }) => {
    try {
      console.log("createOrder payload ::",payload)
      const response = await API.post('/Payment/GenerateOrder', payload);
      console.log('Order created successfully:', response.data);
    return response.data;
      //const response = await axios.post<createOrderResponse>(API_URL, payload);
      //return response.data;
    } catch (error: any) {
      console.log("createOrder error ::",error)
      return rejectWithValue(error.response?.data?.message || 'create Order failed');
    }
  }
);
