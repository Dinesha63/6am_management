import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  PermissionsAndroid,
  TextInputProps,
  Linking,
  TouchableWithoutFeedback,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import SuccessModal from '../../components/SuccessModal';
import SmsRetriever from 'react-native-sms-retriever';
import {FontFamily} from '../../utils/constant';
import ApiContext from '../../context/ApiContext';
import {
  CommonActions,
  useNavigation,
  RouteProp,
} from '@react-navigation/native';
import SimpleIcon from '../../components/SimpleIcon';
import {RootStackParamList} from '../../types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import {imagePaths} from '../../utils/constants/imagePaths';
import Colors from '../../utils/constants/colors';
import {
  getHash,
  removeListener,
  startOtpListener,
  useOtpVerify,
} from 'react-native-otp-verify';
import {AppDispatch} from '../../redux/store';
import {useDispatch} from 'react-redux';
import { sendOtp, verifyOtp } from '../../redux/Features/OtpGeneration/otpThunk';

type VerifyNumberScreenRouteProp = RouteProp<
  RootStackParamList,
  'VerifyNumber'
>;

type VerifyNumberScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

interface VerifyNumberScreenProps {
  route: VerifyNumberScreenRouteProp;
}

const VerifyNumberScreen: React.FC<VerifyNumberScreenProps> = ({route}) => {
  const {phoneNumber} = route.params;
  const apiContext = useContext(ApiContext);

  if (!apiContext) {
    throw new Error('VerifyNumberScreen must be used within an ApiProvider');
  }

  const {api} = apiContext;
  const navigation = useNavigation<VerifyNumberScreenNavigationProp>();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [timer, setTimer] = useState<number>(30);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(''); // Add error message state
  const dispatchOtp = useDispatch<AppDispatch>();

  const otpRefs = useRef<(TextInput | null)[]>([]);

  // Timer for resend OTP
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const startSmsListener = async () => {
      // Step 1: Get app hash
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_SMS,
            PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          ]);

          const allGranted =
            granted[PermissionsAndroid.PERMISSIONS.READ_SMS] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            granted[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] ===
              PermissionsAndroid.RESULTS.GRANTED;

          if (!allGranted) {
            console.warn('SMS permissions not granted');
            return;
          }
        }

        getHash()
          .then(hash => {
            console.log('Athi Native App Hash: here ', hash);
            if (Array.isArray(hash)) {
              console.log('App Hash:', hash[0]); // Use hash[0] only
            }
          })
          .catch(console.log);

        startOtpListener(message => {
          console.log('📨 SMS Received:', message);
          const otpMatch = message.match(/\d{6}/); // Extract 6-digit OTP
          console.log('📨 SMS otpMatch:', otpMatch);
          if (otpMatch) {
            //setOtp(otpMatch[0]);
            // inputRef.current?.blur();
            //Alert.alert('OTP Received', otpMatch[0]);
            handleOtpAutoFill(otpMatch[0]);
          }
        });

        // Step 3: Clean up on unmount
        return () => {
          removeListener();
        };
      } catch (error) {
        console.error('Error setting up SMS listener:', error);
      }
    };
    startSmsListener();
  }, []);

  // Start SMS listener for OTP auto-detection
  // useEffect(() => {
  //   const startSmsListener = async () => {
  //     try {
  //       // Request SMS permission if on Android
  //       if (Platform.OS === 'android') {
  //         const granted = await PermissionsAndroid.requestMultiple([
  //           PermissionsAndroid.PERMISSIONS.READ_SMS,
  //           PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
  //         ]);

  //         const allGranted =
  //           granted[PermissionsAndroid.PERMISSIONS.READ_SMS] ===
  //             PermissionsAndroid.RESULTS.GRANTED &&
  //           granted[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] ===
  //             PermissionsAndroid.RESULTS.GRANTED;

  //         if (!allGranted) {
  //           console.warn('SMS permissions not granted');
  //           return;
  //         }
  //       }

  //       getHash()
  //         .then(hash => {
  //           console.log('Athi Native App Hash: here ', hash);
  //           if (Array.isArray(hash)) {
  //             console.log('App Hash:', hash[0]); // Use hash[0] only
  //           }
  //         })
  //         .catch(console.log);

  //       startOtpListener(message => {
  //         console.log('📨 SMS Received:', message);
  //         const otpMatch = message.match(/\d{6}/); // Extract 6-digit OTP
  //         console.log('📨 SMS otpMatch:', otpMatch);
  //         if (otpMatch) {
  //           //setOtp(otpMatch[0]);
  //           // inputRef.current?.blur();
  //           //Alert.alert('OTP Received', otpMatch[0]);
  //           handleOtpAutoFill(otpMatch[0]);
  //         }
  //       });

  //       // Step 3: Clean up on unmount
  //       //return () => {
  //       removeListener();
  //       //};
  //       // const registered = await SmsRetriever.startSmsRetriever();
  //       // console.log('SMS Retriever registered:', registered);

  //       // if (registered) {
  //       //   SmsRetriever.addSmsListener(event => {
  //       //     console.log('SMS Received event:', event);

  //       //     const message = event?.message;
  //       //     if (!message) {
  //       //       console.warn('No message received in SMS event');
  //       //       return;
  //       //     }

  //       //     console.log('Full SMS message:', message);

  //       //     // Extract OTP from message
  //       //     const otpMatch = message.match(/\b\d{6}\b/);
  //       //     if (otpMatch) {
  //       //       const extractedOtp = otpMatch[0];
  //       //       console.log('Extracted OTP:', extractedOtp);

  //       //       // Auto-fill the OTP
  //       //       handleOtpAutoFill(extractedOtp);
  //       //     }

  //       //     // Remove the listener after processing
  //       //     SmsRetriever.removeSmsListener();
  //       //   });
  //       // }
  //     } catch (error) {
  //       console.error('Error setting up SMS listener:', error);
  //     }
  //   };

  //   startSmsListener();

  //   // Clean up the listener when component unmounts
  //   return () => {
  //     try {
  //       SmsRetriever.removeSmsListener();
  //     } catch (error) {
  //       console.error('Error removing SMS listener:', error);
  //     }
  //   };
  // }, []);

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    if (/^\d$/.test(value) || value === '') {
      const updated = [...otp];
      updated[index] = value;
      setOtp(updated);
      if (value && index < 5) {
        const nextInput = index + 1;
        otpRefs.current[nextInput]?.focus();
      } else if (value.length === 0) {
        // Changes
        const nextInput = index - 1;
        otpRefs.current[nextInput]?.focus();
      }
    }
  };

  // Handle auto-filled OTP
  const handleOtpAutoFill = (otpCode: string) => {
    console.log('Auto-filling OTP:', otpCode);

    if (!otpCode || otpCode.length !== 6) {
      console.warn('Invalid OTP format for auto-fill:', otpCode);
      return;
    }

    // Split the OTP into an array and update state
    const otpArray = otpCode.split('');
    setOtp(otpArray);

    // Fill each input box with the corresponding digit
    otpArray.forEach((digit, index) => {
      if (otpRefs.current[index]) {
        otpRefs.current[index]?.setNativeProps({text: digit});
      }
    });

    // Auto-focus last input
    if (otpRefs.current[5]) {
      otpRefs.current[5]?.focus();
    }

    // Auto-verify after a short delay to allow UI to update
    setTimeout(() => {
      handleVerify(otpCode);
    }, 500);
  };

  // Verify OTP
  const handleVerify = async (autoOtp?: string | React.SyntheticEvent) => {
    console.log('handleVerify called with:', autoOtp);

    // Make sure we have a string OTP
    let finalOtp: string;

    if (typeof autoOtp === 'string') {
      // If autoOtp is provided as a string, use it
      finalOtp = autoOtp;
    } else {
      // Otherwise use the OTP from the input fields
      finalOtp = otp.join('');
    }

    console.log('finalOtp to verify:', finalOtp);

    if (!phoneNumber || !finalOtp) {
      ToastAndroid.show('Error, Please enter the OTP',ToastAndroid.SHORT);
      return;
    }

    try {
      const resultOtp = await dispatchOtp(
        verifyOtp({ phone: phoneNumber, otp: finalOtp })
      ).unwrap();

      console.log('verifyOtp result:', resultOtp);
      setIsVerified(true);
      setShowSuccessModal(false);
      setErrorMessage(''); // Clear error on success
      await api.markOtpVerified();

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        }),
      );
    } catch (error) {
      console.error('sendOtp error:', error);
      setErrorMessage('You have entered wrong OTP');
    } 
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      setIsResending(true);
        const result = await dispatchOtp(sendOtp({ phone: phoneNumber, isResending }))
        .unwrap();
  
      console.log('[RESEND] sendOtp result:', result);
  
      // navigation.navigate('VerifyNumber', { phoneNumber });
      setTimer(30);
    } catch (error) {
      console.error('Resend OTP failed:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backContainer}>
        <TouchableOpacity
          onPress={() => {
            console.log('Back button pressed');
            navigation.goBack();
          }}
          style={styles.backBtn}>
          <SimpleIcon source={imagePaths.Back_Arrow_icon}  />
        </TouchableOpacity>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify Number</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to your mobile number.
        </Text>

        <Image
          source={imagePaths.Illustration_icon}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={{...styles.supportText}}>Enter Code</Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="numeric"
              value={digit}
              returnKeyType="done"
              onSubmitEditing={() => handleVerify()}
              onChangeText={value => handleChange(index, value)}
              ref={ref => {
                otpRefs.current[index] = ref;
              }}
              onKeyPress={({nativeEvent}) => {
                if (
                  nativeEvent.key === 'Backspace' &&
                  otp[index] === '' &&
                  index > 0
                ) {
                  otpRefs.current[index - 1]?.focus();
                }
              }}
            />
          ))}
        </View>
        {errorMessage !== '' && (
          <Text style={styles.errorText}>{errorMessage}</Text>
        )}

        {isVerified && <Text style={styles.successText}>✅ Success!</Text>}

        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <Text style={styles.resendText}>Resend Code in {timer} sec.</Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={isResending}>
              <Text style={styles.resendLink}>
                {isResending ? 'Sending...' : 'Resend'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.supportText}>Still not working?</Text>
        <TouchableOpacity onPress={() => Linking.openURL('tel:8111 075 075')}>
          <Text style={styles.contactSupport}>Contact Support.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => handleVerify()}>
          <Text style={styles.continueText}>Verify OTP</Text>
        </TouchableOpacity>
      </View>
      </TouchableWithoutFeedback>
      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        message="OTP verified successfully!"
        onClose={async () => {
          setShowSuccessModal(false);
          await api.markOtpVerified();

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Main'}],
            }),
          );
        }}
      />
    </View>
  );
};

