export interface EventLogRequest {
  Message: string;
}

export interface EventLogResponse {
  success: boolean;
  errors: string[];
  data: boolean;
  statusCode: number | null;
}

export interface EventLogState {
  isSavingEventLog: boolean;
  error: string | null;
  success: boolean;
}
