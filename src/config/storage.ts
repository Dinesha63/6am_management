import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Utility functions for handling app storage
 */

/**
 * Store verification status
 * @returns Promise that resolves when storage operation completes
 */
export const markOtpVerified = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem('isVerified', 'true');
    console.log('User marked as verified in AsyncStorage');
  } catch (error) {
    console.error('Error saving verification status:', error);
    throw error;
  }
};

/**
 * Store user phone number and verification status
 * @param phoneNumber The phone number to store
 * @returns Promise that resolves when storage operation completes
 */
export const storeUserPhoneAndVerification = async (phoneNumber: string): Promise<void> => {
  try {
    await AsyncStorage.multiSet([
      ['userPhoneNumber', phoneNumber],
      ['isVerified', 'true'],
    ]);
    console.log('User verified and data stored successfully.');
  } catch (error) {
    console.error('Error storing user data:', error);
    throw error;
  }
};

/**
 * Get stored phone number
 * @returns Promise resolving to stored phone number or null
 */
export const getStoredPhoneNumber = async (): Promise<string | null> => {
  try {
    const phone = await AsyncStorage.getItem('userPhoneNumber');
    return phone;
  } catch (err) {
    console.error('Failed to fetch phone number from storage:', err);
    return null;
  }
};

/**
 * Check if user is verified
 * @returns Promise resolving to boolean indicating verification status
 */
export const isUserVerified = async (): Promise<boolean> => {
  try {
    const isVerified = await AsyncStorage.getItem('isVerified');
    return isVerified === 'true';
  } catch (error) {
    console.error('Error checking verification status:', error);
    return false;
  }
};

/**
 * Clear all user data from storage
 * @returns Promise that resolves when storage operation completes
 */
export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(['userPhoneNumber', 'isVerified']);
    console.log('User data cleared successfully');
  } catch (error) {
    console.error('Error clearing user data:', error);
    throw error;
  }
};