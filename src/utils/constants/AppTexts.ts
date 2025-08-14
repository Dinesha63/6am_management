export const AppTexts = {

	AppName : '6 am',

    WELCOME_TITLE: 'Welcome to 6 am!',
    WELCOME_SUBTITLE: 'Where tradition meets Convenience!',
    
    WELCOME_MOBILENUMBER: 'Continue with your mobile number', 
    WELCOME_GUEST: 'Continue as Guest',
    
    SIGNING_UP: 'By Signing up you agree to',
    TERMS_AND_CONDITIONS: 'Terms and Conditions',
    
    VERIFY_NUMBER: 'Verify Number',
    VERIFY_MOBILENUMBER: 'Enter the 6 Digit code sent to ',
    VERIFY_MOBILENUMBER_NEXTLINE: 'your mobile number.',
    
    ENTER_CODE: 'Enter Code',
    RESEND_CODE_TIMER: (seconds: number) =>
        `Resend Code in 0:${seconds.toString().padStart(2, '0')} sec.`,
   
    STILL_NOT_WORKING: 'Still not working?',
    CONTACT_SUPPORT: 'Contact Support.',
    
    SEARCH: 'Find your farmer friendly dairies',
    SUBSCRIBE: 'Subscribe for Daily Delivery',
    
    HEADER_HELLO_PHONE_NUMBER: 'Hello Phone Number', 
    HEADER_HELLO_GUEST_USER: 'Hello Guest/User',
    
    LOCATION_DETAILS:	'location details',
    LOCATION_DETAILS_FOR_GUEST: 'Explore the Areas We Serve',
    
    VIEW_ALL: 'View All',
    SEE_ALL: 'See All',
    
    HELLO_CUSTOMER_NAME: 'Hello Customer Name',  
    NEXT_DELIVERY : 'Next Delivery',
    MORNING_DELIVERY_TIME : 'Morning 5.00 - 7.00',
    
    CONTACT : 'Contact',
    ADD_PRODUCTS: 'Add Products',
    DUE_FOR : 'Due for',
    
    EXPLORE_PRODUCTS: 'Explore Products',
    YOUR_BASKET: 'Your Basket',
    YOUR_BASKET_INFO : 'You can remove any individual items to cancel the delivery.',
    YOUR_BASKET_INFO_NEXTLINE :'For cancelling more than one day, visit', 
    
    HEADER_PRODUCTS: 'Products',
    PRODUCTS_FREE_HOME_DELIVERY : 'Free Home Delivery',

    PRODUCTS_SUBSCRIBE_DAYS :'Subscribe for 5 Days',
    PRODUCTS_SUBSCRIBE_DAYS_NEXTLINE : 'Get 2 Days Free',

    PRODUCTS_DESCRIPTION:'Description',
    PRODUCTS_NUTRITION :'Nutrition',
    PRODUCTS_REVIEW :'Review',
	PRODUCTS_SELECT_QUANTITY:'Select quantity',
    PRODUCTS_PURCHASE_TYPE:'Purchase Type',
	PRODUCTS_TOTAL:'Total',
		
	HEADER_ORDER_DETAILS: 'Order Details',
	ENJOY_DISCOUNT: 'Enjoy discount up to 10%',
	
	LABEL_DISCOUNT : 'Discount',
	LABEL_SUB_TOTAL:'Sub Total (6 item)',
	
	MILK_SUBSCRIPTION: (product: string) =>
    `You can also subscribe to ‘${product}’ for daily free home delivery.`,
	
	ORDER_SUCCESSFUL : 'Order successful!',
	ORDER_SUCCESSFUL_MSG:'Your order will be delivered on time.',
	THANK_YOU: 'Thank you!',
	
	HEADER_SUBSCRIBE: 'Subscribe for Morning Delivery',
	SUBSCRIPTION_PLAN: 'Set Subscription plan',
	STARTING_DATE : 'Set Starting Date ',
	SUBSCRIPTION_SCHEDULE : 'Set Delivery Schedule',
	
    SUBSCRIPTION_DELIVERY_SLOT :'Select Delivery Slot',
	SCHEDULE:'Schedule',
	SCHEDULE_DELIVERY_SLOT:'Delivery Slot',
	
	DELIVERY_OPTION :'Delivery Option',
	MORNING_DELIVERY :'Morning',
    ALTERNATE_DAYS : 'Alternate Days',
	COST_DAY : 'Cost / Day',
	QUANTITY : 'Quantity',
	
	HEADER_SUBSCRIPTION :'My Subscription',
	SUBSCRIPTION_SUCCESSFUL:'Subscription Successful!',
	SUBSCRIPTION_SUCCESSFUL_MSG:'Your order will be delivered every morning.',
	MARKVACATION :'Mark Vacation',
	REPORT_DAMAGE :'Report Damage',
	RECHARGE_WALLET :'Recharge Wallet',
	MANAGE_PRODUCTS :'Manage Products',
	REFER_EARN :'Refer & Earn',
	HEADER_CANCEL_SUBSCRIPTION :'Cancel Subscription',
	
	HEADER_MANAGE_PRODUCTS :'Manage Products',
	MANAGE_PRODUCTS_INFO :'Manage your deliveries;' ,
	MANAGE_PRODUCTS_INFO_NEXTLINE: 'Edit or Pause upcoming subscribed orders.',
	
	
	HEADER_MODIFY_QUANTITY:'Modify Quantity',
	WALLET_BALANCE :'Wallet Balance',
	WALLET_BALANCE_INFO :'You have 13 days remaining in your subscription.',
	WALLET_BALANCE_INFO_EXTEND :'You can extend your subscription by 5 more days.', 
	WALLET_BALANCE_INFO_EXTEND_NEXTLINE : 'Add funds to your wallet to continue deliveries.', 
	MODIFY_INFO :'Adjust the quantity of your subscribed ',
	MODIFY_INFO_NEXTLINE:'products or remove items as needed.',
	
	HEADER_MARK_VACATION :'Mark Vacation',
	ADD_VACATION:'Add vacation',
    NO_ADD_VACATION:'You have no vacation added',

    EVENING:'Evening 5.00 - 7.00', 
	SERVICE_RESUME_DATE: (date: string) =>
    `Your Service will resume from ${date}`,
	VACATION_DETAILS: (days: number) =>
	`${days} day${days !== 1 ? 's' : ''} on this month`,
	
	
	WE_ARE_SORRY_TO_SEE_YOU_GO : 'We are sorry to see you go!',
	CANCEL_SUBSCRIPTION_INFO : 'Before you cancel, let us know how', 
	CANCEL_SUBSCRIPTION_INFO_NEXTLINE :'we can improve your experience.',
	
	ARE_YOU_SURE_YOU_WANT_TO_LEAVE :'Are you sure you want to leave?',
	
	WE_ARE_BRINGING_YOU_MORE_FRESH_PRODUCTS :'We are bringing you more fresh products ',
	DIRECTLY_FROM_FARMERS_SERVE_YOU_BETTER:'directly from farmers to serve you better!'
	
  };