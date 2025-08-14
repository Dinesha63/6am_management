import axios from 'axios';
import React, {createContext, useState, ReactNode} from 'react';
import * as PermissionsUtil from '../config/permissions';
import * as StorageUtil from '../config/storage';
//import {ACTIVE_API_BASE_URL} from '../config/api';
import Geolocation from '@react-native-community/geolocation';
import {GOOGLE_API_KEY} from '../config/apiKeys';
import { ACTIVE_API_BASE_URL } from '../config/api';
import { Alert } from 'react-native';

interface ApiContextType {
  api: {
    requestLocationPermission: () => Promise<boolean>;
    requestReadSmsPermission: () => Promise<boolean>;
    requestSmsPermission: () => Promise<boolean>;
    getStoredPhoneNumber: () => Promise<string | null>;
    isOtpVerified: boolean;
    markOtpVerified: () => Promise<void>;
    isLoading: boolean;
    markAppLoaded: () => void;
    requestCameraPermission: () => Promise<boolean>;
    getCurrentLocation: () => Promise<Location>;
    getPlusCode: (lat: number, lng: number) => Promise<string>;
    formatDate: (dateString?: string) => string;
    getAddressFromCoordinates: (latitude: number, longitude: number) => Promise<string | null>;
    logSubscriptionEvent: (message: string) => Promise<void>;
  };
}

interface ApiProviderProps {
  children: ReactNode;
}

interface Location {
  latitude: number;
  longitude: number;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<ApiProviderProps> = ({children}) => {
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const markOtpVerified = async (): Promise<void> => {
    await StorageUtil.markOtpVerified();
    setIsOtpVerified(true);
  };

  const markAppLoaded = (): void => setIsLoading(false);

  const getCurrentLocation = async (): Promise<Location> => {
    try {
      return new Promise<Location>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => {
            const Location: Location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            resolve(Location);
          },
          error => {
            const Location: Location = {
              latitude: 11.016522345515527,
              longitude: 76.96136636539204,
            };
            resolve(Location);
            //console.log(error.code, error.message);
            reject(error);
          },
          {enableHighAccuracy: false, timeout: 10000, maximumAge: 10000},
        );
      });
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  };

  const getPlusCode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}&result_type=plus_code`,
      );
      const plusCode = response.data.plus_code?.compound_code;
      if (!plusCode) {
        throw new Error('Plus code not found in response');
      }
      return plusCode;
    } catch (error) {
      console.error('Error fetching plus code:', error);
      throw error;
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

   const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number
  ): Promise<string | null> => {
    try {
      const response = await axios.get<{
        results: { formatted_address: string }[];
        status: string;
      }>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );
  
      if (response.data.status === 'OK' && response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      } else {
        console.error('Geocoding error:', response.data.status);
        return null;
      }
    } catch (error: any) {
      console.error('Geocoding API error:', error.message || error);
      return null;
    }
  };

  const logSubscriptionEvent = async (message: string): Promise<void> => {
    try {
      const response = await axios.post(
        `${ACTIVE_API_BASE_URL}/Home/SaveEventLog`,
        {},
        {
          params: { Message: message },
        }
      );
      
      console.log('✅ [API CONTEXT] EventLog Response:', response.data);
    } catch (error: any) {
      console.error('❌ [API CONTEXT] EventLog failed:', error);
      // Don't throw error to prevent blocking the main flow
    }
  };
  

  const api = {
    requestLocationPermission: PermissionsUtil.requestLocationPermission,
    requestReadSmsPermission: PermissionsUtil.requestReadSmsPermission,
    requestSmsPermission: PermissionsUtil.requestSmsPermission,
    requestCameraPermission: PermissionsUtil.requestCameraPermission,
  
    getStoredPhoneNumber: StorageUtil.getStoredPhoneNumber,
    isOtpVerified,
    markOtpVerified,
    isLoading,
    markAppLoaded,
    getCurrentLocation,
    getPlusCode,
    formatDate,
    getAddressFromCoordinates,
    logSubscriptionEvent,
  };

  return <ApiContext.Provider value={{api}}>{children}</ApiContext.Provider>;
};

export default ApiContext;
export type {Location};

