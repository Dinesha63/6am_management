import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import SimpleIcon from './SimpleIcon';
import { FontFamily } from '../utils/constant';
import Colors from '../utils/constants/colors';
import { imagePaths } from '../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../utils/constants/responsiveScreen';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { sendOtp } from '../redux/Features/OtpGeneration/otpThunk';

const { width: screenWidth } = Dimensions.get('window');

interface GuestUserBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (phoneNumber: string) => void;
  onVerifyOtp: (otp: string) => Promise<void>;
  onResendOtp?: (phoneNumber: string) => Promise<void>;
}

const GuestUserBottomSheet: React.FC<GuestUserBottomSheetProps> = ({
  isVisible,
  onClose,
  onSave,
  onVerifyOtp,
  onResendOtp,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState<number>(30);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [inputError, setInputError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [otpErrorMessage, setOtpErrorMessage] = useState<string>('');
  const dispatch = useDispatch<AppDispatch>();
  const otpRefs = useRef<(TextInput | null)[]>([]);
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(hp(100))).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Timer for resend OTP
  useEffect(() => {
    if (timer === 0 || !isOtpSent) return;

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, isOtpSent]);

  // Animation effects
  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: hp(100),
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Clear error message when user starts typing
    if (otpErrorMessage) {
      setOtpErrorMessage('');
    }

    // Auto-focus next input
    if (text && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSave = async () => {
    console.log("iamcalling handleSave")
    if (phoneNumber.length !== 10) {
      setInputError(true);
      setErrorMessage('Please enter a valid 10-digit number');
      return;
    }

    setIsLoading(true);
    try {
      console.log('[GUEST BOTTOM SHEET] Calling parent onSave for:', phoneNumber);
      
      // Call parent's onSave function instead of making API call here
      await onSave(phoneNumber);
      
      console.log('[GUEST BOTTOM SHEET] Parent onSave completed successfully');
      
      // Show OTP input after successful OTP send
      setIsOtpSent(true);
      setOtp(Array(6).fill(''));
      setTimer(30);
      setInputError(false);
      setErrorMessage('');
    } catch (error) {
      console.error('[GUEST BOTTOM SHEET] Error in parent onSave:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    if (!otpString || otpString.length !== 6) {
      setOtpErrorMessage('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setOtpErrorMessage(''); // Clear any previous error message
    try {
      console.log('[GUEST BOTTOM SHEET] Calling parent onVerifyOtp with:', otpString);
      
      // Call parent's onVerifyOtp function instead of making API call here
      await onVerifyOtp(otpString);

      console.log('[GUEST BOTTOM SHEET] Parent onVerifyOtp completed successfully');
      
      // Close the bottom sheet after successful verification
      handleClose();
    } catch (error) {
      console.error('[GUEST BOTTOM SHEET] Error in parent onVerifyOtp:', error);
      setOtpErrorMessage('You have entered wrong OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      
      if (onResendOtp) {
        // Call parent's onResendOtp function if provided
        await onResendOtp(phoneNumber);
        console.log('[GUEST BOTTOM SHEET] Parent onResendOtp completed successfully');
      } else {
        // Fallback to direct API call if no parent handler provided
        const result = await dispatch(
          sendOtp({ phone: phoneNumber, isResending: true })
        ).unwrap();
        console.log('[GUEST BOTTOM SHEET] Direct resend OTP success:', result);
      }
      
      setOtp(Array(6).fill(''));
      setTimer(30);
      Alert.alert('Success', 'OTP resent successfully!');
    } catch (error) {
      console.error('[GUEST BOTTOM SHEET] Error resending OTP:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleClose = () => {
    setPhoneNumber('');
    setOtp(Array(6).fill(''));
    setIsOtpSent(false);
    setTimer(30);
    onClose();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={handleClose}
          activeOpacity={1}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <Animated.View 
              style={[
                styles.bottomSheet,
                {
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                  ]
                }
              ]}
            >
                         {/* Header with Close Button */}
             <View style={styles.topHeader}>
               <View style={styles.dragIndicator} />
               <TouchableOpacity
                 style={styles.closeButton}
                 onPress={handleClose}
                 activeOpacity={0.7}
               >
                 <SimpleIcon
                   source={imagePaths.close_icon || '✕'}
                   size={wp(5)}
                   color={Colors.grey}
                 />
               </TouchableOpacity>
             </View>
            
            {!isOtpSent ? (
              <>
                {/* Modern Header */}
                <View style={styles.header}>
                  {/* <View style={styles.iconContainer}>
                    <View style={styles.iconBackground}>
                      <SimpleIcon
                        source={imagePaths.person_icon || '👤'}
                        size={wp(6)}
                        color={Colors.primary}
                      />
                    </View>
                  </View> */}
                  <Text style={styles.title}>Welcome to 6 am!</Text>
                  <Text style={styles.subtitle}>
                    Enter your phone number to get started with fresh dairy products
                  </Text>
                </View>

                {/* Phone Number Input */}
                <View style={styles.inputContainer}>
                  <View
                    style={[
                      styles.phoneInputWrapper,
                      {
                        borderWidth: inputError ? 1 : 1,
                        borderColor: inputError ? 'red' : Colors.lightGrey,
                      },
                    ]}>
                    <Image source={imagePaths.Flag_icon} style={{width: wp(7), height: wp(7), marginRight: wp(2)}} />
                    <Text style={styles.countryCode}>+91</Text>
                    <TextInput
                      style={styles.phoneInput}
                      placeholder="Enter your mobile number"
                      placeholderTextColor="#aaa"
                      value={phoneNumber}
                      onChangeText={(text: string) => {
                        const sanitized = text.replace(/[^0-9]/g, '');
                        setPhoneNumber(sanitized);
                        if (inputError) {
                          setInputError(false);
                          setErrorMessage('');
                        }
                      }}
                      keyboardType="phone-pad"
                      maxLength={10}
                      autoFocus
                    />
                  </View>
                  {inputError && (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  )}
                </View>

                {/* Modern Save Button */}
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    (!phoneNumber.trim() || phoneNumber.length !== 10 || isLoading) && styles.saveButtonDisabled
                  ]}
                  onPress={handleSave}
                  disabled={!phoneNumber.trim() || phoneNumber.length !== 10 || isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <View style={styles.spinner} />
                      <Text style={styles.saveButtonText}>Sending OTP...</Text>
                    </View>
                  ) : (
                    <>
                      <SimpleIcon
                        source={imagePaths.Phone_icon || '📱'}
                        size={wp(5)}
                        color={Colors.white}
                      />
                      <Text style={styles.saveButtonText}>Send OTP</Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleClose}
                  activeOpacity={0.7}
                >
                </TouchableOpacity>

                {/* Info Card */}
                <View style={styles.infoCard}>
                  <View style={styles.infoIconContainer}>
                    <Image source={imagePaths.Info_icon} style={{width: wp(5), height: wp(5)}} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoTitle}>Secure & Private</Text>
                    <Text style={styles.infoText}>
                      We'll send you a verification code to confirm your number. Your data is safe with us.
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <>
                {/* OTP Header */}
                <View style={styles.header}>
                  <View style={styles.iconContainer}>
                    {/* <View style={[styles.iconBackground, { backgroundColor: Colors.success }]}>
                      <Text style={styles.otpIcon}>🔐</Text>
                    </View> */}
                  </View>
                  <Text style={styles.title}>Verify Your Number</Text>
                  <Text style={styles.subtitle}>
                    We've sent a 6-digit code to +91 {phoneNumber}
                  </Text>
                </View>

                                 {/* OTP Input */}
                 <View style={styles.inputContainer}>
                   <Text style={styles.inputLabel}>Enter Verification Code</Text>
                   <View style={styles.otpContainer}>
                     {otp.map((digit, index) => (
                       <TextInput
                         key={index}
                         ref={(ref) => {
                           if (otpRefs.current) {
                             otpRefs.current[index] = ref;
                           }
                         }}
                         style={[
                           styles.otpInput,
                           digit && styles.otpInputFilled
                         ]}
                         value={digit}
                         onChangeText={(text) => handleOtpChange(text, index)}
                         onKeyPress={(e) => handleOtpKeyPress(e, index)}
                         keyboardType="number-pad"
                         maxLength={1}
                         autoFocus={index === 0}
                       />
                     ))}
                   </View>
                   {otpErrorMessage !== '' && (
                     <Text style={styles.otpErrorText}>{otpErrorMessage}</Text>
                   )}
                 </View>

                {/* Verify Button */}
                <TouchableOpacity
                  style={[
                    styles.VerifyButton,
                    (otp.join('').length !== 6 || isVerifying) && styles.saveButtonDisabled
                  ]}
                  onPress={handleVerifyOtp}
                  disabled={otp.join('').length !== 6 || isVerifying}
                  activeOpacity={0.8}
                >
                  {isVerifying ? (
                    <View style={styles.loadingContainer}>
                      <View style={styles.spinner} />
                      <Text style={styles.saveButtonText}>Verifying...</Text>
                    </View>
                  ) : (
                    <>
                      <SimpleIcon
                        source={imagePaths.CheckBox_icon || '✅'}
                        size={wp(5)}
                        color={Colors.white}
                      />
                      <Text style={styles.saveButtonText}>Verify & Continue</Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Resend Section */}
                <View style={styles.resendContainer}>
                  {timer > 0 ? (
                    <View style={styles.timerContainer}>
                      <Text style={styles.timerText}>Resend code in</Text>
                      <Text style={styles.timerValue}>{timer}s</Text>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={styles.resendButton}
                      onPress={handleResendOtp} 
                      disabled={isResending}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.resendLink}>
                        {isResending ? 'Resending...' : 'Resend Code'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Back Button */}
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    setIsOtpSent(false);
                    setOtp(Array(6).fill(''));
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.backButtonText}>Edit PhoneNumber</Text>
                </TouchableOpacity>

                {/* Help Text */}
                <View style={styles.helpContainer}>
                  <Text style={styles.helpText}>
                    Didn't receive the code? Check your SMS or try resending
                  </Text>
                </View>
              </>
                         )}
           </Animated.View>
           </TouchableWithoutFeedback>
         </KeyboardAvoidingView>
       </Animated.View>
     </Modal>
   );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalBackground: {
    flex: 1,
  },
  keyboardAvoidingView: {
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp(6),
    borderTopRightRadius: wp(6),
    paddingTop: hp(1),
    paddingHorizontal: wp(5),
    paddingBottom: hp(3),
    minHeight: hp(35),
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
    overflow: 'hidden',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
    paddingHorizontal: wp(2),
    position: 'relative',
  },
  dragIndicator: {
    width: wp(12),
    height: hp(0.4),
    backgroundColor: Colors.lightGrey,
    borderRadius: wp(2),
  },
  closeButton: {
    position: 'absolute',
    right: wp(2),
    top: hp(0.5),
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: hp(2),
  },
  iconContainer: {
    marginBottom: hp(1.5),
  },
  iconBackground: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    backgroundColor: Colors.lightblue,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  otpIcon: {
    fontSize: sp(20),
  },
  title: {
    fontSize: sp(20),
    fontWeight: '700',
    color: Colors.black,
    marginBottom: hp(0.8),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: sp(14),
    color: Colors.grey,
    textAlign: 'center',
    lineHeight: sp(20),
    paddingHorizontal: wp(3),
  },
  inputContainer: {
    marginBottom: hp(2.5),
  },
  inputLabel: {
    fontSize: sp(15),
    fontWeight: '600',
    color: Colors.black,
    marginBottom: hp(1.5),
    textAlign: 'center',
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: wp(5),
    paddingHorizontal: wp(1.5),
    paddingVertical: hp(0.6),
  },
  countryCode: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '500',
    marginRight: wp(1.5),
  },
  phoneInput: {
    flex: 1,
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(2),
    marginHorizontal: wp(7),
  },
  otpInput: {
    width: wp(11),
    height: wp(11),
    borderWidth: wp(0.3),
    borderColor: Colors.lightGrey,
    borderRadius: wp(2.5),
    textAlign: 'center',
    fontSize: sp(18),
    fontWeight: '600',
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  otpInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.lightblue,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: hp(2.5),
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGrey,
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1.2),
    borderRadius: wp(3.5),
  },
  timerText: {
    fontSize: sp(13),
    color: Colors.grey,
    marginRight: wp(2),
  },
  timerValue: {
    fontSize: sp(15),
    fontWeight: '600',
    color: Colors.primary,
  },
  resendButton: {
    backgroundColor: Colors.lightblue,
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1.2),
    borderRadius: wp(3.5),
  },
  resendLink: {
    fontSize: sp(13),
    color: Colors.primary,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: hp(1.8),
    borderRadius: wp(3.5),
    marginBottom: hp(2),
  },
  VerifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: hp(1.8),
    borderRadius: wp(3.5),
    marginBottom: hp(2),
    marginHorizontal: wp(16),
  },
  saveButtonDisabled: {
    backgroundColor: Colors.greyBackground,
    shadowOpacity: 0,
    elevation: 0,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinner: {
    width: wp(4),
    height: wp(4),
    borderRadius: wp(2),
    borderWidth: 2,
    borderColor: Colors.white,
    borderTopColor: 'transparent',
    marginRight: wp(2),
  },
  saveButtonText: {
    fontSize: sp(15),
    fontWeight: '600',
    color: Colors.white,
    marginLeft: wp(2),
  },
  cancelButton: {
    paddingVertical: hp(1.5),
    alignItems: 'center',
    borderRadius: wp(3.5),
    // borderWidth: 1,
    borderColor: Colors.lightGrey,
    backgroundColor: Colors.white,
    marginBottom: hp(2.5),
  },
  cancelButtonText: {
    fontSize: sp(14),
    fontWeight: '500',
    color: Colors.grey,
  },
  backButton: {
    paddingVertical: hp(1.2),
    alignItems: 'center',
    marginBottom: hp(2),
  },
  backButtonText: {
    fontSize: sp(13),
    fontWeight: '500',
    color: Colors.primary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.lightblue,
    padding: wp(3),
    borderRadius: wp(3.5),
    marginBottom: hp(1.5),
  },
  infoIconContainer: {
    marginRight: wp(2.5),
  },
  infoIcon: {
    fontSize: sp(15),
    borderRadius: wp(2),
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: sp(13),
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: hp(0.3),
  },
  infoText: {
    fontSize: sp(12),
    color: Colors.grey,
    lineHeight: sp(16),
  },
  helpContainer: {
    alignItems: 'center',
    paddingHorizontal: wp(3),
  },
  helpText: {
    fontSize: sp(12),
    color: Colors.grey,
    textAlign: 'center',
    lineHeight: sp(16),
  },
  errorText: {
    color: 'red',
    fontSize: sp(12),
    marginTop: hp(0.5),
    marginLeft: wp(2),
  },
  otpErrorText: {
    color: 'red',
    fontSize: sp(13),
    marginTop: hp(1),
    textAlign: 'center',
  },
});

export default GuestUserBottomSheet; 