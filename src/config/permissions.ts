import { Platform, PermissionsAndroid } from 'react-native';

/**
 * Utility functions for handling permissions in the app
 */

/**
 * Request location permission
 * @returns Promise resolving to boolean indicating if permission was granted
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted.');
        return true;
      } else {
        console.log('Location permission denied.');
        return false;
      }
    }
    return false;
  } catch (err) {
    console.error('Failed to request location permission:', err);
    return false;
  }
};

/**
 * Request camera permission
 * @returns Promise resolving to boolean indicating if permission was granted
 */
export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted.');
        return true;
      } else {
        console.log('Camera permission denied.');
        return false;
      }
    }
    return false;
  } catch (err) {
    console.error('Failed to request camera permission:', err);
    return false;
  }
};

/**
 * Request READ_SMS permission
 * @returns Promise resolving to boolean indicating if permission was granted
 */
export const requestReadSmsPermission = async (): Promise<boolean> => {
  console.log('[PERMISSION] Checking READ_SMS permission...');

  if (Platform.OS === 'android') {
    try {
      console.log('[PERMISSION] Platform is Android. Requesting READ_SMS...');

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'SMS Permission',
          message:
            'This app needs access to read your SMS for OTP auto-detection.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('✅ READ_SMS permission granted');
        return true;
      } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
        console.warn('❌ READ_SMS permission denied by user');
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.warn('🚫 READ_SMS permission set to "Never Ask Again"');
      } else {
        console.warn('❓ Unknown permission result:', granted);
      }

      return false;
    } catch (err) {
      console.error('🔥 Error requesting READ_SMS permission:', err);
      return false;
    }
  } else {
    console.log(
      '[PERMISSION] Non-Android platform, skipping READ_SMS permission',
    );
    return true;
  }
};

/**
 * Request all SMS-related permissions
 * @returns Promise resolving to boolean indicating if all permissions were granted
 */
export const requestSmsPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      ]);

      console.log('[PERMISSION CHECK]');
      for (const [key, value] of Object.entries(granted)) {
        console.log(`${key}: ${value}`);
      }

      const allGranted = Object.values(granted).every(
        status => status === PermissionsAndroid.RESULTS.GRANTED,
      );

      if (allGranted) {
        console.log('✅ All permissions granted');
        return true;
      } else {
        console.warn('❌ Some permissions were denied');
        return false;
      }
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  } else {
    return true;
  }
};