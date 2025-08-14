import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Button,
  Alert,
  TouchableWithoutFeedback,
  ToastAndroid,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import SimpleIcon from '../../components/SimpleIcon';
import {FontFamily} from '../../utils/constant';
import {imagePaths} from '../../utils/constants/imagePaths';
import {RootStackParamList} from '../../types';
import {useRoute, RouteProp, useNavigation, CommonActions} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {fetchProductDetail} from '../../redux/Features/Product/productThunk';
import type {ProductDetailData} from '../../redux/Features/Product/product.types';
import {useDispatch, useSelector} from 'react-redux';
import {
  getSubscriptionThunk,
  postSubscriptionThunk,
} from '../../redux/Features/setSubscription/subscriptionThunk';
import { logSubscriptionEvent } from '../../utils/eventLogger';
import {AppDispatch, RootState} from '../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setGuestState } from '../../redux/userSlice';
import { Routes } from '../../navigation/routes';
import GuestUserBottomSheet from '../../components/GuestUserBottomSheet';
import ApiContext from '../../context/ApiContext';
import { sendOtp, verifyOtp } from '../../redux/Features/OtpGeneration/otpThunk';

// Types
type SetSubscriptionScreenRouteProp = RouteProp<
  RootStackParamList,
  'SetSubscriptionScreen'
>;

