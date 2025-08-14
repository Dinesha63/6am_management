import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { useAppSelector } from '../../hooks/useAppDispatch';
import Header from './Header';
import { RootStackParamList } from '../../types';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { fetchWalletBonus } from '../../redux/Features/6amCredits/creditsThunk';
import { validateCouponCodeThunk } from '../../redux/Features/coupon/couponThunk';
import ApiContext from '../../context/ApiContext';
import { logPaymentEvent, logCustomEvent, logErrorEvent } from '../../utils/eventLogger';

// Route & Navigation types
type CreditScreenRouteProp = RouteProp<RootStackParamList, 'CreditScreen'>;
type CreditScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreditScreen'
>;

const CreditScreen: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const couponInputRef = useRef<View>(null);
  const navigation = useNavigation<CreditScreenNavigationProp>();
  const route = useRoute<CreditScreenRouteProp>();
  const dispatch = useAppDispatch();
  // Fetch tiers from Redux state
  const { tiers, loading, error } = useSelector(
    (state: RootState) => state.walletBonus,
  );
  console.log('Wallet Bonus tiers:', tiers);

  // Params & local state
  const unitPrice = route.params?.unitPrice || 0;
  const flowType = route.params?.flowType || 'Main';
  console.log('Flow Type:', flowType);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [responseMessage, setResponseMessage] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");


  // On mount, load bonus tiers
  const [walletBonus, setWalletBonus] = useState<number>(0); // or string, if needed
  const [maxWalletRechargeAmount, setMaxWalletRechargeAmount] = useState<number>(0);

  const apiContext = useContext(ApiContext);


  useEffect(() => {
    const loadWalletBonus = async () => {
      console.log('Fetching wallet bonus...');
      try {
        const result = await dispatch(fetchWalletBonus()).unwrap();
        console.log('Wallet bonus fetched successfully:', result);
        setWalletBonus(result?.minWalletRechargeAmount);
        setMaxWalletRechargeAmount(result?.maxWalletRechargeAmount);
      } catch (error) {
        console.error('Failed to fetch wallet bonus:', error);
      }
    };

    loadWalletBonus();
  }, [dispatch]);

  // Ensure button is disabled when no amount is selected
  useEffect(() => {
    if (!selectedAmount && !customAmount.trim()) {
      setIsButtonDisabled(true);
    }
  }, [selectedAmount, customAmount]);

  useFocusEffect(
    useCallback(() => {
      setCouponCode('');
      setIsValid(null);
      setResponseMessage('');
    }, [])
  );

  // Note: After successful guest login, navigation stack is reset
  // so back button will go to Main screen (authenticated home) instead of guest screens


  // Minimum based on unit price
  const minimumAmount = unitPrice * 30 * 0.3;

  // Handlers
  const handleAmountPress = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setErrorMessage(''); // Clear any error messages when predefined amount is selected
    setIsButtonDisabled(false);
  };

  const handleCustomAmountChange = async (text: string) => {
    setCustomAmount(text);
    setSelectedAmount(null);
    
    // Handle empty input
    if (text.trim() === '') {
      setErrorMessage("");
      setIsButtonDisabled(true);
      return;
    }
    
    const parsed = parseFloat(text);

    if (isNaN(parsed)) {
      setErrorMessage("⚠️ Please enter a valid amount");
      setIsButtonDisabled(true);
      return;
    }

    // Check for negative numbers
    if (parsed <= 0) {
      setErrorMessage("⚠️ Please enter a positive amount");
      setIsButtonDisabled(true);
      return;
    }

    // Check for extremely large numbers
    if (parsed > 999999) {
      setErrorMessage("⚠️ Please enter a reasonable amount");
      setIsButtonDisabled(true);
      return;
    }

    try {
      // Log custom amount input event
      await logCustomEvent(dispatch, `User entered custom wallet amount: ₹${parsed}`);
      
      if (parsed > maxWalletRechargeAmount) {
        setErrorMessage(`⚠️ Amount exceeds maximum allowed ₹${maxWalletRechargeAmount}`);
        // Log validation error
        await logCustomEvent(dispatch, `Custom amount validation failed: Amount ₹${parsed} exceeds maximum allowed ₹${maxWalletRechargeAmount}`);
        setIsButtonDisabled(true);
      } else if (parsed < walletBonus) {
        setErrorMessage(`⚠️ Amount must be at least ₹${walletBonus}`);
        // Log validation error
        await logCustomEvent(dispatch, `Custom amount validation failed: Amount ₹${parsed} is below minimum required ₹${walletBonus}`);
        setIsButtonDisabled(true);
      } else if (parsed < minimumAmount) {
        setErrorMessage(`⚠️ Minimum recharge is ₹${minimumAmount}`);
        // Log validation warning
        await logCustomEvent(dispatch, `Custom amount validation warning: Amount ₹${parsed} is below recommended minimum ₹${minimumAmount}`);
        setIsButtonDisabled(false); // Allow proceeding but show warning
      } else {
        setErrorMessage("");
        // Log successful validation
        await logCustomEvent(dispatch, `Custom amount validation successful: ₹${parsed} is within valid range`);
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.log('Event logging failed:', error);
      // Don't block the main flow if logging fails
    }
  };

  const handleCouponFocus = () => {
    // Add a small delay to ensure the keyboard is fully shown
    setTimeout(() => {
      couponInputRef.current?.measureInWindow((x, y) => {
        const scrollToY = Math.max(0, y - 150); // Scroll to show input with some padding
        scrollViewRef.current?.scrollTo({ y: scrollToY, animated: true });
      });
    }, 100);
  };

  const handleProceed = async () => {
    const finalAmount =
      selectedAmount || (customAmount ? parseFloat(customAmount) : null);
    if (!finalAmount || isNaN(finalAmount)) {
      console.warn('Invalid amount selected.');
      return;
    }

    // Additional validation before proceeding
    if (finalAmount < walletBonus) {
      setErrorMessage(`⚠️ Amount must be at least ₹${walletBonus}`);
      return;
    }
    
    if (finalAmount > maxWalletRechargeAmount) {
      setErrorMessage(`⚠️ Amount exceeds maximum allowed ₹${maxWalletRechargeAmount}`);
      return;
    }

    // Find the correct tier for the entered amount
    const tier = tiers?.walletBonus.find(
      t =>
        finalAmount >= t.minAmount &&
        (t.maxAmount === null || finalAmount <= t.maxAmount),
    );
    const bonusPercent = tier?.bonusValue || 0;
    const bonusAmount = (finalAmount * bonusPercent) / 100;
    console.log(finalAmount, bonusPercent, bonusAmount, "sdjfsldkjfsldkjf");
    
    try {
      // Log wallet credit addition event
      await logPaymentEvent(dispatch, {
        orderId: `WALLET_${Date.now()}`,
        amount: finalAmount,
        method: 'Wallet Credit',
        status: 'pending'
      });
      
      navigation.navigate('AddCreditsToWallet', {
        amount: finalAmount,
        bonusPercent,
        bonusAmount,
        totalDue: 0,
        couponCode: isValid ? couponCode : "",
        flowType: flowType || 'Main',
      });
    } catch (error) {
      console.log('Event logging failed:', error);
      // Don't block the main flow if logging fails
    }
  };


  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const handleApply = async () => {
    try {
      const phoneNumber = await apiContext?.api.getStoredPhoneNumber();
      console.log('Apply pressed with:', couponCode, phoneNumber);

      // Log coupon application attempt
      await logCustomEvent(dispatch, `User attempted to apply coupon code: ${couponCode}`);

      const response = await dispatch(
        validateCouponCodeThunk({
          phoneNumber: phoneNumber || '',
          couponCode: couponCode.trim(),
        })
      ).unwrap();

      setIsValid(response.isValid);
      
      if (response.isValid) {
        // Log successful coupon application
        await logCustomEvent(dispatch, `Coupon applied successfully: ${couponCode} for user: ${phoneNumber}`);
        setResponseMessage('🎉 Coupon applied successfully!');
      } else {
        // Log failed coupon application
        await logCustomEvent(dispatch, `Coupon validation failed: ${couponCode} - ${response.message || 'Invalid coupon'}`);
        setResponseMessage(response.message || 'Invalid coupon');
      }
    } catch (error: any) {
      console.error('Coupon validation failed:', error);
      
      // Log coupon validation error
      await logErrorEvent(dispatch, {
        error: error.message || 'Coupon validation failed',
        context: 'Coupon application',
        userId: await apiContext?.api.getStoredPhoneNumber() || 'unknown'
      });
      
      setIsValid(false);
      setResponseMessage('⚠️ This coupon code is not valid');
    }
  };


  return (
    <>
      <Header />
      <View style={styles.mainContainer}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          <View style={styles.wrapperCardBox}>
            {tiers?.walletBonus.map((tier, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.card,
                  selectedAmount === tier.minAmount && styles.selectedCard,
                ]}
                onPress={() => handleAmountPress(tier.minAmount)}>
                <View style={styles.cardLeft}>
                  <Text style={styles.addText}>Add</Text>
                  <Text style={styles.amountText}>₹{tier.minAmount}</Text>
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.getExtraText}>Get Extra</Text>
                  <Text style={styles.bonusText}>{tier.bonusValue}%</Text>
                  <Text style={styles.detailText}>
                    Get ₹{tier.walletCreditAfterBonus} on your Account
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            <TextInput
              style={{
                backgroundColor: '#EDEDED',
                borderRadius: 8,
                height: hp(5),
                paddingHorizontal: 12,
                fontSize: 14,
                color: '#000',
              }}
              placeholder={`Add ₹${walletBonus.toFixed(2)} / Enter Custom Amount`}
              placeholderTextColor="#7E7E7E"
              keyboardType="numeric"
              value={customAmount}
              onChangeText={handleCustomAmountChange}
            />

             {errorMessage !== "" && (
            <Text style={{ color: '#FF4D4D', fontSize: 13, marginTop: hp(1) }}>
              {errorMessage}
            </Text>
          )}
          </View>

          {flowType !== 'Main' && (
            <View style={styles.setContainer}>
              <Text style={styles.setText}>
                Based on your selection of ₹{unitPrice.toFixed(2)} per day with
                deliveries on Morning (5.00 am - 7.00 am), your total cost for the
                month is ₹{(unitPrice * 30).toFixed(2)}.
              </Text>
            </View>
          )}
          <View style={{ padding: 12, backgroundColor: '#fff' }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 8,
                backgroundColor: '#F5F5F5',
                borderRadius: 8,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  color: '#000',
                  fontSize: 14,
                  paddingVertical: 6,
                }}
                placeholder="Have a Coupon Code?"
                placeholderTextColor="#7E7E7E"
                value={couponCode}
                onChangeText={(text) => {
                  setCouponCode(text);
                  setResponseMessage('');
                  setIsValid(null);
                }}
                underlineColorAndroid="transparent"
              />

              <TouchableOpacity
                onPress={handleApply}
                disabled={!couponCode.trim()}
              >
                <Text
                  style={{
                    color: couponCode.trim() ? '#000' : '#A0A0A0',
                    fontSize: 14,
                    fontWeight: '600',
                    paddingHorizontal: 8,
                  }}
                >
                  Apply
                </Text>
              </TouchableOpacity>
            </View>

            {responseMessage ? (
              <Text
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  fontWeight: '500',
                  color: isValid ? '#1DBF73' : '#FE724E',
                  backgroundColor: isValid ? '#E6F9ED' : '#FFECEC',
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 6,
                }}
              >
                {responseMessage}
              </Text>
            ) : null}
          </View>
        </ScrollView>

        <View style={styles.stickyButtonContainer}>
          <TouchableOpacity
            style={[
              styles.proceedButton,
              isButtonDisabled && styles.disabledButton,
            ]}
            onPress={() => handleProceed()}
            disabled={isButtonDisabled}>
            <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default CreditScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    paddingVertical: wp(2),
    paddingBottom: hp(12), // Increased bottom padding to account for sticky button
    backgroundColor: Colors.white,
    flexGrow: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  wrapperCardBox: {
    backgroundColor: Colors.SelectedCard,
    borderRadius: wp(4),
    padding: wp(3),
    marginBottom: hp(3),
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 0,
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
  cardLeft: { flex: 1 },
  cardRight: { alignItems: 'flex-end' },
  addText: { fontSize: sp(14), color: Colors.black },
  amountText: {
    fontSize: sp(24),
    fontWeight: 'bold',
    color: Colors.DueGreenText,
  },
  getExtraText: { fontSize: sp(12), color: Colors.primary },
  bonusText: { fontSize: sp(20), fontWeight: 'bold', color: Colors.black },
  detailText: {
    fontSize: sp(12),
    color: Colors.lightGrey,
    textAlign: 'right',
    marginTop: hp(0.5),
  },
  inputInsideWrapper: {
    height: hp(6),
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(2),
    paddingHorizontal: wp(4),
    fontSize: sp(16),
    marginTop: hp(1),
    color: Colors.black,
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
  setContainer: {
    backgroundColor: Colors.DueYellow,
    borderRadius: wp(1.5),
    padding: wp(3),
    marginBottom: hp(2)
  },
  setText: { fontSize: sp(14), color: Colors.black, lineHeight: hp(2.5) },
  proceedButton: {
    backgroundColor: Colors.primary,
    height: hp(6.5),
    borderRadius: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(4),
    marginVertical: hp(1),
  },
  proceedButtonText: {
    color: Colors.white,
    fontSize: sp(16),
    fontWeight: 'bold',
  },
  disabledButton: { backgroundColor: Colors.greyBackground },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(4),
  },
  errorText: { color: 'red', fontSize: sp(16), textAlign: 'center' },
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingTop: hp(1),
    paddingBottom: hp(2),
    borderTopWidth: 1,
    borderTopColor: Colors.greyBackground,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
});
