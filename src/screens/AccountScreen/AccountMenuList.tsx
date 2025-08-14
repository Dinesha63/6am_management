import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontFamily } from '../../utils/constant';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { imagePaths } from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import { Routes } from '../../navigation/routes';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { TabRoutes } from '../../navigation/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../../redux/Features/Auth/authSlice';
import { setGuestState } from '../../redux/userSlice';
import { resetCustomerState } from '../../redux/Features/Customer/slices/customerSlice';
import { resetCustomerSubscriptionState } from '../../redux/Features/Customer/customerSubscriptionSlice';
import { resetAddressState } from '../../redux/Features/Address/addressSlice';
import { clearWalletBonus } from '../../redux/Features/6amCredits/creditsSlice';
import { clearNotification } from '../../redux/Features/FutureNotification/NotificationSlice';
import { resetNotification } from '../../redux/Features/NotificationPhoneNumber/notificationSlice';
import { resetOtpState } from '../../redux/Features/OtpGeneration/otpSlice';
import { resetCreateOrderState } from '../../redux/Features/payment/createOrderSlice';
import { resetTransactionState } from '../../redux/Features/transactionHistory/transactionSlice';
import { resetPromotionState } from '../../redux/Features/Promotion/promotionSlice';
import { resetStoreState } from '../../redux/Features/6amStore/storeSlice';
import { resetSubscriptionState } from '../../redux/Features/setSubscription/subscriptionSlice';
import { clearCouponState } from '../../redux/Features/coupon/couponSlice';
import { clearNotificationSetting } from '../../redux/Features/NotificationSetting/notificationSettingSlice';
import { clearProductCatalog, clearProductDetail } from '../../redux/Features/Product/productSlice';
import { resetCategoryState } from '../../redux/categorySlice';
import { resetSkuState } from '../../redux/skuSlice';
import { fetchCancelSubscriptionReasonAPI } from '../../redux/Features/Customer/customerSubscriptionApi';
import { fetchCancelReasons } from '../../redux/Features/Customer/customerSubscriptionThunk';
import * as Keychain from 'react-native-keychain';
// Menu items list
const menuItems = [
  // {
  //   title: 'Subscription Details',
  //   subtitle: '₹ 100.00',
  //   icon: 'credit-card',
  //   color: '#17C168',
  // },
  {
    title: 'Cancel Subscription',
    subtitle: 'Manage your subscription',
    icon: 'cancel',
    color: '#FF6B6B',
  },
  {
    title: 'My Address',
    subtitle: 'Manage delivery address',
    icon: 'location-on',
    color: '#F85E5E',
  },
  // {
  //   title: 'Add New Address',
  //   subtitle: 'Quick address setup with map',
  //   icon: 'add-location',
  //   color: '#FF9800',
  // },
  {
    title: 'Transaction History',
    subtitle: 'View your transactions',
    icon: 'receipt-long',
    color: '#5CB4F9',
  },
  // {
  //   title: 'Manage Notifications',
  //   subtitle: 'Stay Informed, Always',
  //   icon: 'notifications',
  //   color: '#F8B400',
  // },
  {
    title: 'Explore Our Stores',
    subtitle: 'Discover Freshness Near You',
    icon: 'store',
    color: '#8FCF7B',
  },
  {
    title: 'About 6 am',
    subtitle: 'Terms of use & Privacy Policy',
    icon: 'info-outline',
    color: '#6FB2F6',
  },
  {
    title: 'Help & FAQ',
    subtitle: 'English',
    icon: 'help-outline',
    color: '#9C84E0',
  },
  { title: 'Logout', icon: 'logging-out', color: '#9C84E0' },
];

