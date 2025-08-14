import React, { useState } from 'react';
import {View, Text, TouchableOpacity,TextInput, StyleSheet, ScrollView, Alert, ToastAndroid} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontFamily } from '../../utils/constant'; 
import SimpleIcon from '../../components/SimpleIcon';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Header from './Header';
import { useRoute, RouteProp } from '@react-navigation/native';
import { imagePaths } from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';


const DueSettlement = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'DueSettlement'>>(); 
  const totalDueAmount = route.params?.totalDueAmount || 0; 
  const minimumPayment = Math.ceil(totalDueAmount * 0.3); 
  const [selectedOption, setSelectedOption] = useState<'full' | 'partial' | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('');

  const paymentOptions = [
    {
      type: 'full',
      title: 'Pay Full Amount',
      amount: totalDueAmount,
      description: 'Clear your entire due balance',
    },
    {
      type: 'partial',
      title: 'Pay Partial Amount',
      amount: minimumPayment,
      description: `Minimum payment: ₹${minimumPayment} (30% of due)`,
    },
  ];

  const handleOptionPress = (option: 'full' | 'partial') => {
    setSelectedOption(option);
    if (option === 'full') {
      setCustomAmount('');
    } else {
      setCustomAmount(minimumPayment.toString());
    }
  };

  const validatePartialAmount = (amount: string): boolean => {
    const numAmount = parseFloat(amount);
    return numAmount >= minimumPayment && numAmount <= totalDueAmount;
  };

  const handleProceed = () => {
    let finalAmount: number;

    if (selectedOption === 'full') {
      finalAmount = totalDueAmount;
    } else if (selectedOption === 'partial') {
      const enteredAmount = parseFloat(customAmount);

      if (!customAmount || isNaN(enteredAmount)) {
        ToastAndroid.show('Invalid Amount Please enter a valid amount.',ToastAndroid.SHORT);
        return;
      }

      // if (enteredAmount < minimumPayment) {
      //   Alert.alert(
      //     'Amount Too Low',
      //     `Minimum payment amount is ₹${minimumPayment} (30% of total due).`
      //   );
      //   return;
      // }

      if (enteredAmount > totalDueAmount) {
        ToastAndroid.show(
          `Amount Too High
          Payment amount cannot exceed the total due amount of ₹${totalDueAmount}.`,ToastAndroid.SHORT
        );
        return;
      }

      finalAmount = enteredAmount;
    } else {
      ToastAndroid.show('Selection Required Please select a payment option.',ToastAndroid.SHORT);
      return;
    }

        navigation.navigate('AddCreditsToWallet', {
        amount: finalAmount,
        totalDue: totalDueAmount, 
        });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />

      {/* Due Amount Display */}
      <View style={styles.dueAmountContainer}>
        <Text style={styles.dueAmountLabel}>Total Due Amount</Text>
        <Text style={styles.dueAmountText}>₹{totalDueAmount.toLocaleString()}</Text>
        <Text style={styles.minimumPaymentText}>
          Minimum Payment: ₹{minimumPayment.toLocaleString()} (30%)
        </Text>
      </View>

      {/* Payment Options */}
      <View style={styles.wrapperCardBox}>
        {paymentOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.card,
              selectedOption === option.type && styles.selectedCard,
            ]}
            onPress={() => handleOptionPress(option.type as 'full' | 'partial')}
          >
            <View style={styles.cardLeft}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.amountText}>
                {option.type === 'full'
                  ? `₹${option.amount.toLocaleString()}`
                  : `₹${minimumPayment.toLocaleString()} - ₹${totalDueAmount.toLocaleString()}`}
              </Text>
            </View>
            <View style={styles.cardRight}>
              <Text style={styles.detailText}>{option.description}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Custom Amount Input for Partial Payment */}
        {selectedOption === 'partial' && (
          <View style={styles.customAmountContainer}>
            <Text style={styles.customAmountLabel}>Enter Amount</Text>
            <TextInput
              style={[
                styles.inputInsideWrapper,
                !validatePartialAmount(customAmount) && customAmount && styles.invalidInput,
              ]}
              placeholder={`Min: ₹${minimumPayment}, Max: ₹${totalDueAmount}`}
              placeholderTextColor="#7E7E7E"
              keyboardType="numeric"
              value={customAmount}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, '');
                setCustomAmount(numericText);
              }}
            />
            {customAmount && !validatePartialAmount(customAmount) && (
              <Text style={styles.errorText}>
                Amount must be between ₹{minimumPayment.toLocaleString()} and ₹{totalDueAmount.toLocaleString()}
              </Text>
            )}
          </View>
        )}
      </View>

      <TouchableOpacity
  style={[
    styles.proceedButton,
    (!selectedOption || (selectedOption === 'partial' && !validatePartialAmount(customAmount))) &&
      styles.disabledButton,
  ]}
  onPress={handleProceed}
  disabled={!selectedOption || (selectedOption === 'partial' && !validatePartialAmount(customAmount))}
