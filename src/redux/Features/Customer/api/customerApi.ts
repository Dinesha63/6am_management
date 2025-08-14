import API from '../../../../services/api';

export const fetchCustomerInfoAPI = async (phoneNumber: string) => {
  // console.log('📞 [API CALL] Fetching customer info for:', phoneNumber);
  try {
    const response = await API.get(`/Customer/GetCustomerInfo`, {
      params: { PhoneNumber: phoneNumber },
    });
    console.log('✅ [API SUCCESS] Customer Info Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [API ERROR] Failed to fetch customer info:', error);
    throw error;
  }
};

export const createCustomerAddressAPI = async (payload: any) => {
  try {
    const response = await API.post('/Customer/CreateAddress', payload);
    return response.data;
  } catch (error) {
    console.error('❌ [API ERROR] Failed to create customer address:', error);
    throw error;
  }
};