const AccountMenuList = () => {
  const navigate =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  const subscriptionInfo = useSelector(
    (state: RootState) => state.customer.data
  );



  console.log('AccountMenuList subscriptionInfo ::', subscriptionInfo);



  const handleMenuItemPress = (item: any) => {
    console.log('press handleMenuItemPress');
    switch (item.title) {
      // case 'Subscription Details':
      //   navigate.navigate('CreditScreen', {unitPrice: 0});
      //   break;
      case 'Cancel Subscription':
        if (
          subscriptionInfo?.isSubscribed &&
          Array.isArray((subscriptionInfo as any)?.subscribedProducts) &&
          (subscriptionInfo as any)?.subscribedProducts?.length > 0
        ) {
          console.log('🔁 Navigating to CancelSubscription — user is subscribed with upcoming deliveries.');
          navigate.navigate(Routes.CancelSubscription);
        } else {
          console.log('👤 Navigating to GuestSubscriptionScreen — user not subscribed.');
          navigate.navigate(Routes.CancelSubscription);
        }
        break;

      case 'My address':
        navigate.navigate('MyAddressScreen', {
          existingAddresses: [],
          newAddress: undefined,
          goToAccountOnBack: true,
        });
        break;
      // case 'Add New Address':
      //   navigate.navigate('LocationAddressScreen', {
      //     addressData: undefined,
      //     formData: { goToAccountOnBack: true }
      //   });
      //   break;
      case 'Transaction History':
        navigate.navigate('TransactionScreen', undefined);
        break;
      case 'About 6 am':
        navigate.navigate('LegalScreen', undefined);
        break;
      // case 'Manage Notifications':
      //   navigate.navigate('ManageNotifications', undefined);
      //   break;
      case 'Explore our Stores':
        navigate.navigate('StoreLocationScreen', undefined);
        break;
      case 'Help & FAQ':
        console.log('Navigating to Help & FAQ');
        navigate.navigate(Routes.HelpAndFAQScreen);
        break;
      case 'Logout':
        // Handle logout logic here
        handleLogout();
        break;
      default:
        console.log('No navigation defined for:', item.title);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear all AsyncStorage items related to user data
      await AsyncStorage.multiRemove([
        'userPhoneNumber',
        'isVerified',
        'customerName',
        'authKey'
      ]);

      // Clear all Redux state

      dispatch(logout());
      dispatch(setGuestState(true));
      dispatch(resetCustomerState());
      dispatch(resetCustomerSubscriptionState());
      dispatch(resetAddressState());
      dispatch(clearWalletBonus());
      dispatch(clearNotification());
      dispatch(resetNotification());
      dispatch(resetOtpState());
      dispatch(resetCreateOrderState());
      dispatch(resetTransactionState());
      dispatch(resetPromotionState());
      dispatch(resetStoreState());
      dispatch(resetSubscriptionState());
      dispatch(clearCouponState());
      dispatch(clearNotificationSetting());
      dispatch(clearProductCatalog());
      dispatch(clearProductDetail());
      dispatch(resetCategoryState());
      dispatch(resetSkuState());
        // await Keychain.resetGenericPassword();
  
      // Navigate to login screen
      navigate.navigate(Routes.OtpVerification);
  
      console.log('✅ Logout successful - All user data cleared');
    } catch (error) {
      console.error('❌ Logout failed:', error);
    }
  };

  return (
    <>
      {menuItems.map((item, idx) => (
        <View key={idx}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuItemPress(item)}>
            <View style={styles.menuIconWrap}>
              {
                // item.title === 'Subscription Details' ? (
                //   <Image
                //     source={imagePaths.subscription_icon}
                //     style={styles.customIcon}
                //   />
                // ) : 
                item.title === 'Cancel Subscription' ? (
                  <Image
                    source={imagePaths.cancelSubscription}
                    style={styles.customIcon}
                  />
                ) : item.title === 'My address' ? (
                  <Image
                    source={imagePaths.my_address_icon}
                    style={styles.customIcon}
                  />
                  // ) : item.title === 'Add New Address' ? (
                  //   <Image
                  //     source={imagePaths.my_address_icon}
                  //     style={[styles.customIcon, {tintColor: '#FF9800'}]}
                  //   />
                ) : item.title === 'Transaction History' ? (
                  <Image
                    source={imagePaths.information_icon}
                    style={styles.customIcon}
                  />
                ) : item.title === 'Manage Notifications' ? (
                  <Image
                    source={imagePaths.Notification_icon}
                    style={styles.customIcon}
                  />
                ) : item.title === 'Explore our Stores' ? (
                  <Image
                    source={imagePaths.store_address_icon}
                    style={styles.customIcon}
                  />
                )
                  : item.title === 'About 6 am' ? (
                    <Image
                      source={imagePaths.about_icon}
                      style={styles.customIcon}
                    />
                  ) : item.title === 'Help & FAQ' ? (
                    <Image
                      source={imagePaths.help_icon}
                      style={styles.customIcon}
                    />
                  ) : item.title === 'Logout' ? (
                    <Image
                      source={imagePaths.logout_icon}
                      style={styles.customIcon}
                    />
                  ) : (
                    <></>
                  )}
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              {item.subtitle && (
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              )}
            </View>
            <Image
              source={imagePaths.Disclosure_Indicator_icon}
              style={styles.disclosureIcon}
            />
          </TouchableOpacity>
          {idx !== menuItems.length - 1}
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(0.8),
    marginTop: hp(0.2),
    marginHorizontal: wp(6),
  },
  menuIconWrap: {
    width: wp(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextWrap: {
    flex: 1,
    paddingLeft: wp(2.5),
  },
  menuTitle: {
    fontSize: sp(15),
    fontWeight: '500',
  },
  menuSubtitle: {
    fontSize: sp(12),
    color: Colors.lightGrey,
  },
  disclosureIcon: {
    width: wp(4),
    height: wp(4),
    resizeMode: 'contain',
    tintColor: Colors.lightGrey,
  },
  customIcon: {
    width: wp(5.5),
    height: wp(5.5),
    resizeMode: 'contain',
    tintColor: Colors.grey,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.8),
    marginTop: hp(2.5),
    backgroundColor: Colors.danger,
  },
});

export default AccountMenuList;
