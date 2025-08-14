import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  Platform,
  NativeModules,
  Alert,
  Linking,
  Keyboard,
  Image
} from 'react-native';
import ApiContext from '../../context/ApiContext';
import SmsRetriever from 'react-native-sms-retriever';
import {RootStackParamList} from '../../types';
import {FontFamily} from '../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import {imagePaths} from '../../utils/constants/imagePaths';
import Colors from '../../utils/constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import type {AppDispatch} from '../../redux/store';
import {useDispatch} from 'react-redux';
import {sendOtp} from '../../redux/Features/OtpGeneration/otpThunk';
import {sendOtpAPI} from '../../redux/Features/OtpGeneration/otpApi';
import { setGuestState } from '../../redux/userSlice';

interface PhoneInputScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  style?: ViewStyle;
  phoneNumber: string;
  setPhoneNumber: (text: string) => void;
  isAutoFilled: boolean;
  setIsAutoFilled: (value: boolean) => void;
  onFocusRequestPermission?: () => void; // ← Add this line
}

const PhoneInputScreen: React.FC<PhoneInputScreenProps> = ({
  navigation,
  style,
  phoneNumber,
  setPhoneNumber,
  isAutoFilled,
  setIsAutoFilled,
  onFocusRequestPermission,
}) => {
  const apiContext = useContext(ApiContext);

  if (!apiContext) {
    throw new Error('PhoneInputScreen must be used within an ApiProvider');
  }

  const {api} = apiContext;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [inputError, setInputError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isValid = /^[0-9]{10}$/.test(phoneNumber);
  const dispatchOtp = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isValid && isAutoFilled) {
      handleContinue();
      setIsAutoFilled(false);
    }
  }, [phoneNumber, isAutoFilled]);

  // Start SMS retriever to get phone number
  useEffect(() => {
    const startSmsRetriever = async () => {
      try {
        const registered = await SmsRetriever.startSmsRetriever();
        console.log('SMS Retriever registered:', registered);
      } catch (error) {
        console.error('Error registering SMS Retriever:', error);
      }
    };

    startSmsRetriever();
  }, []);

  useEffect(() => {
    const getHashCode = async () => {
      console.log(NativeModules.RNSmsRetrieverModule);
    };
    getHashCode();
  }, []);

  useEffect(() => {
    console.log('isKeyboardVisible ::');
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleContinue = async (): Promise<void> => {
    if (phoneNumber.length !== 10) {
      setInputError(true);
      setErrorMessage('Please enter a valid 10-digit number');
      return;
    }
    if (isValid) {
      console.log('[HANDLE CONTINUE] Requesting OTP...');
      setIsLoading(true);
    dispatchOtp(setGuestState(false));

      try {
        // const generatedOtp = await api.sendOtpSms(phoneNumber, false);
        // console.log('[HANDLE CONTINUE] OTP sent:', generatedOtp);
        console.log('[HANDLE CONTINUE] Sending OTP for:', phoneNumber);

        const result = await dispatchOtp(
          sendOtp({phone: phoneNumber, isResending: false}),
        ).unwrap();

        console.log('[HANDLE CONTINUE] sendOtp success result:', result);

        if (result) {
          console.log('Navigation to VerifyNumber screen');
          navigation.navigate('VerifyNumber', {phoneNumber});
        }

        // dispatchOtp(sendOtp({phone: phoneNumber, isResending: false}))
        // .unwrap()
        // .then(result => {
        //
        // console.log('sendOtp result:', result);
        // navigation.navigate('VerifyNumber', {phoneNumber});
        // })
        // .catch(error => {
        // console.error('sendOtp error:', error);
        // });

        // if (generatedOtp) {
        //   navigation.navigate('VerifyNumber', {phoneNumber});
        // }
      } catch (error) {
        console.error('[HANDLE CONTINUE] Failed to send OTP:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('Please enter a valid 10-digit mobile number.');
    }
  };

  const handleOpenTerms = () => {
    console.log('handleOpenTerms called ()');
    navigation.navigate('TermsAndConditionsScreen');
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.phoneContainer,
          {
            borderWidth: inputError ? 1.5 : 0,
            borderColor: inputError ? 'red' : 'transparent',
          },
        ]}>
   <Image source={imagePaths.Flag_icon} style={{width: wp(7), height: wp(7), marginRight: wp(2)  }} />
        <Text style={styles.countryCode}>+91</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your mobile number"
          placeholderTextColor="#aaa"
          keyboardType="phone-pad"
          returnKeyType="done"
          maxLength={10}
          value={phoneNumber}
          onSubmitEditing={() => {
            if (!isValid) {
              setInputError(true);
              setErrorMessage('Please enter a valid 10-digit number');
            } else {
              setInputError(false);
              setErrorMessage('');
              handleContinue();
            }
          }}
          onChangeText={(text: string) => {
            const sanitized = text.replace(/[^0-9]/g, '');
            setPhoneNumber(sanitized);
            setIsAutoFilled(false);
            if (inputError) {
              setInputError(false);
              setErrorMessage('');
            }
          }}
          onFocus={() => {
            if (onFocusRequestPermission) {
              onFocusRequestPermission();
            }
          }}
        />
      </View>
      {inputError && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      <View style={{top: wp(4)}}>
        <Text style={styles.terms}>
          By Signing up you agree to{'\n'}
          <Text style={styles.link} onPress={handleOpenTerms}>
            Terms and Conditions
          </Text>
        </Text>
      </View>
      {!isKeyboardVisible && (
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  isValid && !isLoading
                    ? Colors.primary
                    : Colors.greyBackground,
              },
            ]}
            onPress={handleContinue}
            disabled={!isValid || isLoading}>
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default PhoneInputScreen;

const styles = StyleSheet.create({
  container: {
    height: '50%',
    width: '75%',
    // backgroundColor: "red"
  },
  phoneContainerGradient: {
    width: '100%',
    borderRadius: wp(5),
    padding: 2, // Thickness of the border
    marginBottom: hp(1.5),
  },
  phoneContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: wp(5),
    borderWidth: 0, // Remove border, handled by gradient
    paddingHorizontal: wp(1.5),
    paddingVertical: hp(0.6),
  },
  flag: {
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
    marginRight: wp(1.5),
  },
  countryCode: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '500',
    marginRight: wp(1.5),
  },
  input: {
    flex: 1,
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
  },
  terms: {
    textAlign: 'center',
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
    marginBottom: hp(12),
  },
  link: {
    textDecorationLine: 'underline',
    color: Colors.black,
    fontWeight: 'bold',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: hp(0),
    left: wp(5.5),
    right: wp(5.5),
    alignItems: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: hp(1.6),
    borderRadius: wp(2.5),
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: sp(12),
    marginTop: hp(0.5),
    marginLeft: wp(2),
  },
});

function alert(arg0: string) {
  throw new Error('Function not implemented.');
}
