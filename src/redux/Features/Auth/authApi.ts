import API from '../../../services/api';
import { LoginPayload } from './auth.types';

export const loginUserAPI = async (payload: LoginPayload) => {
  const response = await API.post('/auth/login', payload);
  return response.data;
};