const SetSubscriptionScreen = () => {

  const apiContext = useContext(ApiContext);

  if (!apiContext) {
    throw new Error('VerifyNumberScreen must be used within an ApiProvider');
  }

  const {api} = apiContext;
  const dispatchOtp = useDispatch<AppDispatch>();
    const dispatch = useDispatch<AppDispatch>();
  const route = useRoute<SetSubscriptionScreenRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {product, quantity} = route.params;
  const {loading, error, subscription} = useSelector(
    (state: RootState) => state.subscription,
  );
  // console.log(product, '678iksjdf');
  // console.log(product.id, 'Athi product id');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const [date, setDate] = useState(tomorrow);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [schedule, setSchedule] = useState('Daily');
  const [isScheduleDropdownOpen, setIsScheduleDropdownOpen] = useState(false);
  const [slot, setSlot] = useState('We are committed to delivering your order every morning between 5:00 AM and 7:00 AM.');
  const [apiSlot, setApiSlot] = useState<string>('');
  const [isSlotDropdownOpen, setIsSlotDropdownOpen] = useState(false);
  const [productQuantity, setProductQuantity] = useState<number>(quantity ?? 1);
  // Remove showQuantityDropdown and dropdown logic
  // Add handlers for quantity
  const [hasShownStockToast, setHasShownStockToast] = useState(false);
  const handleDecrement = () => setProductQuantity(q => Math.max(1, q - 1));
  const handleIncrement = () => {
    if (productQuantity < 10) {
      setProductQuantity(q => q + 1);
    } else {
      if (!hasShownStockToast) {
        ToastAndroid.show(
          'Due to limited stock, only 10 units allowed',
          ToastAndroid.SHORT
        );
        setHasShownStockToast(true); 
      }
    }
  };
  React.useEffect(() => {
    if (product && typeof product.id !== 'undefined') {
      dispatch(fetchProductDetail(String(product.id)));
    }
  }, [dispatch, product]);

  const productDetail: ProductDetailData | null = useAppSelector(
    state => state.products.details.productDetail,
  );
  console.log(productDetail, 'prodddductDetail');

  // useEffect(() => {
  //   const getScheduleOptions = async () => {
  //     if (!product.id) {
  //       console.error('Product SKU code is missing');
  //       return;
  //     }
  //     dispatch(getSubscriptionThunk({productSkuCode: product.id}));
  //     if (loading) {
  //       console.log('Loading subscription data...');
  //     } else if (error) {
  //       console.error('Error fetching subscription:', error);
  //     } else if (subscription) {
  //       console.log('Subscription data fetched successfully:', subscription);
  //       // Set API slot for backend calls while keeping display message
  //       if (subscription.deliverySlot && subscription.deliverySlot.length > 0) {
  //         setApiSlot(subscription.deliverySlot[0].deliverySlotName);
  //       }
  //       //setScheduleOptions(subscription.deliverySchedule);
  //     }
  //   };
  //   getScheduleOptions();
  // }, [subscription]);
  useEffect(() => {
    const getScheduleOptions = async () => {
      if (!product.id) {
        console.error('Product SKU code is missing');
        return;
      }
  
      // Dispatch only if subscription is not already fetched
      if (!subscription && !loading && !error) {
        console.log('Dispatching subscription fetch...');
        dispatch(getSubscriptionThunk({ productSkuCode: product.id }));
      }
    };
  
    getScheduleOptions();
  }, [product.id]);
  
  useEffect(() => {
    if (loading) {
      console.log('Loading subscription data...');
    } else if (error) {
      console.error('Error fetching subscription:', error);
    } else if (subscription) {
      console.log('Subscription data fetched successfully:', subscription);
      if (subscription.deliverySlot && subscription.deliverySlot.length > 0) {
        setApiSlot(subscription.deliverySlot[0].deliverySlotName);
      }
    }
  }, [loading, error, subscription]);
  

  const pricePerUnit = product.today_price ?? subscription?.price ?? 0;
  const unitPrice = pricePerUnit * productQuantity;
  const totalPrice = unitPrice;
 
 
  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const getStartDate = (selectedDate: string | number | Date) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate());
    return newDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const toggleScheduleDropdown = () => {
    setIsScheduleDropdownOpen(!isScheduleDropdownOpen);
    setIsSlotDropdownOpen(false);
  };

  const toggleSlotDropdown = () => {
    setIsSlotDropdownOpen(!isSlotDropdownOpen);
    setIsScheduleDropdownOpen(false);
  };

  const selectSchedule = (option: string) => {
    console.log('Selected schedule:', option);
    setSchedule(option);
    // Let UI update before dropdown closes
    requestAnimationFrame(() => {
      setIsScheduleDropdownOpen(false);
    });
  };

  const selectSlot = (option: string) => {
    console.log('Selected slot:', option);
    setApiSlot(option);
    // Let UI update before dropdown closes
    requestAnimationFrame(() => {
      setIsSlotDropdownOpen(false);
    });
  };
  const getTotalDays = (schedule: string): number => {
    switch (schedule) {
      case 'Daily':
        return 30;
      case 'Alternate':
        return 15;
      case 'Weekly':
        return 4;
      case 'Monthly':
        return 1;
      default:
        return 0;
    }
  };
  const isGuest = useSelector((state: RootState) => state.user.isGuest);
  const [showGuestBottomSheet, setShowGuestBottomSheet] = useState(false);
  const [guestPhoneNumber, setGuestPhoneNumber] = useState<string>('');

  const handleSubscribe = async () => {
    if(isGuest) {
      setShowGuestBottomSheet(true);
      return;
    }
// navigation.navigate('AddCreditsToWallet', {
//   amount: 10,
//   bonusPercent:4,
//   bonusAmount:29,
//   totalDue: 0,
// });
    const phone = await AsyncStorage.getItem('userPhoneNumber');

    if (!subscription) {
      // Alert.alert('Subscription data not available');
      // return;
    }

    const selectedSchedule = subscription?.deliverySchedule.find(
      item => item.deliveryScheduleName === schedule,
    );

    const selectedSlot = subscription?.deliverySlot.find(
      item => item.deliverySlotName === apiSlot,
    );

    if (!selectedSchedule || !selectedSlot) {
      ToastAndroid.show('Invalid schedule or slot selection', ToastAndroid.SHORT);
      return;
    }
   
    const payload = {
      customerPhoneNumber: phone,
      deliveryScheduleId: selectedSchedule.deliveryScheduleId,
      deliverySlotId: selectedSlot.deliverySlotId,
      startDate: date.toISOString(),
      productSkuCode: String(product.id),
      quantity: productQuantity,
      pricePerUnit
    };
      // Log the subscription event
      try {
        console.log("Log the subscription event....")
        await logSubscriptionEvent(dispatch, {
          productName: product.name,
          schedule: schedule,
          quantity: productQuantity,
          pricePerUnit: pricePerUnit,
          totalPrice: unitPrice * getTotalDays(schedule)
        });
      } catch (error) {
        console.log('EventLog failed:', error);
      }

      navigation.navigate(Routes.Payment, { totalAmount: unitPrice * getTotalDays(schedule), paymentData: payload });  
      console.log('payload', payload);

    // console.log(payload, 'payload for subscription');
    // // return
    // try {
    //   const result = await dispatch(postSubscriptionThunk(payload));
    //   if (postSubscriptionThunk.fulfilled.match(result)) {
    //     navigation.navigate('CreditScreen', {unitPrice});
    //   } else {
    //     Alert.alert(
    //       'Failed to subscribe',
    //       result.payload ?? 'Something went wrong',
    //     );
    //   }
    // } catch (Subscribe_error) {
    //   Alert.alert('Error', 'Something went wrong while subscribing');
    //   console.error('Subscribe error:', Subscribe_error);
    // }
  };

  const handleGuestSave = async (phoneNumber: string) => {
    try {
      console.log('Guest phone number saved:', phoneNumber);
      const result = await dispatchOtp(
        sendOtp({phone: phoneNumber, isResending: false}),
      ).unwrap();
      setGuestPhoneNumber(phoneNumber);
      console.log('OTP sent successfully:', result);
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error; // Re-throw to let the bottom sheet handle the error
    }
  };

  const handleGuestVerifyOtp = async (autoOtp?: string | React.SyntheticEvent) => {
    console.log('handleGuestVerifyOtp called with:', autoOtp);
  
    // Ensure we have a string OTP
    let finalOtp: string;
    if (typeof autoOtp === 'string') {
      finalOtp = autoOtp;
    } else {
      // If not a string, we can't proceed
      console.error('Invalid OTP format received');
      return;
    }
  
    console.log('finalOtp to verify:', finalOtp);
  
    try {
   
      const resultOtp = await dispatchOtp(
        verifyOtp({ phone: guestPhoneNumber, otp: finalOtp })
      ).unwrap();
  
      console.log('verifyOtp result (guest):', resultOtp);
  
      // On success: mark verified on backend (if applicable)
      try {
        await api.markOtpVerified();
      } catch (markErr) {
        // Non-fatal: log but continue (or handle as you prefer)
        console.warn('Warning: markOtpVerified failed', markErr);
      }
  
      // Persist user's phone number as a logged-in user
      await AsyncStorage.setItem('userPhoneNumber', guestPhoneNumber);
  
      // Update UI and global state
      setShowGuestBottomSheet(false);
  
      // If you use a guest flag in redux, clear it
      dispatch(setGuestState(false));
      ToastAndroid.show('User Login successful', ToastAndroid.SHORT);
      // Navigate to Home tab after successful verification
      // navigation.dispatch(
      //   CommonActions.reset({
      //     index: 0,
      //     routes: [
      //       { 
      //         name: 'Main',
      //         params: { screen: 'Home' }
      //       }
      //     ],
      //   })
      // );
      
  
      console.log('Guest verification success and navigation done');
  
    } catch (error) {
      console.error('Error verifying guest OTP:', error);
  
      // Friendly UI error message
      ToastAndroid.show('Error, You have entered wrong OTP',ToastAndroid.SHORT);
  
      // Optionally let caller/parent handle it:
      // throw error;
    }
  };
  

  const handleGuestResendOtp = async (phoneNumber: string) => {
    try {
      console.log('Resending OTP for guest:', phoneNumber);
      const result = await dispatchOtp(
        sendOtp({phone: phoneNumber, isResending: true}),
      ).unwrap();
      console.log('OTP resent successfully:', result);
    } catch (error) {
      console.error('Error resending OTP:', error);
      throw error; // Re-throw to let the bottom sheet handle the error
    }
  };

  const handleGuestClose = () => {
    setShowGuestBottomSheet(false);
  };

  return (
    // <SafeAreaView style={{ flex: 1 }}>
    <View style={{flex: 1}}>
        <View style={styles.header}>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>

            <SimpleIcon source={imagePaths.back_icon}  style={{width: wp(6),paddingTop:45, height: wp(6), resizeMode: 'contain'}} />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.cartWrapper}>
            <SimpleIconjj
              source={imagePaths.Shopping_Cart_icon}
              style={[styles.cartIcon, {tintColor: 'green'}]}
            />
          </TouchableOpacity> */}
        </View>
      </View>
      <ScrollView style={styles.container}>
        {/* ←— product images carousel —→ */}
        {productDetail &&
          Array.isArray(productDetail.images) &&
          productDetail.images.length > 0 && (
            <View style={{marginVertical: hp(0.4)}}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled>
                {productDetail.images?.map((img, idx) => (
                  <Image
                    key={idx}
                    source={{uri: img.imageUrl}}
                    style={{
                      width: wp(100),
                      height: hp(32),
                      resizeMode: 'cover',
                      borderRadius: wp(2),
                      marginRight: wp(2),
                    }}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        {/* ←— your existing banner & form starts here —→ */}

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Set Subscription Plan</Text>
            <TouchableOpacity>
              {/* <Image source={imagePaths.close_icon} style={styles.icon} /> */}
            </TouchableOpacity>
          </View>

          <View style={styles.inputRow}>
            {/* Starting Date */}
            <View style={styles.inputItem}>
              <Text style={styles.label}>Set Start Date</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.dateBox}>
                <Text style={styles.dateText}>
                  {date.toLocaleDateString('en-GB')}
                </Text>
                <Image
                  source={imagePaths.calender_icon}
                  style={styles.icon}
                />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                  minimumDate={tomorrow}
                  maximumDate={new Date(new Date().setDate(new Date().getDate() + 60))} 
                />
              )}
            </View>

            {/* Schedule Dropdown */}
            <View style={styles.inputItem}>
              <Text style={styles.label}>Set Delivery Schedule</Text>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={toggleScheduleDropdown}>
                  <Text style={styles.dropdownButtonText}>{schedule}</Text>
                  {/* <Text style={styles.dropdownArrow}>▼</Text> */}
                  <Image
                  source={imagePaths.drop_down_arrow_icon}
                  style={styles.arrow_icon}
                />
                </TouchableOpacity>
                {isScheduleDropdownOpen && (
                  <View style={styles.dropdownMenu}>
                    {subscription && subscription.deliverySchedule
                      ? subscription.deliverySchedule.map(item => (
                          <TouchableOpacity
                            key={item.deliveryScheduleId}
                            style={styles.dropdownItem}
                            onPress={() =>
                              selectSchedule(item.deliveryScheduleName)
                            }>
                            <Text style={styles.dropdownItemText}>
                              {item.deliveryScheduleName}
                            </Text>
                            {schedule === item.deliveryScheduleName && (
                              <Text style={styles.checkmark}>⦿</Text>
                            )}
                          </TouchableOpacity>
                        ))
                      : null}
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Delivery Slot Dropdown */}
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>Delivery Time</Text>
            <View style={styles.dropdownContainer}>
              {/* Temp removed dropdown */}
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: Colors.white,
                  opacity: 0.6,
                  // paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 6,
                  // borderWidth: 1,
                  // borderColor: '#ccc',
                }}
                onPress={() => {}}
                disabled={true}>
                <Text
                  style={{
                    fontSize: 15,
                    // color: '#000',
                    flex: 1,
                    color: Colors.textBlack,
                  }}>
                  {slot}
                </Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={[
                  styles.dropdownButton,
                  {backgroundColor: Colors.greyBackground, opacity: 0.6},
                ]}
                onPress={() => {}}
                disabled={true}>
                <Text style={styles.dropdownButtonText}>{slot}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity> */}
              {/* Remove or comment out the dropdownMenu rendering */}
              {/* {isSlotDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {subscription && subscription.deliverySlot
                    ? subscription.deliverySlot.map(item => (
                        <TouchableOpacity
                          key={item.deliverySlotId}
                          style={styles.dropdownItem}
                          onPress={() => selectSlot(item.deliverySlotName)}>
                          <Text style={styles.dropdownItemText}>
                            {item.deliverySlotName}
                          </Text>
                          {slot === item.deliverySlotName && (
                            <Text style={styles.checkmark}>⦿</Text>
                          )}
                        </TouchableOpacity>
                      ))
                    : null}
                </View>
              )} */}
            </View>
          </View>

          {/* Summary */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.summaryBox}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryTitle}>
                  {subscription?.productSkuName}
                </Text>
                <Text style={styles.summaryPrice}>
                  ₹ {pricePerUnit?.toFixed(2) }
                </Text>
              </View>
              <View
                style={[
                  styles.summaryLine,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  },
                ]}>
                <Text>Quantity:</Text>
                <View style={styles.qtySelectorRowSub}>
                  <TouchableOpacity
                    style={[
                      styles.qtyBtnSub,
                      productQuantity <= 1 && styles.qtyBtnSubDisabled,
                    ]}
                    onPress={handleDecrement}
                    disabled={productQuantity <= 1}>
                    <Text
                      style={[
                        styles.qtyBtnSubText,
                        productQuantity <= 1 && styles.qtyBtnSubTextDisabled,
                      ]}>
                      -
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyTextSub}>{productQuantity}</Text>
                  <TouchableOpacity
                    style={[
                      styles.qtyBtnSub,
                      productQuantity >= 10 && styles.qtyBtnSubDisabled,
                    ]}
                    onPress={handleIncrement}
                    // disabled={productQuantity >= 10}
                  >
                    <Text
                      style={[
                        styles.qtyBtnSubText,
                        productQuantity >= 10 && styles.qtyBtnSubTextDisabled,
                      ]}>
                      +
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.summaryRow}>
                {/* <Text style={styles.summaryLine}>{slot.split(' ')[0]}</Text> */}
                <Text style={styles.summaryLine}>Delivery Starts :</Text>
                <Text style={styles.summaryLine}>
                  From {getStartDate(date)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLine}>Delivery Schedule:</Text>
                <Text style={styles.summaryLine}>{schedule}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLine}>Cost Per Day</Text>
                <Text style={styles.summaryPrice}>
                  ₹ {unitPrice?.toFixed(2) }
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>

          <View style={styles.setContainer}>
            <Text style={styles.setText}>
              Based on your selection of ₹{unitPrice?.toFixed(2)} per day with
              deliveries on every morning, your total cost for{' '}
              {getTotalDays(schedule)} days is ₹{(unitPrice * getTotalDays(schedule)).toFixed(2)}.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View style={styles.fixedButtons}>
        {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.subscribeButton} onPress={() => handleSubscribe()}>
          <Text style={styles.subscribeButtonText}>Confirm Subscription</Text>  
        </TouchableOpacity>
      </View>
      {/* </SafeAreaView> */}
      
       <GuestUserBottomSheet
         isVisible={showGuestBottomSheet}
         onClose={handleGuestClose}
         onSave={handleGuestSave} 
         onVerifyOtp={handleGuestVerifyOtp}
         onResendOtp={handleGuestResendOtp}
       />
    </View>
  );
};

