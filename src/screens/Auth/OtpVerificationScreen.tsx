import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
  Text,
  Button,
  TouchableWithoutFeedback,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import PhoneInputScreen from './PhoneInputScreen';
import ApiContext from '../../context/ApiContext';
import {height, imageList, FontFamily, COLORS} from '../../utils/constant';
import {imagePaths} from '../../utils/constants/imagePaths';
import SimCardsManager from 'react-native-sim-cards-manager';
import SimSelectionModal from './SimSelectionModal';
import {RootStackParamList} from '../../types';
import Colors from '../../utils/constants/colors.ts';
import SimpleIcon from '../../components/SimpleIcon';
import {useDispatch} from 'react-redux';
import {setGuestState} from '../../redux/userSlice.ts';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import LinearGradient from 'react-native-linear-gradient';

interface OtpVerificationScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({
  navigation,
}) => {
  const apiContext = useContext(ApiContext);

  if (!apiContext) {
    throw new Error('OtpVerificationScreen must be used within an ApiProvider');
  }

  const {api} = apiContext;

  const dispatch = useDispatch(); // Redux dispatch

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [firstNumber, setFirstNumber] = useState<string | null>(null);
  const [secondNumber, setSecondNumber] = useState<string | null>(null);
  const [isSimModalVisible, setIsSimModalVisible] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isAutoFilled, setIsAutoFilled] = useState<boolean>(false);
  const [smsVerifyPermission, setSmsVerifyPermission] =
    useState<boolean>(false);
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false),
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const requestLocationOnMount = async () => {
      const granted = await api.requestLocationPermission();
      console.log('Location permission on screen mount:', granted);
    };
    requestLocationOnMount();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % imageList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showPhoneInput) {
      handleSmsPermissionOnFocus();
    }
  }, [showPhoneInput]);

  const handleSmsPermissionOnFocus = async () => {
    try {
      const granted = await api.requestSmsPermission();
      setSmsVerifyPermission(granted);
      if (granted) {
        fetchSimNumbers();
      } else {
        console.warn('SMS permission not granted.');
      }
    } catch (error) {
      console.error('Failed to request SMS permission:', error);
    }
  };

  const fetchSimNumbers = async (): Promise<void> => {
    try {
      const permissionGranted = await api.requestSmsPermission();
      if (!permissionGranted) {
        console.warn('[SIM] Permissions not granted.');
        return;
      }
      const simCards = await SimCardsManager.getSimCards();
      const first = simCards[0]?.phoneNumber?.replace(/\D/g, '') || null;
      const second = simCards[1]?.phoneNumber?.replace(/\D/g, '') || null;

      const isValidNumber = (num: string | null): boolean =>
        Boolean(num && num.length >= 10);

      setFirstNumber(isValidNumber(first) ? first : null);
      setSecondNumber(isValidNumber(second) ? second : null);

      if (isValidNumber(first) || isValidNumber(second)) {
        setIsSimModalVisible(true);
      }
    } catch (error) {
      console.error('[SIM] Error fetching SIM info:', error);
    }
  };

  const handleSelectNumber = (number: string | null): void => {
    if (!number) {
      setPhoneNumber('');
      setIsSimModalVisible(false);
      return;
    }

    const cleanedNumber = number.replace(/\D/g, '');
    const formattedNumber = cleanedNumber.replace(/^(?:\+?91|0)?/, '');
    const finalNumber = formattedNumber.slice(-10);

    setPhoneNumber(finalNumber);
    setIsSimModalVisible(false);
    setIsAutoFilled(true);
  };

  // ✅ Handle Guest Login
  const handleGuestLogin = () => {
    dispatch(setGuestState(true));
    navigation.navigate('Main', {});
  };

  // Handle Terms and Conditions navigation
  const handleOpenTerms = () => {
    console.log('handleOpenTerms called ()');
    navigation.navigate('TermsAndConditionsScreen');
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <LinearGradient
            colors={[Colors.primary, Colors.background]}
            start={{x: 0, y: 0}}
            end={{x: 0.6, y: 1}}
            style={{flex: 1, backgroundColor: 'red'}}>
            <View style={{...styles.topHalf}}>
              {showPhoneInput ? (
                <View style={{width: '100%'}}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowPhoneInput(false);
                      setPhoneNumber(''); 
                    }}
                    style={styles.backBtn}>
                    <SimpleIcon
                      source={imagePaths.back_icon}
                      style={{...styles.backIcon,tintColor : Colors.white}} 
                      // style={{width: wp(6), height: wp(6), resizeMode: 'contain'}} 
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    // width: wp(5),
                    height: wp(9),
                    // marginLeft: wp(4),
                    // marginTop: hp(1.2),
                    // justifyContent: 'center',
                  }}></View>
              )}
              <Image
                source={imageList[currentIndex].image}
                style={{width: wp(80), height: hp(34), resizeMode: 'contain'}}
              />

              <View style={styles.carouselIndicatorContainer}>
                {imageList.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.carouselDot,
                      currentIndex === index && styles.activeDot,
                    ]}
                  />
                ))}
              </View>

              <Text style={styles.captionText}>
                {imageList[currentIndex].caption}
              </Text>
            </View>

            <View style={styles.bottomHalf}>
              <Text style={styles.welcomeText}>Welcome to 6 am!</Text>
              <Text style={styles.subText}>
                Where tradition meets Convenience!
              </Text>

              {!showPhoneInput ? (
                <View style={styles.buttonColumn}>
                  <TouchableOpacity
                    style={styles.fullWidthButton}
                    onPress={() => setShowPhoneInput(true)}>
                    <View style={styles.buttonContent}>
                      <Image source={imagePaths.Flag_icon} style={{width: wp(7), height: wp(7), marginRight: wp(2)  }} />
                      <Text style={styles.buttonText}>
                        Continue with Mobile Number
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.fullWidthButton}
                    onPress={handleGuestLogin}>
                    <Text style={styles.buttonText}>Continue as Guest</Text>
                  </TouchableOpacity>

                  {/* Terms and Conditions */}
                  <View style={styles.termsContainer}>
                    <Text style={styles.terms}>
                      By Signing up you agree to{'\n'}
                      <Text style={styles.link} onPress={handleOpenTerms}>
                        Terms and Conditions
                      </Text>
                    </Text>
                  </View>
                </View>
              ) : (
                <PhoneInputScreen
                  navigation={navigation}
                  style={{justifyContent: 'flex-start'}}
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  isAutoFilled={isAutoFilled}
                  setIsAutoFilled={setIsAutoFilled}
                />
              )}
            </View>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </ScrollView>

      {isSimModalVisible && (
        <SimSelectionModal
          visible={isSimModalVisible}
          onClose={() => setIsSimModalVisible(false)}
          onSelect={handleSelectNumber}
          firstNumber={firstNumber}
          secondNumber={secondNumber}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default OtpVerificationScreen;

const styles = StyleSheet.create({
  topHalf: {
    flex: 6,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bottomHalf: {
    flex: 4,
    // paddingHorizontal: wp(5.5),
    backgroundColor: Colors.background,
    borderTopEndRadius: wp(12),
    borderTopLeftRadius: wp(12),
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: hp(0.25)},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: sp(22),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
    // textAlign: 'center',
    marginTop: hp(3),
    color: Colors.primary,
  },
  subText: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    textAlign: 'center',
    color: Colors.black,
    paddingTop: hp(1.2),
    marginBottom: hp(2.5),
  },
  captionText: {
    textAlign: 'center',
    marginTop: hp(1.2),
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
  },
  buttonColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    gap: hp(1.5),
  },
  fullWidthButton: {
    width: '70%',
    minHeight: hp(6),
    paddingVertical: 0,
    borderRadius: wp(2.5),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.greyBackground,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: hp(1),

  },
  buttonText: {
    color: Colors.black,
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
  },
  flag: {
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
    marginRight: wp(4),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  carouselIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp(1.5),
    marginBottom: hp(0.5),
  },
  carouselDot: {
    width: wp(6.5),
    height: hp(0.6),
    borderRadius: wp(0.5),
    backgroundColor: Colors.greyBackground,
    marginHorizontal: wp(1),
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: wp(6.7),
  },
  backBtn: {
    width: wp(5),
    height: wp(5),
    marginLeft: wp(4),
    marginTop: hp(1.2),
    justifyContent: 'center',
  },
  backIcon: {
    width: '100%',
    height: '100%',
  },
  flagIcon: {
    // width: wp(5),
    // height: wp(5),
    marginRight: wp(2),
  },
  termsContainer: {
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  terms: {
    textAlign: 'center',
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
  },
  link: {
    textDecorationLine: 'underline',
    color: Colors.black,
    fontWeight: 'bold',
  },
});
