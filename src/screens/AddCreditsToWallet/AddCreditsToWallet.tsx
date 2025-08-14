import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  NavigationProp,
} from '@react-navigation/native';
import {FontFamily} from '../../utils/constant';
import SimpleIcon from '../../components/SimpleIcon';
import Colors from '../../utils/constants/colors';
import {imagePaths} from '../../utils/constants/imagePaths';
import Header from './Header';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import ApiContext from '../../context/ApiContext';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../../redux/store';
import {createOrder} from '../../redux/Features/payment/createOrderThunk';
import {isFulfilled} from '@reduxjs/toolkit';
import { logPaymentEvent, logCustomEvent, logErrorEvent } from '../../utils/eventLogger';
import AddressButton from '../PaymentScreen/AddressButton';
import {fetchCustomerAddress} from '../../redux/Features/Address/addressThunk';
import DeliveryAddress from '../PaymentScreen/DeliveryAddress';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {CustomerAddress} from '../../redux/Features/Address/address.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStackParamList} from '../../types';
import {Routes} from '../../navigation/routes';
import SuccessModal from '../LocationAddressScreen/SuccessModal';

const {PluralPayment} = NativeModules;

interface RouteParams {
  amount: number;
  bonusPercent: number;
  couponCode: string | null;
  flowType: string | null;
}

