import { configureStore, combineReducers } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import networkReducer from "./networkSlice";
import AuthReducer from "./Features/Auth/authSlice";
import customerReducer from "./Features/Customer/slices/customerSlice";
import customerSubscriptionReducer from "./Features/Customer/customerSubscriptionSlice";
import promotionReducer from "./Features/Promotion/promotionSlice";
import otpReducer from "./Features/OtpGeneration/otpSlice";
import addressReducer from "./Features/Address/addressSlice";
import { walletBonusReducer } from "./Features/6amCredits/creditsSlice";
import storeReducer from "./Features/6amStore/storeSlice";
import { notificationReducer } from "./Features/FutureNotification/NotificationSlice";
import { notificationSettingReducer } from "./Features/NotificationSetting/notificationSettingSlice";
import { productReducer } from "./Features/Product/productSlice";
import subscriptionReducer from "./Features/setSubscription/subscriptionSlice";
import createOrderReducer from "./Features/payment/createOrderSlice";
import transactionsHistoryReducer from "./Features/transactionHistory/transactionSlice";
import couponReducer from "./Features/coupon/couponSlice";
import eventLogReducer from "./Features/EventLog/eventLogSlice";
import deliveryReducer from "./Features/Delivery/deliverySlice";
const appReducer = combineReducers({
  auth: AuthReducer,
  products: productReducer,
  user: userReducer,
  network: networkReducer,
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
  delivery: deliveryReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "auth/logout") {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
