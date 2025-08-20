import API from '../../../services/api';
import { LoginPayload } from './auth.types';
const BASE_URL = 'http://172.21.1.248:8080/6AM/Main/api/v1';
const TEST_API_BASE_URL = 'https://testapi.skitech.ai/6AM/Main/api/v1';
export const loginUserAPI = async (payload: LoginPayload) => {
  const response = await API.post(`${BASE_URL}/Employee/VerifyEmployeeLogin`, payload);
  return response.data;
};
