// deliveryAPI.ts
import API from '../../../services/api';
import { GetTodayDeliverySummaryByProductResponse, GetTodayDeliverySummaryBySkuResponse, TodayDeliveryListResponse, UpdateOrderStatusRequest, UpdateOrderStatusResponse } from './delivery.types';

export const getTodayDeliverySummaryByProductAPI = async (
  storeCode: string
): Promise<GetTodayDeliverySummaryByProductResponse> => {

  try {
    console.log('🚚 [API CALL] getTodayDeliverySummaryByProductAPI started..., storeCode:', storeCode);
    const response = await API.get(
      `/Delivery/GetTodayDeliverySummaryByProduct?StoreCode=${storeCode}`
    );
    console.log('✅ [API SUCCESS] Delivery Summary Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [API ERROR] Failed to fetch delivery summary:', error);
    throw error;
  }
};

export const getTomorrowDeliverySummaryByProductAPI = async (
  storeCode: string
): Promise<GetTodayDeliverySummaryByProductResponse> => {

  try {
    console.log('🚚 [API CALL] getTomorrowDeliverySummaryByProductAPI started..., storeCode:', storeCode);
    const response = await API.get(
      `/Delivery/GetTomorrowDeliverySummaryByProduct?StoreCode=${storeCode}`
    );
    console.log('✅ [API SUCCESS] Delivery Summary Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [API ERROR] Failed to fetch delivery summary:', error);
    throw error;
  }
};

export const getTodayDeliverySummaryByProductSKUAPI = async (
  storeCode: string
): Promise<GetTodayDeliverySummaryBySkuResponse> => {
  console.log('🚚 [API CALL] getTodayDeliverySummaryByProductSKUAPI started...');

  try {
    const response = await API.get(
      `/Delivery/GetTodayDeliverySummaryByProductSku?StoreCode=${storeCode}`
    );
    console.log('✅ [API SUCCESS] Delivery Summary by Product Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [API ERROR] Failed to fetch delivery summary by product:', error);
    throw error;
  }
};
export const getTodayDeliveryListAPI = async (
  storeCode: string
): Promise<TodayDeliveryListResponse> => {
  console.log('🚚 [API CALL] getTodayDeliveryListAPI started...');

  try {
    const response = await API.get(
      `/Delivery/GetTodayDeliveryList?StoreCode=${storeCode}`
    );
    console.log('✅ [API SUCCESS] Today Delivery List Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [API ERROR] Failed to fetch today delivery list:', error);
    throw error;
  }
};

export const updateOrderStatusAPI = async (
  payload: UpdateOrderStatusRequest
): Promise<UpdateOrderStatusResponse> => {
  const response = await API.post('/Delivery/UpdateOrderStatus',
    payload
  );
  return response.data;
};
