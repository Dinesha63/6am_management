import React, {use, useEffect, useState} from 'react';
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
import { selectUser, setUserAuthenticated, setUserRole } from '../redux/userSlice.ts';
import { useAppDispatch, useAppSelector } from '../redux/hooks.ts';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { userRole, isAuthenticated } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const checkInitialization = async (): Promise<void> => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('App initialized, showing login screen');
      } catch (err) {
        console.error('Error during app initialization:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkInitialization();
  }, []);
useEffect(() => {
  const bootstrap = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    if (storedUser) {
      const { role, isAuthenticated } = JSON.parse(storedUser);

      dispatch(setUserRole(role));
      dispatch(setUserAuthenticated(isAuthenticated));
    }
    setIsLoading(false);
  };
  bootstrap();
}, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {/* {isLoading ? (
          <Stack.Screen name={Routes.Splash} component={SplashScreen} />
        ) : (
          <>
          {Role && (
            <Stack.Screen name={Routes.Main} component={HomeScreen} />
          )}
            <Stack.Screen name={Routes.Login} component={LoginScreen} />
          </>
        )} */}
        {isLoading ? (
  <Stack.Screen name={Routes.Splash} component={SplashScreen} />
) : isAuthenticated && userRole ? (
  <Stack.Screen name={Routes.Main} component={HomeScreen} />
) : (
  <Stack.Screen name={Routes.Login} component={LoginScreen} />
)}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