const AddCreditsToWallet = ({}) => {
  const apiContext = useContext(ApiContext);
  const paymentEmitter = new NativeEventEmitter(NativeModules.PluralPayment);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();
  const {amount, bonusPercent, couponCode, flowType} =
    route.params as RouteParams;
  console.log(flowType, 'flowType in AddCreditsToWallet');
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [userAddressData, setUserAddressData] =
    useState<CustomerAddress | null>(null);
  const [addressSelected, setAddressSelected] = useState(false);
  const [showAddressBottomSheet, setShowAddressBottomSheet] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<
    'CARD' | 'UPI' | 'NETBANKING' | null
  >('UPI');
  const AddCreditsToWallet: boolean = true;
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const {customerAddresses} = useSelector((state: RootState) => state.address);

  const navigate =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const bonusAmount = (amount * bonusPercent) / 100;
  const totalAmount = amount + bonusAmount;

  console.log('useNavigation bonusAmount ::', bonusAmount);
  console.log('useNavigation totalAmount ::', totalAmount);

  useEffect(() => {
    return () => {
      paymentEmitter.removeAllListeners('onPaymentSuccess');
      paymentEmitter.removeAllListeners('onPaymentError');
      paymentEmitter.removeAllListeners('onPaymentCancelled');
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const number = await AsyncStorage.getItem('userPhoneNumber');
        if (number) {
          setPhoneNumber(number);
          const customer_data = await dispatch(fetchCustomerAddress(number));

          if (isFulfilled(customer_data)) {
            const addresses = customer_data.payload; // Get it from action payload
            if (addresses?.length > 0) {
              if (addresses.length === 1) {
                setAddressSelected(true);
                setUserAddressData(addresses[0]);
              } else {
                const defaultAddress = addresses.find(a => a.isDefault);
                if (defaultAddress) {
                  setAddressSelected(true);
                  setUserAddressData(defaultAddress);
                }
              }
            }
          } else {
            console.error('❌ Failed to fetch customer address');
          }
        }
      } catch (error) {
        console.error('❌ Error in fetching phone number or address:', error);
      }
    };

    fetchData();
  }, [dispatch]);
  const handleSuccessModalDone = async () => {
    try {
      // Log successful completion of wallet credit flow
      await logCustomEvent(dispatch, `User completed wallet credit flow successfully:
        ₹${amount} added to wallet with ${bonusPercent}% bonus`);
      navigation.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
    } catch (error) {
      console.log('Event logging failed in handleSuccessModalDone:', error);
      // Don't block the navigation if logging fails
      navigation.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
    }
  };
  const startPayment = async (couponCode: string | null) => {
    console.log('startPayment couponCode ::', couponCode);
    const number = await AsyncStorage.getItem('userPhoneNumber');
    
    try {
      // Log payment initiation event
      await logCustomEvent(dispatch, `Payment initiation started for wallet credit: ₹${amount} with ${selectedMethod} payment method`);
      
      if (couponCode) {
        await logCustomEvent(dispatch, `Coupon code applied for payment: ${couponCode}`);
      }
      
      const result = await dispatch(
        createOrder({
          phoneNumber: number,
          amount: amount,
          paymentMethod: selectedMethod,
          couponCode: couponCode || '',
        }),
      );
      
      if (isFulfilled(result) && result.payload?.data) {
        // Log successful order creation
        await logCustomEvent(dispatch, `Order created successfully for wallet credit: ₹${amount} with ${selectedMethod} payment method`);
        
        paymentEmitter.removeAllListeners('onPaymentSuccess');
        paymentEmitter.removeAllListeners('onPaymentError');
        paymentEmitter.removeAllListeners('onPaymentCancelled');

        const paymentSuccess = paymentEmitter.addListener(
          'onPaymentSuccess',
          async (event: {status: string}) => {
            console.log('Payment result received:', event);

            if (event.status === 'success') {
              console.log('Payment success received:', event);
              
              // Log successful payment
              await logPaymentEvent(dispatch, {
                orderId: result.payload.data.token || `WALLET_${Date.now()}`,
                amount: amount,
                method: selectedMethod || 'Unknown',
                status: 'success'
              });
              
              // Log wallet credit addition success
              await logCustomEvent(dispatch, `Wallet credit addition successful: ₹${amount} + ₹${bonusAmount} bonus = ₹${totalAmount} total`);
              
              // navigate to success screen or update wallet
              if (flowType === 'Main') {
                setIsSuccessModalVisible(true);
              } else {
                navigation.navigate('SubscriptionSuccessScreen');
              }
            } else {
              // Log payment failure
              await logPaymentEvent(dispatch, {
                orderId: result.payload.data.token || `WALLET_${Date.now()}`,
                amount: amount,
                method: selectedMethod || 'Unknown',
                status: 'failed'
              });
              console.error('Payment not successful');
            }

            // Clean up after handling
            paymentSuccess.remove();
          },
        );

        const paymentFailure = paymentEmitter.addListener(
          'onPaymentError',
          async (event: {status: string}) => {
            console.log('Payment result received:', event);
            
            // Log payment error
            await logPaymentEvent(dispatch, {
              orderId: result.payload.data.token || `WALLET_${Date.now()}`,
              amount: amount,
              method: selectedMethod || 'Unknown',
              status: 'failed'
            });
            
            // Log error event
            await logErrorEvent(dispatch, {
              error: `Payment failed for wallet credit: ₹${amount}`,
              context: 'Payment processing',
              userId: number || 'unknown'
            });

            // Clean up after handling
            paymentFailure.remove();
          },
        );

        const userCancelled = paymentEmitter.addListener(
          'onPaymentCancelled',
          async (event: {status: string}) => {
            console.log('Payment result received:', event);
            
            // Log payment cancellation
            await logPaymentEvent(dispatch, {
              orderId: result.payload.data.token || `WALLET_${Date.now()}`,
              amount: amount,
              method: selectedMethod || 'Unknown',
              status: 'failed'
            });
            
            // Log user cancellation
            await logCustomEvent(dispatch, `User cancelled payment for wallet credit: ₹${amount}`);
            // Clean up after handling
            userCancelled.remove();
          },
        );
        
        // Log payment gateway initiation
        await logCustomEvent(dispatch, `Payment gateway initiated for order: ${result.payload.data.token}`);
        
        // Start the payment
        await PluralPayment.startPayment(result.payload.data.token);
      } else {
        // Log order creation failure
        await logErrorEvent(dispatch, {
          error: 'Order creation failed for wallet credit',
          context: 'Order creation',
          userId: number || 'unknown'
        });
        console.error('Order creation failed');
      }
    } catch (err) {
      // Log payment initiation error
      await logErrorEvent(dispatch, {
        error: `Payment initiation failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
        context: 'Payment initiation',
        userId: number || 'unknown'
      });
      console.error('Payment initiation failed:', err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Header />

          {/* You’re Adding */}
          <View style={styles.amountContainer}>
            <Text style={styles.addingText}>You're Adding</Text>
            <Text style={styles.amount}>₹ {amount}</Text>
            <Text style={styles.bonus}>
              You’ll receive an extra ₹ {bonusAmount} ({bonusPercent}% bonus)
            </Text>
            <Text style={styles.total}>
              Your total balance ₹{totalAmount.toFixed(2)}
            </Text>
          </View>

          {/* Payment Method Section */}
          <View style={styles.methodsContainer}>
            <View style={styles.paymentLabelRow}>
              <Text style={styles.paymentLabel}>
                Choose default payment method
              </Text>
              {/* <Text style={styles.addText}>Add</Text> */}
            </View>

            <TouchableOpacity
              style={styles.methodRow}
              onPress={() => setSelectedMethod('CARD')}>
              <View style={styles.radioContainer}>
                {selectedMethod === 'CARD' && (
                  <View style={styles.radioSelected} />
                )}
              </View>
              <Text style={styles.methodText}>Credit / Debit / ATM Card</Text>
              <Text style={styles.rightArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.methodRow}
              onPress={() => setSelectedMethod('NETBANKING')}>
              <View style={styles.radioContainer}>
                {selectedMethod === 'NETBANKING' && (
                  <View style={styles.radioSelected} />
                )}
              </View>
              <Text style={styles.methodText}>Net Banking</Text>
              <Text style={styles.rightArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.methodRow}
              onPress={() => setSelectedMethod('UPI')}>
              <View style={styles.radioContainer}>
                {selectedMethod === 'UPI' && (
                  <View style={styles.radioSelected} />
                )}
              </View>
              <Text style={styles.methodText}>Choose UPI Apps</Text>
              <Text style={styles.rightArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom fixed: Summary + Button */}
        {/* <View style={styles.bottomSection}>
          <View style={styles.summaryBox}>
            <Text style={styles.label}>Total amount payable</Text>
            <Text style={styles.amountGreen}>₹{amount}</Text>
          </View>
          <Text style={styles.supportText}>Need Help? Contact Support</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => startPayment()}>
            <Text style={styles.buttonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View> */}
        {/* {customerAddresses && customerAddresses.length > 0 ? ()} */}
        {/* {userAddressData && (
          <DeliveryAddress
            amount={totalAmount}
            addressData={userAddressData}
            addressSelected={addressSelected}
            onPress={() => setShowAddressBottomSheet(true)}
            onAddressSelect={address => {
              setUserAddressData(address);
              setAddressSelected(true);
            }}
          />
        )} */}
        <AddressButton
          AddCreditsToWallet={flowType === 'Main' ? true : false}
          addressSelected={addressSelected}
          amount={amount}
          onPress={() => startPayment(couponCode)}
        />
      </View>
      <SuccessModal
        isVisible={isSuccessModalVisible}
        onClose={() => setIsSuccessModalVisible(true)}
        onDonePress={handleSuccessModalDone}
        title='Payment Successful!'
        subtitle='Your payment has been processed successfully.'
      />
    </SafeAreaView>
  );
};

export default AddCreditsToWallet;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    padding: wp(4),
    paddingBottom: hp(25),
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: hp(3),
    padding: wp(4),
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: Colors.darkPurple,
    marginTop: hp(1),
  },
  addingText: {
    fontSize: sp(20),
    color: Colors.lightGrey,
  },
  amount: {
    fontSize: sp(44),
    fontWeight: 'bold',
    color: Colors.black,
  },
  bonus: {
    color: Colors.primary,
    fontSize: sp(15),
    marginVertical: hp(0.5),
    marginBottom: hp(1),
  },
  total: {
    fontSize: sp(17),
    color: Colors.blackText,
    fontWeight: 'bold',
  },
  methodsContainer: {
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    paddingVertical: hp(2),
    marginBottom: hp(3),
  },
  paymentLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.5),
    paddingHorizontal: wp(1),
  },
  paymentLabel: {
    fontSize: sp(14),
    color: Colors.blackText,
  },
  addText: {
    fontSize: sp(15),
    color: Colors.primary,
    fontWeight: '500',
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(2),
    marginBottom: hp(1.5),
    borderColor: Colors.darkPurple,
    borderWidth: 1,
    borderRadius: wp(3),
  },
  radioContainer: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  radioSelected: {
    width: wp(2.5),
    height: wp(2.5),
    borderRadius: wp(1.25),
    backgroundColor: Colors.primary,
  },
  methodText: {
    flex: 1,
    marginLeft: wp(3),
    fontSize: sp(14),
  },
  rightArrow: {
    fontSize: sp(20),
    color: Colors.lightGrey,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: wp(4),
    backgroundColor: Colors.white,
    borderColor: Colors.lightGrey,
  },
  summaryBox: {
    borderColor: Colors.backgroundGrey,
    borderWidth: 1,
    borderRadius: wp(4),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    marginBottom: hp(1.5),
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: sp(14),
    color: Colors.lightGrey,
  },
  amountGreen: {
    fontSize: sp(16),
    fontWeight: '600',
    color: Colors.primary,
  },
  supportText: {
    fontSize: sp(12),
    color: Colors.black,
    textAlign: 'center',
    marginTop: hp(1),
    marginBottom: hp(2),
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: wp(2),
    padding: hp(2),
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: sp(16),
    fontWeight: '600',
  },
});
