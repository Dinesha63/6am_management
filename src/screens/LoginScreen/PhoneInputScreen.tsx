import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  PermissionsAndroid,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/AppNavigator';
import {imageList} from '../../constants/colors';
import SimSelectionModal from './SimSelectionModal';
import PhoneNumberBottomSheet from './PhoneNumberBottomSheet';
import SimCardsManager from 'react-native-sim-cards-manager';
import DeliveryBoyBottomSheet from './DeliveryBoyBottomSheet';
import {useAppDispatch} from '../../redux/hooks';
import {fetchEmployeeByIdApi} from '../../redux/thunks/employeeApiThunks';
import {storeEmployeeData, storeEmployeeStores} from '../../utils/storage';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rs,
} from '../../constants/ResponsiveScreen';

const {width} = Dimensions.get('window');

interface SimCard {
  phoneNumber: string;
  displayName?: string;
  carrierName?: string;
  slotIndex?: number;
}
type PhoneNumbers = {
  primary: string;
  secondary: string;
};
const getPhoneNumber = async (): Promise<PhoneNumbers> => {
  console.log('[PhoneNumber] Starting phone number retrieval...');

  try {
    if (Platform.OS === 'android') {
      console.log('[PhoneNumber] Android platform detected');

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      );

      console.log(`[PhoneNumber] Permission status: ${granted}`);

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('[PhoneNumber] Permission granted, fetching SIM cards...');
        const simCards: SimCard[] = await SimCardsManager.getSimCards();

        console.log(
          '[PhoneNumber] Retrieved SIM cards:',
          JSON.stringify(simCards, null, 2),
        );

        if (simCards.length > 0) {
          if (simCards.length > 0) {
            const primarySim = simCards[0];
            const secondarySim = simCards[1];

            return {
              primary: primarySim?.phoneNumber || '',
              secondary: secondarySim?.phoneNumber || '',
            };
          } else {
            console.warn('[PhoneNumber] SIM exists but phone number is empty');
            throw new Error('Phone number not available on SIM');
          }
        } else {
          console.log('[PhoneNumber] No SIM cards found');
          throw new Error('No SIM card detected');
        }
      } else {
        console.warn('[PhoneNumber] Permission denied by user');
        throw new Error('Permission denied');
      }
    } else {
      console.log('[PhoneNumber] iOS platform detected - not supported');
      throw new Error('Phone number access not supported on iOS');
    }
  } catch (error) {
    console.error('[PhoneNumber] Error:', error);
    throw error;
  }
};

