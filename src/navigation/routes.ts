export enum Routes {
  // BASE
  Splash = 'Splash',

  // AUTH
  OtpVerification = 'OtpVerification',
  VerifyNumber = 'VerifyNumber',

  // MAIN
  Main = 'Main',
  List = 'List',
  SingleProduct = 'SingleProduct',
  OrderDetail = 'OrderDetail',
  Payment = 'Payment',
  // Address = 'Address', // Removed - using LocationAddressScreen instead
  Location = 'Location',
  LocationAddressScreen = 'LocationAddressScreen',
  MarkVacationScreen = 'MarkVacationScreen',
  ManageProducts = 'ManageProducts',
  ReportDamageScreen = 'ReportDamageScreen',
  TransactionScreen = 'TransactionScreen',
  ModifyProduct = 'ModifyProduct',
  CancelSubscription = 'CancelSubscription',
  CreditScreen = 'CreditScreen',
  StoreLocationScreen = 'StoreLocationScreen',
  SetSubscriptionScreen= 'SetSubscriptionScreen',
  CreditsScreenWallet = 'CreditsScreenWallet',
  DueSettlement = 'DueSettlement',
  MyAddressScreen = 'MyAddressScreen',
  AddressSuccessScreen = 'AddressSuccessScreen',
  ReportSubmitScreen = 'ReportSubmitScreen',
  SubscriptionSuccessScreen = 'SubscriptionSuccessScreen',
  GuestSubscriptionScreen = 'GuestSubscriptionScreen',

  GuestScreen = "GuestScreen",
  EmptyCartScreen = "EmptyCartScreen",
  AddCreditsToWallet = 'AddCreditsToWallet',
  ManageNotifications = 'ManageNotifications',
  AboutScreen = 'AboutScreen',
  AdminScreen = 'AdminScreen',
  LegalScreen = 'LegalScreen',
  PrivacyPolicyScreen = 'PrivacyPolicyScreen',
  TermsAndConditionsScreen = 'TermsAndConditionsScreen',
  HelpAndFAQScreen = 'HelpAndFAQScreen',

  NoTransactionsScreen ='NoTransactionsScreen'
}

export enum TabRoutes {
  Home = 'Home',
  Subscription = 'Subscription',
  Order = 'Order',
  Account = 'Account',
}
