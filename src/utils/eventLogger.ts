import {AppDispatch} from '../redux/store';
import {saveEventLog} from '../redux/Features/EventLog/eventLogThunk';
import {getStoredPhoneNumber} from '../config/storage';

/**
 * Common event logging utility functions
 * These functions provide standardized ways to log common user actions
 */

export interface EventLogData {
  Message: string;
}

/**
 * Log user subscription events
 */

export const logSubscriptionEvent = async (
  dispatch: AppDispatch,
  data: {
    productName: string;
    schedule: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    phoneNumber?: string;
  },
) => {
  const getPhonenumber = await getStoredPhoneNumber();

  const message = `User subscribed to ${data.productName} with ${
    data.schedule
  } schedule, quantity: ${data.quantity},
   pricePerUnit: ${data.pricePerUnit}, totalPrice: ${data.totalPrice}${
    getPhonenumber ? `, phone: ${getPhonenumber}` : ''
  }`;

  return dispatch(saveEventLog({Message: message}));
};

/**
 * Log user login events
 */
export const logLoginEvent = async (
  dispatch: AppDispatch,
  data: {
    phoneNumber: string;
    method: 'OTP' | 'SMS' | 'Other';
  },
) => {
  const getPhonenumber = await getStoredPhoneNumber();

  const message = `User logged in with phone number: ${
    data.phoneNumber
  } using ${data.method} method
   ${getPhonenumber ? `, phone: ${getPhonenumber}` : ''}`;

  return dispatch(saveEventLog({Message: message}));
};

/**
 * Log user logout events
 */
export const logLogoutEvent = async (
  dispatch: AppDispatch,
  data: {
    phoneNumber?: string;
    reason?: string;
  },
) => {
  const getPhonenumber = await getStoredPhoneNumber();

  const message = `User logged out${
    data.phoneNumber ? ` with phone number: ${data.phoneNumber}` : ''
  }${data.reason ? `, reason: ${data.reason}` : ''} 
  ${getPhonenumber ? `, phone: ${getPhonenumber}` : ''}`;

  return dispatch(saveEventLog({Message: message}));
};

/**
 * Log order placement events
 */
export const logOrderEvent = async (
  dispatch: AppDispatch,
  data: {
    orderId: string;
    totalAmount: number;
    itemsCount: number;
    deliveryAddress?: string;
    phoneNumber?: string;
  },
) => {
  const getPhonenumber = await getStoredPhoneNumber();

  const message = `User placed order: ${data.orderId}, total amount: ${
    data.totalAmount
  }, 
  items: ${data.itemsCount}${
    data.deliveryAddress ? `, delivery address: ${data.deliveryAddress}` : ''
  }
  ${getPhonenumber ? `, phone: ${getPhonenumber}` : ''}`;

  return dispatch(saveEventLog({Message: message}));
};

/**
 * Log payment events
 */
export const logPaymentEvent = async (
  dispatch: AppDispatch,
  data: {
    orderId: string;
    amount: number;
    method: string;
    status: 'success' | 'failed' | 'pending';
    phoneNumber?: string;
  },
) => {
  const getPhonenumber = await getStoredPhoneNumber();

  const message = `Payment ${data.status} for order: ${data.orderId}, amount: ${
    data.amount
  }, method: ${data.method}${
    getPhonenumber
      ? `,
     phone: ${getPhonenumber}`
      : ''
  }`;
  console.log('logPaymentEvent ::', message);
  return dispatch(saveEventLog({Message: message}));
};

/**
 * Log address management events
 */
export const logAddressEvent = async (
  dispatch: AppDispatch,
  data: {
    action: 'add' | 'update' | 'delete';
    addressType: string;
    address?: string;
    phoneNumber?: string;
  },
) => {
  const getPhonenumber = await getStoredPhoneNumber();

  const message = `User ${data.action}ed ${data.addressType} address${
    data.address ? `: ${data.address}` : ''
  }${getPhonenumber ? `, phone: ${getPhonenumber}` : ''}`;
  console.log('logAddressEvent :', message);
  return dispatch(saveEventLog({Message: message}));
};

/**
 * Log profile update events
 */
export const logProfileUpdateEvent = async (
  dispatch: AppDispatch,
  data: {
    field: string;
    oldValue?: string;
    newValue?: string;
    phoneNumber?: string;
  },
) => {
  const getPhonenumber = await getStoredPhoneNumber();

  const message = `User updated profile field: ${data.field}${
    data.oldValue && data.newValue
      ? ` from "${data.oldValue}" to "${data.newValue}"`
      : ''
  }${getPhonenumber ? `, phone: ${getPhonenumber}` : ''}`;

  return dispatch(saveEventLog({Message: message}));
};

/**
 * Generic event logger for custom messages
 */
export const logCustomEvent = async (
  dispatch: AppDispatch,
  message: string,
) => {
  console.log('logCustomEvent ::', message);
  return dispatch(saveEventLog({Message: message}));
};

/**
 * Log error events
 */
