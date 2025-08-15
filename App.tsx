import React, {useState} from 'react';
import {Provider} from 'react-redux';
import {ApiProvider} from './src/context/ApiContext';
import {StatusBar, StyleSheet, Alert, Dimensions} from 'react-native';
import Colors from './src/utils/constants/colors';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import store from './src/redux/store';


const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.primary}
        translucent={true}
      />
      <ApiProvider>
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          
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