>
  <Text style={styles.proceedButtonText}>
    {selectedOption === 'full'
      ? `Pay Full Amount (₹${totalDueAmount.toLocaleString()})`
      : selectedOption === 'partial' && customAmount
      ? `Pay ₹${parseFloat(customAmount || '0').toLocaleString()}`
      : 'Proceed To Payment'}
  </Text>
</TouchableOpacity>
    </ScrollView>
  );
};

export default DueSettlement;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flexGrow: 1,
  },
  dueAmountContainer: {
    backgroundColor: Colors.DueYellow,
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(3),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.BorderueYellow,
    margin: wp(4),
  },
  dueAmountLabel: {
    fontSize: sp(14),
    color: Colors.DueText,
    marginBottom: hp(0.5),
  },
  dueAmountText: {
    fontSize: sp(28),
    fontWeight: 'bold',
    color: Colors.DueRedText,
    marginBottom: hp(1),
  },
  minimumPaymentText: {
    fontSize: sp(12),
    color: Colors.DueText,
  },
  wrapperCardBox: {
    backgroundColor: '#F2FFF5',
    borderRadius: wp(4),
    padding: wp(3),
    marginBottom: hp(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 0,
    marginHorizontal: wp(4),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    padding: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderColor: Colors.greyBackground,
  },
  selectedCard: {
    borderColor: Colors.SelectedBorderCard,
    backgroundColor: Colors.SelectedCard,
  },
  cardLeft: {
    flex: 1,
  },
  cardRight: {
    alignItems: 'flex-end',
    flex: 1,
  },
  optionTitle: {
    fontSize: sp(16),
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: hp(0.5),
  },
  amountText: {
    fontSize: sp(18),
    fontWeight: 'bold',
    color: Colors.DueGreenText,
  },
  detailText: {
    fontSize: sp(12),
    color: Colors.lightGrey,
    textAlign: 'right',
    marginTop: hp(0.5),
  },
  customAmountContainer: {
    marginTop: hp(1),
  },
  customAmountLabel: {
    fontSize: sp(14),
    color: Colors.black,
    marginBottom: hp(1),
    fontWeight: '600',
  },
  inputInsideWrapper: {
    height: hp(6),
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(2),
    paddingHorizontal: wp(4),
    fontSize: sp(16),
    color: Colors.black,
    borderWidth: 1,
    borderColor: Colors.greyBackground,
  },
  invalidInput: {
    borderColor: Colors.danger,
    backgroundColor: Colors.light,
  },
  errorText: {
    fontSize: sp(12),
    color: Colors.danger,
    marginTop: hp(0.5),
  },
  inputOutside: {
    height: hp(6),
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(2),
    paddingHorizontal: wp(4),
    fontSize: sp(16),
    marginBottom: hp(2),
    color: Colors.black,
  },
  proceedButton: {
    backgroundColor: Colors.primary,
    height: hp(6.5),
    borderRadius: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
    padding: hp(1.5),
    marginHorizontal: wp(4),
    marginVertical: hp(2),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  disabledButton: {
    backgroundColor: Colors.greyBackground,
  },
  proceedButtonText: {
    color: Colors.white,
    fontSize: sp(16),
    fontWeight: 'bold',
  },
  remainingAmountContainer: {
    backgroundColor: Colors.DueYellow,
    borderRadius: wp(2),
    padding: wp(3),
    marginTop: hp(2),
    alignItems: 'center',
  },
  remainingAmountText: {
    fontSize: sp(14),
    color: Colors.DueText,
    fontWeight: '600',
  },
});