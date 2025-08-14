import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Pressable, StyleSheet, View, ImageSourcePropType } from 'react-native';

import { imagePaths } from '../../utils/constants/imagePaths';

// Import Screens - Import from separate component file to avoid circular dependency
import GuestScreenComponent from './GuestScreenComponent';
import { TabRoutes } from '../../navigation/routes';
import HomeScreen from '../HomeScreen/Index';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';

type BottomTabParamList = {
  Home: undefined;
  Subscription: undefined;
  Order: undefined;
  Account: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

// 🧠 Centralized icon mapping
const tabIcons: Record<keyof BottomTabParamList, ImageSourcePropType> = {
  Home: imagePaths.Home_icon,
  Subscription: imagePaths.Subscription_icon,
  Order: imagePaths.Order_icon,
  Account: imagePaths.Group_icon,
};

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarButton: (props) => (
          <Pressable {...props} android_ripple={{ borderless: false }} />
        ),
        tabBarIcon: ({ focused }) => (
          <View style={styles.iconContainer}>
            <Image
              source={tabIcons[route.name as keyof BottomTabParamList]}
              style={[styles.icon, { tintColor: focused ? '#7CC467' : 'gray' }]}
            />
          </View>
        ),
        tabBarStyle: styles.tabBarStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarActiveTintColor: '#7CC467',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name={TabRoutes.Home}  component={HomeScreen} />
      <Tab.Screen name={TabRoutes.Subscription} component={GuestScreenComponent} />
      <Tab.Screen name={TabRoutes.Order} component={GuestScreenComponent} />
      <Tab.Screen name={TabRoutes.Account} component={GuestScreenComponent} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: wp(6),
    height: wp(6),
    resizeMode: 'contain',
    marginTop: hp(1.2),
  },
  tabBarStyle: {
    marginHorizontal: wp(1.3),
    height: hp(7),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBarLabelStyle: {
    fontSize: sp(12),
    fontWeight: '600',
    marginTop: hp(0.6),
  },
});




export default BottomTabNavigator;


