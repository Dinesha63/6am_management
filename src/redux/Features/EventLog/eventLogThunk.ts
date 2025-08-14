import { createAsyncThunk } from '@reduxjs/toolkit';
import { EventLogRequest } from './eventLog.types';
import { saveEventLogAPI } from './eventLogApi';

// Async thunk for saving event log
export const saveEventLog = createAsyncThunk(
  'eventLog/saveEventLog',
  async (data: EventLogRequest, { rejectWithValue }) => {
    try {
      const response = await saveEventLogAPI(data);
      
      console.log('📊 [THUNK] EventLog API Response:', response);
      
      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.errors?.[0] || 'Failed to save event log');
      }
    } catch (error: any) {
      console.error('❌ [THUNK ERROR] EventLog failed:', error);
      return rejectWithValue(error.message || 'Failed to save event log');
    }
  }
);
