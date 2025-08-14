import { EventLogRequest, EventLogResponse } from './eventLog.types';
import API from '../../../services/api';

export const saveEventLogAPI = async (data: EventLogRequest): Promise<EventLogResponse> => {
  try {
    console.log('📡 [API REQUEST] SaveEventLog:', data);
    const response = await API.post('/Home/SaveEventLog', {}, {
      params: { Message: data.Message },
    });
    
    console.log('✅ [API SUCCESS] SaveEventLog Response:', response.data);
    
    return {
      success: true,
      errors: [],
      data: response.data,
      statusCode: null,
    };
  } catch (error: any) {
    console.error('❌ [API ERROR] SaveEventLog failed:', error);
   
    
    return {
      success: false,
      errors: [error.message || 'Failed to save event log'],
      data: false,
      statusCode: null,
    };
  }
};
