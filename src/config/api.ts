import axios, { AxiosInstance } from 'axios';

export const BASE_URL = 'http://43.205.200.131:8082';
export const TEST_API_BASE_URL = 'https://testapi.skitech.ai/6AM/Main/api/v1';
export const TEST_API_BASE_URL_1 = 'https://testapi.skitech.ai/6AM/Customer/api/v1';
// export const TEST_API_BASE_URL_1 = 'https://testapi.skitech.ai/6AM/Gateway';

//export const API_BASE_URL = 'http://172.21.1.248:8082/6AM/Customer/api/v1';
export const API_BASE_URL = 'http://172.21.1.248:8080/6AM/Gateway';
export const API_BASE_URL_Main = 'http://172.21.1.248:8080/6AM/Main/api/v1';
export const ACTIVE_API_BASE_URL = API_BASE_URL_Main;
export const IMAGE_API_BASE_URL1 = 'https://testapi.skitech.ai/6AM/Customer/';
export const IMAGE_API_BASE_URL2   = 'https://172.21.1.248:8080/6AM/Customer/';
export const IMAGE_API_BASE_URL = IMAGE_API_BASE_URL1;
export const api: AxiosInstance = axios.create({
  baseURL: ACTIVE_API_BASE_URL,
});

export default api;