export const logErrorEvent = async (
  dispatch: AppDispatch,
  data: {
    error: string;
    context?: string;
    userId?: string;
    phoneNumber?: string;
  },
) => {
  const getPhonenumber = await getStoredPhoneNumber();

  const message = `Error occurred${
    data.context ? ` in ${data.context}` : ''
  }: ${data.error}${data.userId ? `, User ID: ${data.userId}` : ''}
    ${getPhonenumber ? `, phone: ${getPhonenumber}` : ''}`;

  return dispatch(saveEventLog({Message: message}));
};

/**
 * Extract phone number from event log message
 */
export const extractPhoneNumberFromMessage = (
  message: string,
): string | null => {
  const phoneRegex = /phone:\s*(\d{10})/;
  const match = message.match(phoneRegex);
  return match ? match[1] : null;
};

/**
 * Extract all phone numbers from an array of event log messages
 */
export const extractPhoneNumbersFromMessages = (
  messages: string[],
): string[] => {
  const phoneNumbers = new Set<string>();

  messages.forEach(message => {
    const phoneNumber = extractPhoneNumberFromMessage(message);
    if (phoneNumber) {
      phoneNumbers.add(phoneNumber);
    }
  });

  return Array.from(phoneNumbers);
};

/**
 * Search event logs by phone number
 */
export const searchEventLogsByPhoneNumber = async (
  dispatch: AppDispatch,
  phoneNumber: string,
) => {
  // This would need to be implemented based on your event log storage structure
  // You might need to create a new API endpoint or modify existing ones
  const message = `Searching event logs for phone number: ${phoneNumber}`;
  return dispatch(saveEventLog({Message: message}));
};

/**
 * Get all events for a specific phone number
 */
export const getEventsByPhoneNumber = async (
  dispatch: AppDispatch,
  phoneNumber: string,
) => {
  const message = `Retrieved all events for phone number: ${phoneNumber}`;
  return dispatch(saveEventLog({Message: message}));
};

/**
 * Helper function to log subscription events with stored phone number
 */
export const logSubscriptionEventWithStoredPhone = async (
  dispatch: AppDispatch,
  data: {
    productName: string;
    schedule: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
  },
) => {
  const getPhonenumber = await getStoredPhoneNumber();
  return logSubscriptionEvent(dispatch, {
    ...data,
    phoneNumber: getPhonenumber || undefined,
  });
};

/**
 * Helper function to log order events with stored phone number
 */
export const logOrderEventWithStoredPhone = async (
  dispatch: AppDispatch,
  data: {
    orderId: string;
    totalAmount: number;
    itemsCount: number;
    deliveryAddress?: string;
  },
) => {
  const getPhonenumber = await getStoredPhoneNumber();
  return logOrderEvent(dispatch, {
    ...data,
    phoneNumber: getPhonenumber || undefined,
  });
};

/**
 * Helper function to log payment events with stored phone number
 */
export const logPaymentEventWithStoredPhone = async (
  dispatch: AppDispatch,
  data: {
    orderId: string;
    amount: number;
    method: string;
    status: 'success' | 'failed' | 'pending';
  },
) => {
  const getPhonenumber = await getStoredPhoneNumber();
  return logPaymentEvent(dispatch, {
    ...data,
    phoneNumber: getPhonenumber || undefined,
  });
};

/**
 * Helper function to log address events with stored phone number
 */
export const logAddressEventWithStoredPhone = async (
  dispatch: AppDispatch,
  data: {
    action: 'add' | 'update' | 'delete';
    addressType: string;
    address?: string;
  },
) => {
  const getPhonenumber = await getStoredPhoneNumber();
  return logAddressEvent(dispatch, {
    ...data,
    phoneNumber: getPhonenumber || undefined,
  });
};

/**
 * Helper function to log profile update events with stored phone number
 */
export const logProfileUpdateEventWithStoredPhone = async (
  dispatch: AppDispatch,
  data: {
    field: string;
    oldValue?: string;
    newValue?: string;
  },
) => {
  const getPhonenumber = await getStoredPhoneNumber();
  return logProfileUpdateEvent(dispatch, {
    ...data,
    phoneNumber: getPhonenumber || undefined,
  });
};

/**
 * Helper function to log error events with stored phone number
 */
export const logErrorEventWithStoredPhone = async (
  dispatch: AppDispatch,
  data: {
    error: string;
    context?: string;
    userId?: string;
  },
) => {
  const getPhonenumber = await getStoredPhoneNumber();
  return logErrorEvent(dispatch, {
    ...data,
    phoneNumber: getPhonenumber || undefined,
  });
};

/**
 * Generic event logger with stored phone number
 */
export const logCustomEventWithStoredPhone = async (
  dispatch: AppDispatch,
  message: string,
) => {
  const getPhonenumber = await getStoredPhoneNumber();
  const fullMessage = getPhonenumber
    ? `${message}, phone: ${getPhonenumber}`
    : message;
  return logCustomEvent(dispatch, fullMessage);
};
