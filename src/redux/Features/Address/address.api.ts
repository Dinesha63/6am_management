import API from "../../../services/api";
import { CreateCustomerAddressRequest } from "./address.types";

export const createCustomerAddressAPI = async (formData: FormData) => {
  try {
    console.log(formData, 'Payload for creating address in API');
    const response = await API.post('/Customer/CreateAddress', formData,{
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      }
    });
    console.log("response ::", response.data)
    return response.data;
  } catch (error) {
    console.error('❌ [API ERROR] Failed to create customer address:', error);
    throw error;
  }
};

export const fetchCustomerAddressAPI = async (phoneNumber: string) => {
  try {
    const response = await API.get(`/Customer/GetAddressList`, {
      params: {
        PhoneNumber: phoneNumber,
      },
    });
    return response.data;
  } catch (error) {
    console.error('❌ [API ERROR] Failed to fetch customer address:', error);
    throw error;
  }
};

export const updateCustomerAddressAPI = async (formData: FormData) => {
  try {
    console.log(formData, 'Payload for updating address in API');
    const response = await API.post('/Customer/UpdateAddress', formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ [API ERROR] Failed to update customer address:', error);
    throw error;
  }
};

export const setDefaultAddressAPI = async (payload: any) => {
  try {
    console.log(payload, 'Payload for setting default address in API');
    const response = await API.post('/Customer/SetDefaultAddress', payload);
    console.log(response, 'Response from setting default address API');
    return response.data;
  } catch (error) {
    console.error('❌ [API ERROR] Failed to set default address:', error);
    throw error;
  }
};