export default VerifyNumberScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(6.4),
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backContainer: {},
  backBtn: {
    width: wp(5.3),
    height: wp(5.3),
    justifyContent: 'center',
  },

  title: {
    fontSize: sp(20),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    marginBottom: hp(1),
    color: Colors.black,
  },
  subtitle: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: hp(2.5),
  },
  image: {
    width: wp(32),
    height: wp(32),
    marginBottom: hp(3),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: hp(1.2),
  },
  otpInput: {
    borderWidth: 1,
    borderColor: Colors.greyBackground,
    borderRadius: wp(2.1),
    padding: wp(2.5),
    margin: wp(1.3),
    width: wp(10.5),
    textAlign: 'center',
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
  },
  successText: {
    color: Colors.primary,
    marginBottom: hp(1.2),
  },
  resendContainer: {
    marginTop: hp(2.5),
    alignItems: 'center',
    marginBottom: hp(2.5),
  },
  resendText: {
    color: Colors.black,
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
  },
  resendLink: {
    color: Colors.primary,
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
  },
  supportText: {
    color: Colors.black,
  },
  contactSupport: {
    color: Colors.info,
    fontWeight: 'bold',
    marginBottom: hp(2.5),
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(21),
    borderRadius: wp(2.5),
  },
  continueText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
  },
  errorText: {
    color: 'red',
    fontSize: sp(13),
    marginBottom: hp(1),
    textAlign: 'center',
  },
});
