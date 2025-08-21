import { createAsyncThunk } from "@reduxjs/toolkit";
import { DeliverySummaryByProduct, DeliverySummaryByProductSku, GetTodayDeliverySummaryByProductResponse, GetTodayDeliverySummaryBySkuResponse, TodayDelivery, TodayDeliveryListResponse, UpdateOrderStatusRequest, UpdateOrderStatusResponse } from "./delivery.types";
import { getTodayDeliveryListAPI, getTodayDeliverySummaryByProductAPI, getTodayDeliverySummaryByProductSKUAPI, getTomorrowDeliverySummaryByProductAPI, updateOrderStatusAPI } from "./delivery.api";

export const fetchTodayDeliverySummaryByProduct = createAsyncThunk<
  DeliverySummaryByProduct[], 
  string,              
  { rejectValue: string }
>('delivery/fetchTodayDeliverySummaryByProduct', async (storeCode="", { rejectWithValue }) => {
  try {
    const response: GetTodayDeliverySummaryByProductResponse = await getTodayDeliverySummaryByProductAPI(storeCode);
    return response.data; // return only data array
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch delivery summary');
  }
});

export const fetchTodayDeliverySummaryByProductSKU = createAsyncThunk<
  DeliverySummaryByProductSku[], 
  string,              
  { rejectValue: string }
>('delivery/fetchTodayDeliverySummaryByProductSKU', async (storeCode="", { rejectWithValue }) => {
  try {
    const response: GetTodayDeliverySummaryBySkuResponse = await getTodayDeliverySummaryByProductSKUAPI(storeCode);
    return response.data; // return only data array
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch delivery summary');
  }
});
export const fetchTomorrowDeliverySummaryByProduct = createAsyncThunk<
  DeliverySummaryByProduct[], 
  string,              
  { rejectValue: string }
>('delivery/fetchTomorrowDeliverySummaryByProduct', async (storeCode="", { rejectWithValue }) => {
  try {
    const response: GetTodayDeliverySummaryByProductResponse = await getTomorrowDeliverySummaryByProductAPI(storeCode);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch delivery summary');
  }
});
export const fetchTodayDeliveryList = createAsyncThunk<
  TodayDelivery[], 
  string,         
  { rejectValue: string }
>('deliveryList/fetchTodayDeliveryList', async (storeCode="", { rejectWithValue }) => {
  try {
    const response: TodayDeliveryListResponse = await getTodayDeliveryListAPI(storeCode);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch delivery list');
  }
});

export const updateOrderStatus = createAsyncThunk<
  UpdateOrderStatusResponse,       
  UpdateOrderStatusRequest,       
  { rejectValue: string }          
>(
  'delivery/updateOrderStatus',
  async (payload, { rejectWithValue }) => {
    console.log('🚚 [API CALL] updateOrderStatus started...', payload);
    
    try {
      return await updateOrderStatusAPI(payload);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update order status');
    }
  }
);