import API from '../../../services/api';
import { StoreListResponse } from './store.types';

export const fetchStoreListAPI = async (): Promise<StoreListResponse> => {
  const response = await API.get(
    'https://testapi.skitech.ai/6AM/Main/api/v1/Store/GetStoreList'
  );
  return response.data;
}; 