import API from '../../../services/api';
import {
  CustomerSubscriptionResponse,
  CancelNextDeliveryRequest,
  CancelNextDeliveryResponse,
  RestoreNextDeliveryRequest,
  RestoreNextDeliveryResponse,
  CancelAllSubscriptionsResponse,
} from './customerSubscription.types';

export const fetchCustomerSubscriptionInfoAPI = async (
  phoneNumber: string,
): Promise<CustomerSubscriptionResponse> => {
  try {
    const response = await API.get('/Subscription/GetNextDelivery', {
      params: { PhoneNumber: phoneNumber },
    });

    console.log('✅ API Response - fetchCustomerSubscriptionInfoAPI:', response.data);

    return response.data;
  } catch (error) {
    console.error('❌ API Error - fetchCustomerSubscriptionInfoAPI:', error);
    throw error;
  }
};


export const cancelNextDeliveryAPI = async (
  payload: CancelNextDeliveryRequest,
): Promise<CancelNextDeliveryResponse> => {
  try {
    const response = await API.post(
      'Subscription/CancelNextDelivery',
      payload,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const restoreNextDeliveryAPI = async (
  payload: RestoreNextDeliveryRequest,
): Promise<RestoreNextDeliveryResponse> => {
  try {
    console.log('📦 [API CALL] Restore Next Delivery');
    console.log('➡️ Payload:', payload);
    console.log('➡️ orderId:', payload.orderId);

    const response = await API.post(
      'Subscription/RestoreNextDelivery',
      {},
      {
        params: { orderId: payload.orderId },
      }
    );
    console.log(
      '✅ [API SUCCESS] RestoreNextDelivery Response:',
      response.data,
    );
    return response.data;
  } catch (error) {
    console.error('❌ [API ERROR] RestoreNextDelivery failed:', error);
    throw error;
  }
};

export const cancelAllSubscriptionsAPI = async (
    phoneNumber: string,
    cancelReason: string,
): Promise<CancelAllSubscriptionsResponse> => {
  try {
    const response = await API.post('/Subscription/CancelAllSubscriptions', {}, {
      params: { PhoneNumber: phoneNumber, CancelSubscriptionReason: cancelReason },
    });
    
    console.log('✅ [API SUCCESS] CancelAllSubscriptions Response:', response.data);
    console.log('📊 [API] Response status:', response.status);
    console.log('📊 [API] Response headers:', response.headers);
    return response.data;
  } catch (error: any) {
    console.error('❌ [API ERROR] CancelAllSubscriptions failed:', error);
    console.error('❌ [API ERROR] Error message:', error.message);
    console.error('❌ [API ERROR] Error response:', error.response?.data);
    console.error('❌ [API ERROR] Error status:', error.response?.status);
    throw error;
  }
};

export const fetchCancelSubscriptionReasonAPI = async (): Promise<string[]> => {
  try {
    const response = await API.get('/Subscription/GetCancelSubscriptionReason');
    console.log('✅ [API SUCCESS] Cancel Reasons:', response.data);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.errors?.[0] || 'Unknown error');
    }
  } catch (error) {
    console.error('❌ [API ERROR] Cancel Reasons:', error);
    throw error;
  }
};