import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStackParamList} from '../types';
import {Routes} from './routes';

// Screens
// import BottomTabNavigator from './BottomTabNavigator';
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import HomeScreen from '../screens/HomeScreen/Index.tsx';
import CustomerInfo from '../screens/CustomerDetails/CustomerInfo';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkInitialization = async (): Promise<void> => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        // For now, we'll always show the login screen
        // In the future, you can add logic to check if user is already authenticated
        console.log('App initialized, showing login screen');
      } catch (err) {
        console.error('Error during app initialization:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialization();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isLoading ? (
          <Stack.Screen name={Routes.Splash} component={SplashScreen} />
        ) : (
          <>
            <Stack.Screen name={Routes.Login} component={LoginScreen} />
            <Stack.Screen name={Routes.Main} component={HomeScreen} />
            <Stack.Screen name={Routes.CustomerInfo} component={CustomerInfo} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
