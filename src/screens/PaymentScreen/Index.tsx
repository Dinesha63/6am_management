import React, {useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, StatusBar, Alert, ToastAndroid} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import Header from './Header';
import PaymentMethod from './PaymentMethod';
import DeliveryAddress from './DeliveryAddress';
import AddressButton from './AddressButton';
import Colors from '../../utils/constants/colors';
import {fetchCustomerInfo} from '../../redux/Features/Customer/thunks/customerThunk';
import {fetchCustomerAddress} from '../../redux/Features/Address/addressThunk';
import {useAppDispatch} from '../../redux/hooks';
import {getStoredPhoneNumber} from '../../config/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {isFulfilled} from '@reduxjs/toolkit';
import {useFocusEffect} from '@react-navigation/native';
import {Routes} from '../../navigation/routes';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {postSubscriptionThunk} from '../../redux/Features/setSubscription/subscriptionThunk';
import { logPaymentEvent } from '../../utils/eventLogger';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'> & {
  route: {
    params: {
      totalAmount: number;
      paymentData: any;
    };
  };
};

const PaymentScreen: React.FC<Props> = ({route}) => {
  const {totalAmount, paymentData} = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  const [walletAmount, setWalletAmount] = useState<number>(0);
  const [addressSelected, setAddressSelected] = useState<boolean>(false);
  const [userAddressData, setUserAddressData] = useState<any>(null);
  const [walletSelected, setWalletSelected] = useState<boolean>(false);
  const [walletEnabled, setWalletEnabled] = useState<boolean>(false);
  const [showAddressBottomSheet, setShowAddressBottomSheet] = useState(false);
  console.log('paymentData  :', walletSelected, walletAmount);
  useEffect(() => {
    fetchInfo();
    fetchData();
  }, []);

  const fetchInfo = async () => {
    try {
      const storedPhone = await getStoredPhoneNumber();
      if (!storedPhone) return;

      const result = await dispatch(fetchCustomerInfo(storedPhone)).unwrap();

      const walletAmount = result?.data?.walletAmount ?? 0;
      setWalletAmount(walletAmount);
      setWalletSelected(walletAmount > 0);

      console.log('Wallet Amount:', walletAmount);
    } catch (error) {
      console.error('fetchCustomerInfo error:', error);
    }
  };

  const fetchData = async () => {
    try {
      const number = await AsyncStorage.getItem('userPhoneNumber');
      if (number) {
        const customer_data = await dispatch(fetchCustomerAddress(number));
        if (isFulfilled(customer_data)) {
          const addresses = customer_data.payload;
          if (addresses?.length > 0) {
            const defaultAddress =
              addresses.length === 1
                ? addresses[0]
                : addresses.find(a => a.isDefault) || addresses[0];
            setUserAddressData(defaultAddress);
            setAddressSelected(true);
          }
        } else {
          console.error('❌ Failed to fetch customer address');
        }
      }
    } catch (error) {
      console.error('❌ Error in fetching phone number or address:', error);
    }
  };

  const proceedWithPayment = async (amount: number, paymentData: any) => {
    console.log('Proceed with payment', amount);
    console.log('paymentData', paymentData);
    
    try {
      // Log payment initiation event
      await logPaymentEvent(dispatch, {
        orderId: `SUB_${Date.now()}`,
        amount: amount,
        method: walletEnabled ? 'Wallet' : 'Subscription',
        status: 'pending'
      });

      const result = await dispatch(postSubscriptionThunk(paymentData));

      if (postSubscriptionThunk.fulfilled.match(result)) {
        console.log('✅ Subscription successful:', result);
        
        // Log successful payment event
        await logPaymentEvent(dispatch, {
          orderId: `SUB_${Date.now()}`,
          amount: amount,
          method: walletEnabled ? 'Wallet' : 'Subscription',
          status: 'success'
        });

        if (walletEnabled) {
          navigation.navigate('SubscriptionSuccessScreen');
        } else {
          navigation.navigate(Routes.CreditScreen, {
            unitPrice: paymentData.pricePerUnit,
            flowType: 'Subscription',
          });
        }
      } else {
        // Log failed payment event
        await logPaymentEvent(dispatch, {
          orderId: `SUB_${Date.now()}`,
          amount: amount,
          method: walletEnabled ? 'Wallet' : 'Subscription',
          status: 'failed'
        });
        
        ToastAndroid.show(
          `Failed to subscribe,
          ${result.payload} ?? Something went wrong`,ToastAndroid.SHORT);
      }
    } catch (SubscribeError) {
      // Log error event
      await logPaymentEvent(dispatch, {
        orderId: `SUB_${Date.now()}`,
        amount: amount,
        method: walletEnabled ? 'Wallet' : 'Subscription',
        status: 'failed'
      });
      
      ToastAndroid.show('Error, Something went wrong while subscribing',ToastAndroid.SHORT);
      console.error('❌ Subscribe error:', SubscribeError);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <Header />
        <PaymentMethod
          amount={totalAmount}
          walletAmount={walletAmount}
          walletSelected={walletSelected}
          onPress={() => console.log('Proceed with payment')}
          walletEnabled={walletEnabled}
          setWalletEnabled={setWalletEnabled}
        />
        <DeliveryAddress
          amount={totalAmount}
          walletSelected={walletSelected}
          addressData={userAddressData}
          addressSelected={addressSelected}
          onPress={() => console.log('Proceed with payment')}
          onAddressSelect={address => {
            setUserAddressData(address);
            setAddressSelected(true);
            console.log('Selected address:', address);
          }}
          showAddressBottomSheet={showAddressBottomSheet}
          setShowAddressBottomSheet={setShowAddressBottomSheet}
        />
        <AddressButton
          addressSelected={addressSelected}
          amount={totalAmount}
          onPress={() => proceedWithPayment(totalAmount, paymentData)}
          onOpenAddressSheet={() => setShowAddressBottomSheet(true)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGreyScreen,
  },
});

export default PaymentScreen;