const PhoneNumberScreen = () => {
  const dispatch = useAppDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentIndex, setCurrentIndex] = useState(1);
  const scrollRef = useRef<ScrollView>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [simModalVisible, setSimModalVisible] = useState(false);
  const [firstNumber, setFirstNumber] = useState<string | null>(null);
  const [secondNumber, setSecondNumber] = useState<string | null>(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(true);
  const [userExists, setUserExists] = useState<boolean>(false);
  const [hasFocused, setHasFocused] = useState<boolean>(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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

  const loopedImages = [
    imageList[imageList.length - 1],
    ...imageList,
    imageList[0],
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      scrollRef.current?.scrollTo({x: nextIndex * width, animated: true});
      setCurrentIndex(nextIndex);
    }, 2500);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    let offsetX = e.nativeEvent.contentOffset.x;
    let index = Math.round(offsetX / width);

    if (index === 0) {
      scrollRef.current?.scrollTo({
        x: imageList.length * width,
        animated: false,
      });
      setCurrentIndex(imageList.length);
    } else if (index === loopedImages.length - 1) {
      scrollRef.current?.scrollTo({x: width, animated: false});
      setCurrentIndex(1);
    } else {
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({x: width, animated: false});
    }, 0);
  }, []);

  // useEffect(() => {
  //   let isMounted = true;

  //   const fetchPhoneNumber = async () => {
  //     try {
  //       const number = await getPhoneNumber();
  //       console.log(number, "getNoekf")
  //       if (isMounted) {
  //         setPhoneNumber(number.primary);
  //         setFirstNumber(number.primary)
  //         setSecondNumber(number.secondary)
  //         setError(null);
  //       }
  //     } catch (err) {
  //       if (isMounted) {
  //         setError((err as Error).message);
  //         setPhoneNumber("");
  //       }
  //     } finally {
  //       if (isMounted) setIsLoading(false);
  //     }
  //   };

  //   fetchPhoneNumber();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);
  useEffect(() => {
    let isMounted = true;

    const fetchPhoneNumber = async () => {
      try {
        const number = await getPhoneNumber();
        if (isMounted) {
          setFirstNumber(number.primary);
          setSecondNumber(number.secondary);
          setBottomSheetVisible(false);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (isNewUser) fetchPhoneNumber();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!firstNumber) {
      console.warn('SIM number not available. Manual entry required.');
    }
  }, [firstNumber]);

  // const handleSimSelect = (number: string | null) => {
  //   setSimModalVisible(false);
  //   if (number) {
  //     const digits = number.replace(/[^\d+]/g, '');
  //     const cleanNumber = digits.startsWith('+91') ? digits.slice(3) :
  //       digits.startsWith('91') ? digits.slice(2) :
  //         digits;
  //     setPhoneNumber(cleanNumber.slice(0, 10));
  //   }
  // };
  const handleSimSelect = (number: string | null) => {
    setBottomSheetVisible(false);
    if (number) {
      const digits = number.replace(/[^\d+]/g, '');
      const cleanNumber = digits.startsWith('+91')
        ? digits.slice(3)
        : digits.startsWith('91')
        ? digits.slice(2)
        : digits;
      const finalNumber = cleanNumber.slice(0, 10);
      setPhoneNumber(finalNumber);
    }
  };

  // const handleContinue = () => {
  //   dispatch(fetchEmployeeByIdApi(phoneNumber))
  //   return
  //   if (phoneNumber.length === 10) {
  //     navigation.replace('Map');
  //   }
  // };
  const handleContinue = async () => {
    if (phoneNumber.length !== 10) return;

    setIsLoading(true);

    try {
      const res = await dispatch(fetchEmployeeByIdApi(phoneNumber)).unwrap();

      if (res && res?.data) {
        const employee = res.data;
        await storeEmployeeData(employee);
        await storeEmployeeStores(res.data.employeeStores);
        setUserExists(true);
        navigation.replace('Map');
      } else {
        setUserExists(false);
        setBottomSheetVisible(false);
        setSimModalVisible(false);
        setTimeout(() => {
          setIsNewUser(false);
        }, 300);
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      setUserExists(false);
      setTimeout(() => {
        setIsNewUser(false);
      }, 300);
    } finally {
      setIsLoading(false);
    }
  };

  // console.log('phoneNumber',phoneNumber)
  return (
    <SafeAreaView style={styles.container}>
      <View style={{...styles.carouselContainer}}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={{width}}
          onMomentumScrollEnd={onMomentumScrollEnd}>
          {loopedImages.map((item, idx) => (
            <View key={idx} style={styles.slide}>
              <Image
                source={item.image}
                style={styles.slideImage}
                resizeMode="contain"
              />
              <Text style={styles.slideCaption}>{item.caption}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}> */}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            padding: 20,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Text
              style={{...styles.title, fontSize: isKeyboardVisible ? 16 : 24}}>
              Enter Your Phone Number
            </Text>

            <View style={styles.phoneContainer}>
              <Text style={styles.flag}>🇮🇳</Text>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter mobile number"
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
                maxLength={10}
                value={phoneNumber}
                onChangeText={text => {
                  const cleaned = text.replace(/[^0-9]/g, '');
                  setPhoneNumber(cleaned);
                }}
                onFocus={() => {
                  if (!hasFocused && !phoneNumber) {
                    setBottomSheetVisible(true);
                    setHasFocused(true);
                    Keyboard.dismiss();
                  }
                }}
              />
            </View>

            <Text style={styles.terms}>
              Welcome to the 6 AM community! We're glad to have you here.
            </Text>

            {!isKeyboardVisible && (
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      phoneNumber.length === 10 ? '#36A546' : '#ccc',
                  },
                ]}
                onPress={handleContinue}
                disabled={phoneNumber.length !== 10 || isLoading}
                activeOpacity={0.8}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Continue</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* </KeyboardAvoidingView> */}

      {/* <SimSelectionModal
        visible={simModalVisible}
        onClose={() => setSimModalVisible(false)}
        onSelect={handleSimSelect}
        firstNumber={firstNumber}
        secondNumber={secondNumber}
      /> */}
      <PhoneNumberBottomSheet
        visible={bottomSheetVisible}
        onClose={() => {
          setBottomSheetVisible(false);
          setHasFocused(true);
        }}
        phoneNumbers={[firstNumber, secondNumber].filter(Boolean) as string[]}
        onSelectNumber={number => {
          // setBottomSheetVisible(true);
          handleSimSelect(number);
          setBottomSheetVisible(false);
          setHasFocused(true);
        }}
      />
      <DeliveryBoyBottomSheet
        visible={!userExists && !isNewUser}
        onClose={() => setIsNewUser(true)}
        phoneNumber={phoneNumber}
      />
      {/* {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#36A546" />
          <Text style={styles.loadingText}>Please wait...</Text>
        </View>
      )} */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: rs(15),
  },
  carouselContainer: {
    width: '100%',
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    padding: rs(10),
  },
  slideImage: {
    width: width * 0.8,
    height: hp(25),
    borderRadius: rs(20),
    marginBottom: rs(18),
    alignSelf: 'center',
  },
  slideCaption: {
    fontSize: sp(20),
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: wp(5),
    fontWeight: 'bold',
    marginBottom: rs(18),
  },
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: rs(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: sp(24),
    fontWeight: 'bold',
    marginBottom: rs(10),
    color: '#000',
    textAlign: 'center',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: rs(20),
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: rs(10),
    paddingVertical: rs(12),
    width: '100%',
    marginBottom: rs(20),
  },
  flag: {
    fontSize: sp(18),
    marginRight: rs(6),
  },
  countryCode: {
    fontSize: sp(16),
    fontWeight: '500',
    marginRight: rs(6),
    color: '#000',
  },
  input: {
    flex: 1,
    fontSize: sp(16),
    color: '#000',
    padding: 0,
  },
  terms: {
    textAlign: 'center',
    fontSize: sp(12),
    color: '#555',
    marginBottom: rs(20),
  },
  linkText: {
    color: '#555',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    paddingVertical: rs(14),
    borderRadius: rs(10),
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: sp(16),
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: sp(18),
    marginTop: rs(10),
  },
});


export default PhoneNumberScreen;
