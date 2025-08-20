import API from '../../../services/api';
import { StoreListResponse } from './store.types';
const BASE_URL = 'http://172.21.1.248:8080/6AM/Main/api/v1/Store/';
const TEST_API_BASE_URL = 'https://testapi.skitech.ai/6AM/Main/api/v1/Store/';
export const fetchStoreListAPI = async (): Promise<StoreListResponse> => {
  const response = await API.get<StoreListResponse>(
    `${BASE_URL}GetStoreList`
  );
  return response.data;
};
