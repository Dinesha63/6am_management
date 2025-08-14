import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStackParamList} from '../types';
import {Routes} from './routes';

// Screens
import BottomTabNavigator from './BottomTabNavigator';
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import OtpVerificationScreen from '../screens/Auth/OtpVerificationScreen';
import ListScreen from '../screens/ListScreen/Index';
import SetSubscriptionScreen from '../screens/SubscriptionScreen/SetSubscriptionScreen';
import SingleProductScreen from '../screens/singleProductScreen/Index';
import VerifyNumberScreen from '../screens/Auth/VerifyNumberScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen/Index';
import PaymentScreen from '../screens/PaymentScreen/Index';
// AddressScreen removed - using LocationAddressScreen instead
import LocationScreen from '../screens/LocationScreen/Index';
import LocationAddressScreen from '../screens/LocationAddressScreen/Index';
import MarkVacationScreen from '../screens/SubscriptionScreen/MarkVacationScreen';
import ManageProducts from '../screens/SubscriptionScreen/ManageProducts/ManageProducts';
import CancelSubscription from '../screens/SubscriptionScreen/CancelSubscription';
import ModifyProduct from '../screens/SubscriptionScreen/ManageProducts/ModifyProduct';
import CreditScreen from '../screens/Credit-Screen/Credit_Screen';
import StoreLocationScreen from '../screens/StoreLocationScreen/StoreLocation.tsx';
import GuestScreen from '../screens/GuestAccountScreen.tsx';
import EmptyCartScreen from '../screens/OrderScreen/Emptycart';
import AddCreditsToWalletScreen from '../screens/AddCreditsToWallet/AddCreditsToWallet.tsx';
import TransactionScreen from '../screens/TransactionScreen/index.tsx';
import CreditsScreenWallet from '../screens/WalletScreen/Index.tsx';
import DueSettlement from '../screens/DueSettlementScreen/DueSettlement';
import ManageNotifications from '../screens/ManageNotifcationScreen/ManageNotication.tsx';
import MyAddressScreen from '../screens/AccountAddressListScreen/Index.tsx';
import AddressSuccessScreen from '../screens/AddressScreen/AddressSuccessScreen.tsx';
import ReportDamageScreen from '../screens/ReportDamageScreen/Index.tsx';
import ReportSubmitScreen from '../screens/ReportDamageScreen/ReportSubmitScreen.tsx';
import HomeScreen from '../screens/HomeScreen/Index.tsx';
import SubscriptionSuccessScreen from '../screens/SubscriptionScreen/SubscriptionSuccessScreen.tsx';
import HelpAndFAQScreen from '../screens/HelpAndFAQ/HelpAndFAQScreen.tsx';
import LegalScreen from '../screens/LegalScreen/LegalScreen.tsx';
import TermsAndConditionsScreen from '../screens/LegalScreen/TermsAndConditionsScreen.tsx';
import PrivacyPolicyScreen from '../screens/LegalScreen/PrivacyPolicyScreen.tsx';
import AboutScreen from '../screens/LegalScreen/AboutScreen.tsx';
import GuestSubscriptionScreen from '../screens/SubscriptionScreen/GuestSubscriptionScreen.tsx';
import Admin from '../screens/Admin/Index.tsx';
import AdminHeader from '../screens/Admin/Header.tsx'
import AdminCards from '../screens/Admin/ProductsCard.tsx'

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);

  useEffect(() => {
    const checkVerification = async (): Promise<void> => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const isVerified = await AsyncStorage.getItem('isVerified');
        setIsOtpVerified(isVerified === 'true');
        console.log(
          'User verification status:',
          isVerified === 'true' ? 'Verified' : 'Not verified',
        );
      } catch (err) {
        console.error('Error reading isVerified from AsyncStorage:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkVerification();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isLoading ? (
          <Stack.Screen name={Routes.Splash} component={SplashScreen} />
        ) : isOtpVerified ? (
          <>
            <Stack.Screen name={Routes.Main} component={BottomTabNavigator} />
            <Stack.Screen name={Routes.List} component={ListScreen} />
            <Stack.Screen
              name={Routes.SingleProduct}
              component={SingleProductScreen}
            />
            <Stack.Screen
              name={Routes.OrderDetail}
              component={OrderDetailScreen}
            />
            <Stack.Screen name={Routes.Payment} component={PaymentScreen} />
            <Stack.Screen name={Routes.Location} component={LocationScreen} />
            <Stack.Screen
              name={Routes.LocationAddressScreen}
              component={LocationAddressScreen}
            />
            <Stack.Screen
              name={Routes.SetSubscriptionScreen}
              component={SetSubscriptionScreen}
            />

            <Stack.Screen
              name={Routes.MarkVacationScreen}
              component={MarkVacationScreen}
            />
            <Stack.Screen
              name={Routes.ManageProducts}
              component={ManageProducts}
            />
            <Stack.Screen
              name={Routes.CancelSubscription}
              component={CancelSubscription}
            />
            <Stack.Screen
              name={Routes.ModifyProduct}
              component={ModifyProduct}
            />
            <Stack.Screen name={Routes.CreditScreen} component={CreditScreen} />
            <Stack.Screen
              name={Routes.StoreLocationScreen}
              component={StoreLocationScreen}
            />
            <Stack.Screen
              name={Routes.EmptyCartScreen}
              component={EmptyCartScreen}
            />
            <Stack.Screen
              name={Routes.AddCreditsToWallet}
              component={AddCreditsToWalletScreen}
            />
            <Stack.Screen
              name={Routes.TransactionScreen}
              component={TransactionScreen}
            />
            <Stack.Screen
              name={Routes.CreditsScreenWallet}
              component={CreditsScreenWallet}
            />
            <Stack.Screen
              name={Routes.DueSettlement}
              component={DueSettlement}
            />
            <Stack.Screen
              name={Routes.ManageNotifications}
              component={ManageNotifications}
            />
            <Stack.Screen
              name={Routes.MyAddressScreen}
              component={MyAddressScreen}
            />
            <Stack.Screen
              name={Routes.AddressSuccessScreen}
              component={AddressSuccessScreen}
            />
            <Stack.Screen
              name={Routes.ReportDamageScreen}
              component={ReportDamageScreen}
            />
            <Stack.Screen
              name={Routes.ReportSubmitScreen}
              component={ReportSubmitScreen}
            />
            <Stack.Screen
              name={Routes.SubscriptionSuccessScreen}
              component={SubscriptionSuccessScreen}
            />
            <Stack.Screen
              name={Routes.HelpAndFAQScreen}
              component={HelpAndFAQScreen}
            />
            <Stack.Screen name={Routes.LegalScreen} component={LegalScreen} />
            <Stack.Screen
              name={Routes.PrivacyPolicyScreen}
              component={PrivacyPolicyScreen}
            />
            <Stack.Screen
              name={Routes.TermsAndConditionsScreen}
              component={TermsAndConditionsScreen}
            />
            <Stack.Screen name={Routes.AboutScreen} component={AboutScreen} />
            <Stack.Screen
              name={Routes.GuestSubscriptionScreen}
              component={GuestSubscriptionScreen}
            />
            <Stack.Screen
              name={Routes.OtpVerification}
              component={OtpVerificationScreen}
            />
            <Stack.Screen name={Routes.Admin} component={Admin} />
            <Stack.Screen name={Routes.AdminHeader} component={AdminHeader} />
            <Stack.Screen name={Routes.AdminCards} component={AdminCards} />
          </>
        ) : (
          <>
            <Stack.Screen
              name={Routes.OtpVerification}
              component={OtpVerificationScreen}
            />
            <Stack.Screen
              name={Routes.VerifyNumber}
              component={VerifyNumberScreen}
            />
            <Stack.Screen name={Routes.Main} component={BottomTabNavigator} />
            <Stack.Screen name={Routes.List} component={ListScreen} />
            <Stack.Screen name={Routes.GuestScreen} component={GuestScreen} />
            <Stack.Screen
              name={Routes.SingleProduct}
              component={SingleProductScreen}
            />
            <Stack.Screen
              name={Routes.OrderDetail}
              component={OrderDetailScreen}
            />
            <Stack.Screen name={Routes.Payment} component={PaymentScreen} />
            <Stack.Screen name={Routes.Location} component={LocationScreen} />
            <Stack.Screen
              name={Routes.LocationAddressScreen}
              component={LocationAddressScreen}
            />
            <Stack.Screen
              name={Routes.ModifyProduct}
              component={ModifyProduct}
            />
            <Stack.Screen name={Routes.CreditScreen} component={CreditScreen} />
            <Stack.Screen
              name={Routes.EmptyCartScreen}
              component={EmptyCartScreen}
            />
            <Stack.Screen
              name={Routes.AddCreditsToWallet}
              component={AddCreditsToWalletScreen}
            />
            <Stack.Screen
              name={Routes.TransactionScreen}
              component={TransactionScreen}
            />
            <Stack.Screen
              name={Routes.CreditsScreenWallet}
              component={CreditsScreenWallet}
            />
            <Stack.Screen
              name={Routes.ManageNotifications}
              component={ManageNotifications}
            />
            <Stack.Screen
              name={Routes.DueSettlement}
              component={DueSettlement}
            />
            <Stack.Screen
              name={Routes.MyAddressScreen}
              component={MyAddressScreen}
            />
            <Stack.Screen
              name={Routes.AddressSuccessScreen}
              component={AddressSuccessScreen}
            />
            <Stack.Screen
              name={Routes.SetSubscriptionScreen}
              component={SetSubscriptionScreen}
            />
            <Stack.Screen
              name={Routes.ReportSubmitScreen}
              component={ReportSubmitScreen}
            />
            <Stack.Screen
              name={Routes.StoreLocationScreen}
              component={StoreLocationScreen}
            />
            <Stack.Screen
              name={Routes.HelpAndFAQScreen}
              component={HelpAndFAQScreen}
            />
            <Stack.Screen name={Routes.LegalScreen} component={LegalScreen} />
            <Stack.Screen
              name={Routes.PrivacyPolicyScreen}
              component={PrivacyPolicyScreen}
            />
            <Stack.Screen
              name={Routes.TermsAndConditionsScreen}
              component={TermsAndConditionsScreen}
            />
            <Stack.Screen name={Routes.AboutScreen} component={AboutScreen} />
            <Stack.Screen
              name={Routes.SubscriptionSuccessScreen}
              component={SubscriptionSuccessScreen}
            />
            <Stack.Screen
              name={Routes.CancelSubscription}
              component={CancelSubscription}
            />
            <Stack.Screen name={Routes.Admin} component={Admin} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
