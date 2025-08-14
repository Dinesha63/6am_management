import React, { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';
import { setNetworkStatus } from './networkSlice';

// Create a function to manually check network status
export const checkNetworkStatus = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    console.log('Manual network check:', state.isConnected);
    return state.isConnected ?? false;
  } catch (error) {
    console.error('Error checking network status:', error);
    return false;
  }
};

const NetworkListener: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Get initial network state
    NetInfo.fetch().then(state => {
      console.log('Initial NetInfo state:', state.isConnected);
      dispatch(setNetworkStatus(state.isConnected ?? false));
    });

    // Listen for network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log('NetInfo state changed:', state.isConnected);
      console.log('Full state:', state);
      dispatch(setNetworkStatus(state.isConnected ?? false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null; 
};

export default NetworkListener;