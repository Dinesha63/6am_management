import React, { useEffect, useState } from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  ImageSourcePropType,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {FontFamily} from '../utils/constant';
import {imagePaths} from '../utils/constants/imagePaths.ts';

// Import Screens
import SubscriptionScreen from '../screens/SubscriptionScreen';
import AccountScreen from '../screens/AccountScreen';
import HomeScreen from '../screens/HomeScreen/Index';
import OrderDetailScreen from '../screens/OrderDetailScreen/Index';
import OrderScreen from '../screens/OrderScreen/Index';
import {TabRoutes} from './routes';
import GuestSubscriptionScreen from '../screens/SubscriptionScreen/GuestSubscriptionScreen';
import NewOrderScreen from '../screens/OrderScreen/NewOrderScreen';
import EmptyCartScreen from '../screens/OrderScreen/Emptycart';
import GuestProfile from '../screens/GuestAccountScreen.tsx/GuestProfile';
import GuestScreen from '../screens/GuestAccountScreen.tsx';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import NoTransactionScreen from '../screens/TransactionScreen/NoTransactions.tsx';
import TransactionScreen from '../screens/TransactionScreen/index.tsx';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../utils/constants/responsiveScreen';


export type BottomTabParamList = {
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
  const isGuest = useSelector((state: RootState) => state.user.isGuest);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => (
          <View style={styles.iconContainer}>
            <Image
              source={tabIcons[route.name as keyof BottomTabParamList]}
              style={[styles.icon, {tintColor: focused ? '#7CC467' : 'gray'}]}
            />
          </View>
        ),
        tabBarButton: (props) => (
          <TouchableOpacity
            onPress={props.onPress}
            style={styles.tabBarButton}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ selected: props.accessibilityState?.selected }}
          >
            {props.children}
          </TouchableOpacity>
        ),
        tabBarStyle: [
          styles.tabBarStyle,
          isKeyboardVisible ? { display: 'none' } : null,
        ],
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarActiveTintColor: '#7CC467',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
          tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',
      })}>
      {isGuest ? (
        <>
          <Tab.Screen name={TabRoutes.Home} component={HomeScreen} />
          {/* <Tab.Screen
            name={TabRoutes.Subscription}
            component={GuestSubscriptionScreen}
          /> */}
          {/* <Tab.Screen name={TabRoutes.Order} component={NewOrderScreen} /> */}
          <Tab.Screen name={TabRoutes.Account} component={GuestScreen} />
        </>
      ) : (
        <>
          <Tab.Screen name={TabRoutes.Home} component={HomeScreen} />
          {/* <Tab.Screen
            name={TabRoutes.Subscription}
            component={SubscriptionScreen}
          />
          <Tab.Screen name={TabRoutes.Order} component={OrderScreen} /> */}
          <Tab.Screen name={TabRoutes.Account} component={AccountScreen} />
        </>
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: hp(0.8),
    paddingBottom: hp(0.4),
  },
  icon: {
    width: wp(5.5),        
    height: wp(5.5),        
    resizeMode: 'contain',
  },
  tabBarStyle: {
    height: hp(8.5),       
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarLabelStyle: {
    fontSize: sp(11),
    fontWeight: '600',
    fontFamily: FontFamily.REGULAR,
    marginTop: hp(0.3),   
    textAlign: 'center',
  },
  tabBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(1),
    minHeight: hp(6),
  },
});

export default BottomTabNavigator;
