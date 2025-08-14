// src/api/subscriptionApi.ts

import API from '../../../services/api';
import { SaveSubscriptionPayload, SaveSubscriptionResponse, SubscriptionResponse } from './subscriptionTypes';
// import { Product } from '../../../types';

//const BASE_URL = 'http://172.21.1.248:8082/6AM/Customer/api/v1/Subscription';

export const fetchSubscription = async (productSkuCode: string | number): Promise<SubscriptionResponse> => {
  const response = await API.get<SubscriptionResponse>(
    `Subscription/NewSubscription?ProductSkuCode=${productSkuCode}`
  );
  return response.data;
};
// export const createSubscription = async (subscriptionData: any): Promise<SubscriptionResponse> => {
//   const response = await API.post<SubscriptionResponse>(
//     `/CreateSubscription`,
//     subscriptionData
//   );
//   return response.data;
// };

export const saveSubscription = async (
  payload: SaveSubscriptionPayload
): Promise<SaveSubscriptionResponse> => {
  const response = await API.post<SaveSubscriptionResponse>(
    'Subscription/SaveSubscription',
    payload
  );
  return response.data;
};