export default SetSubscriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: hp(12), // Add padding to prevent content from being hidden behind fixed buttons
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    marginTop: hp(2),
    width: '100%',
  },
  icon: {
    width: wp(6),
    height: wp(6),
    resizeMode: 'contain',
    tintColor: Colors.grey,
  },
  arrow_icon: {
    width: wp(8),
    height: wp(8),
    resizeMode: 'contain',
    tintColor: Colors.grey,
  },
  cartWrapper: {
    backgroundColor: Colors.greyBackground,
    borderRadius: 50,
    width: wp(10),
    height: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: Colors.primary,
    resizeMode: 'contain',
  },
  header: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(2),
    backgroundColor: 'transparent',
    // zIndex: 10,
  },
  panel: {
    backgroundColor: Colors.white,
    margin: 0,
    borderRadius: 0,
    padding: wp(3),
    paddingBottom: hp(5),
    elevation: 3,
    flex: 1,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lineLight,
    paddingBottom: hp(1.5),
  },
  panelTitle: {
    fontSize: sp(18),
    fontWeight: '600',
    color: Colors.blackText,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(3),
  },
  inputItem: {
    flex: 1,
    position: 'relative',
  },
  label: {
    fontSize: sp(13.5),
    color: Colors.darkinfo,
    marginBottom: hp(0.5),
    marginLeft: wp(1),
  },
   backIcon: {
    width: wp(6),
    height: wp(6),
    tintColor: Colors.black,
    paddingTop: hp(20),
  },
  dateBox: {
    borderWidth: 1.5,
    borderColor: Colors.darkinfo,
    borderRadius: wp(1.5),
    padding: wp(3.4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: sp(14),
    color: Colors.darkinfo,
  },
  formSection: {
    marginTop: hp(1),
    position: 'relative',
  },
  sectionLabel: {
    fontSize: sp(16),
    color: Colors.blackText,
    fontWeight: 'bold',
    marginBottom: hp(0.5),
    marginLeft: wp(1),
    marginTop: hp(1),
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: wp(1.5),
    borderWidth: 1.5,
    borderColor: Colors.darkinfo,
    padding: wp(3),
    height: hp(6.5),
  },
  dropdownButtonText: {
    fontSize: sp(14),
    color: Colors.darkinfo,
  },
  dropdownArrow: {
    fontSize: sp(12),
    color: Colors.grey,
  },
  dropdownMenu: {
    position: 'absolute',
    top: hp(6.7),
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: wp(1.5),
    borderWidth: 1,
    borderColor: Colors.darkinfo,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(3),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: sp(14),
    color: '#333333',
  },
  checkmark: {
    fontSize: sp(16),
    color: Colors.darkinfo,
    fontWeight: 'bold',
  },
  summaryBox: {
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    padding: wp(3),
    marginTop: hp(1.5),
    borderColor: Colors.lineLight,
    borderWidth: 1,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(0.8),
  },
  summaryTitle: {
    fontSize: sp(16),
    fontWeight: '600',
    color: Colors.blackText,
  },
  summaryLine: {
    fontSize: sp(14),
    color: Colors.grey,
    marginBottom: hp(0.5),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(0.5),
  },
  summaryPrice: {
    fontSize: sp(15),
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(3),
    marginTop: hp(2),
  },
  backButton: {
    flex: 1,
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(2),
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
  },
  backButtonText: {
    fontSize: sp(16),
    fontWeight: '600',
    color: Colors.blackText,
  },
  subscribeButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: wp(2),
    height: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
  },
  subscribeButtonText: {
    fontSize: sp(16),
    fontWeight: '600',
    color: Colors.white,
  },
  banner: {
    height: hp(24),
    width: wp(84),
    alignSelf: 'center',
    backgroundColor: Colors.lineLight,
    borderRadius: wp(3),
    marginVertical: hp(2.5),
    justifyContent: 'center',
  },
  bannerText: {
    fontSize: sp(24),
    color: Colors.grey,
    alignSelf: 'center',
  },
  bannerSubText: {
    fontSize: sp(14),
    color: Colors.grey,
    alignSelf: 'center',
  },
  setContainer: {
    backgroundColor: Colors.DueYellow,
    borderRadius: wp(1.5),
    padding: wp(3),
    marginVertical: hp(1.5),
    marginBottom: hp(6),
  },
  setText: {
    fontSize: sp(12),
    // fontWeight: 'bold',
    color: Colors.blackText,
    lineHeight: hp(2),
  },
  quantityValue: {
    // textDecorationLine: 'underline',
    // color: 'blue',
    marginLeft: 4,
  },
  quantityDropdownContainer: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    top: 30,
    left: 100,
    zIndex: 10,
    elevation: 5,
    width: 50,
    height: 3 * 42,
    overflow: 'hidden',
  },
  quantityDropdownItem: {
    padding: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  quantityDropdownItemText: {
    fontSize: 16,
    textAlign: 'center',
  },
  qtySelectorRowSub: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    backgroundColor: '#F6FFFA',
    paddingHorizontal: 5,
    paddingVertical: 2,
    minWidth: 80,
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  qtyBtnSub: {
    width: 28,
    height: 28,
    // borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: Colors.primary,
    // backgroundColor: '#F6FFFA',
  },
  qtyBtnSubDisabled: {
    // borderColor: Colors.grey,
    // backgroundColor: Colors.backgroundGrey,
  },
  qtyBtnSubText: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  qtyBtnSubTextDisabled: {
    color: Colors.grey,
  },
  qtyTextSub: {
    fontSize: 16,
    // fontWeight: 'bold',
    color: Colors.primary,
    marginHorizontal: 1,
    minWidth: 18,
    textAlign: 'center',
  },
  fixedButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: wp(4),
    paddingTop: hp(1.5),
    paddingBottom: hp(1),
    borderTopWidth: 1,
    borderTopColor: Colors.lineLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(3),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});
