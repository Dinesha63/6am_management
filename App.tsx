import React, {useState} from 'react';
import {Provider} from 'react-redux';
import {ApiProvider} from './src/context/ApiContext';
import RootNavigator from './src/navigation/RootNavigator';
import store from './src/redux/store';
import {StatusBar, StyleSheet, Alert, Dimensions} from 'react-native';
import Colors from './src/utils/constants/colors';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import InternetLostScreen from './src/screens/InternetLostScreen/InternetLostScreen';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from './src/redux/store';
import NetworkListener, {checkNetworkStatus} from './src/redux/NetworkListener';
import {setNetworkStatus} from './src/redux/networkSlice';
import TTSScreen from './src/screens/TextToVoice/Index';

const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const [isManuallyHidden, setIsManuallyHidden] = useState(false);
  const {width, height} = Dimensions.get('window');
  // console.log('Device Width:', width);
  // console.log('Device Height:', height);
  // Access the network state from Redux
  const isConnected = useSelector(
    (state: RootState) => state.network.isConnected,
  );
  console.log('Network status:', isConnected); // Debug network status

  // Handle cancel button - hide the popup manually
  const handleCancel = () => {
    setIsManuallyHidden(true);
    console.log('User cancelled network popup');
  };

  // Handle try again button - manually check network status
  const handleTryAgain = async () => {
    console.log('User clicked Try Again');
    try {
      const currentStatus = await checkNetworkStatus();
      dispatch(setNetworkStatus(currentStatus));

      if (currentStatus) {
        setIsManuallyHidden(false); // Reset manual hide state
        Alert.alert('Success', 'Internet connection restored!');
      } else {
        Alert.alert(
          'No Connection',
          'Still no internet connection. Please check your network settings.',
        );
      }
    } catch (error) {
      console.error('Error checking network:', error);
      Alert.alert('Error', 'Unable to check network status. Please try again.');
    }
  };

  // Reset manual hide when connection is restored
  React.useEffect(() => {
    if (isConnected) {
      setIsManuallyHidden(false);
    }
  }, [isConnected]);

  // Show popup only if not connected AND not manually hidden
  const shouldShowPopup = !isConnected && !isManuallyHidden;

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.primary}
        translucent={true}
      />
      <ApiProvider>
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          {/* Add NetworkListener here to start listening for network changes */}
          <NetworkListener />
          {/* <TTSScreen /> */}
          {/* Pass the visible prop and button handlers to InternetLostScreen */}
          <InternetLostScreen
            visible={shouldShowPopup}
            onCancel={handleCancel}
            onTryAgain={handleTryAgain}
          />
          <RootNavigator />
        </SafeAreaView>
      </ApiProvider>
    </SafeAreaProvider>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.white,
    // paddingVertical: 8,
  },
});

export default App;
