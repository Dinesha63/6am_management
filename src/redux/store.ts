import { configureStore, combineReducers } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import networkReducer from "./networkSlice";
import AuthReducer from "./Features/Auth/authSlice";
import customerReducer from "./Features/Customer/slices/customerSlice";
import customerSubscriptionReducer from "./Features/Customer/customerSubscriptionSlice";
import otpReducer from "./Features/OtpGeneration/otpSlice";
import addressReducer from "./Features/Address/addressSlice";
import storeReducer from "./Features/6amStore/storeSlice";
import { productReducer } from "./Features/Product/productSlice";
import createOrderReducer from "./Features/payment/createOrderSlice";
import transactionsHistoryReducer from "./Features/transactionHistory/transactionSlice";
import eventLogReducer from "./Features/EventLog/eventLogSlice";
import deliveryReducer from "./Features/Delivery/deliverySlice";
const appReducer = combineReducers({
  auth: AuthReducer,
  products: productReducer,
  user: userReducer,
  network: networkReducer,
  customer: customerReducer,
  customerSubscription: customerSubscriptionReducer,
  address: addressReducer,
  store: storeReducer,
  otp: otpReducer,
  createOrder: createOrderReducer,
  transactions: transactionsHistoryReducer,
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
