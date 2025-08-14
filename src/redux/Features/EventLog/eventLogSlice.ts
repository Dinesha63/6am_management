import { createSlice } from '@reduxjs/toolkit';
import { EventLogState } from './eventLog.types';
import { saveEventLog } from './eventLogThunk';

const initialState: EventLogState = {
  isSavingEventLog: false,
  error: null,
  success: false,
};

const eventLogSlice = createSlice({
  name: 'eventLog',
  initialState,
  reducers: {
    resetEventLog: (state) => {
      state.isSavingEventLog = false;
      state.error = null;
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveEventLog.pending, (state) => {
        state.isSavingEventLog = true;
        state.error = null;
        state.success = false;
      })
      .addCase(saveEventLog.fulfilled, (state, action) => {
        state.isSavingEventLog = false;
        state.success = action.payload.success;
        state.error = null;
      })
      .addCase(saveEventLog.rejected, (state, action) => {
        state.isSavingEventLog = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetEventLog, clearError } = eventLogSlice.actions;
export default eventLogSlice.reducer;
