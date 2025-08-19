import axios from 'axios';
import {ACTIVE_API_BASE_URL} from '../config/api';
import * as Keychain from 'react-native-keychain';
declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}
const API = axios.create({
  baseURL: ACTIVE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API.interceptors.request.use(
//   async config => {
//     const skipForUrls = [
//       '/Login/GenerateOtp',
//       '/Login/ResendOtp',
//       '/Login/ValidateOtp'
//     ];

//     if (skipForUrls.some(urlPart => config.url?.includes(urlPart))) {
//       return config;
//     }

//     try {
//       const creds = await Keychain.getGenericPassword();
//       if (creds && creds.password) {
//         console.log('Token retrieved from Keychain:', creds);
//         config.headers.Authorization = `Bearer ${creds.password}`;
//       }
//     } catch (err) {
//       console.error('Error retrieving token from Keychain:', err);
//     }

//     return config;
//   },
//   error => Promise.reject(error),
// );


API.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {URL: error?.config?.url});
    console.error('[API ERROR]', error?.response || error?.message);
    return Promise.reject(error);
  },
);
export default API;
