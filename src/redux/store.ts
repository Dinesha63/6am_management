// redux/store.ts
import {configureStore} from '@reduxjs/toolkit';

// Import slices
import userReducer from './userSlice';
import networkReducer from './networkSlice';
import categoryReducer from './categorySlice';
import skuReducer from './skuSlice';
import AuthReducer from './Features/Auth/authSlice';
import customerReducer from './Features/Customer/slices/customerSlice';
import customerSubscriptionReducer from './Features/Customer/customerSubscriptionSlice';
import promotionReducer from './Features/Promotion/promotionSlice';
import otpReducer from './Features/OtpGeneration/otpSlice';
// import { createNetworkMiddleware } from 'react-native-offline'; // optional if needed
// const networkMiddleware = createNetworkMiddleware();
import addressReducer from './Features/Address/addressSlice';
import {walletBonusReducer} from './Features/6amCredits/creditsSlice';
import storeReducer from './Features/6amStore/storeSlice';
import {notificationReducer} from './Features/FutureNotification/NotificationSlice';
import {notificationSettingReducer} from './Features/NotificationSetting/notificationSettingSlice';
import {productReducer} from './Features/Product/productSlice';
import subscriptionReducer from './Features/setSubscription/subscriptionSlice';
import createOrderReducer from './Features/payment/createOrderSlice';
import transactionsHistoryReducer from './Features/transactionHistory/transactionSlice';
import couponReducer from './Features/coupon/couponSlice';
import eventLogReducer from './Features/EventLog/eventLogSlice';

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    products: productReducer,
    user: userReducer,
    network: networkReducer,
    category: categoryReducer,
    skus: skuReducer,
    customer: customerReducer,
    customerSubscription: customerSubscriptionReducer,
    promotion: promotionReducer,
    address: addressReducer,
    walletBonus: walletBonusReducer,
    store: storeReducer,
    notification: notificationReducer,
    notificationSetting: notificationSettingReducer,
    otp: otpReducer,
    subscription: subscriptionReducer,
    createOrder: createOrderReducer,
    transactions: transactionsHistoryReducer,
    coupon: couponReducer,
    eventLog: eventLogReducer,
    cancelReason: customerSubscriptionReducer,  
    
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(networkMiddleware), // Uncomment if needed
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
