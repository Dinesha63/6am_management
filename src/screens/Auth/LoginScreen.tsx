import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ToastAndroid,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {FontFamily, imageList} from '../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import LinearGradient from 'react-native-linear-gradient';

import ApiContext from '../../context/ApiContext';
import {setUserRole, setUserAuthenticated} from '../../redux/userSlice';
import {loginUser} from '../../redux/Features/Auth/authThunk';
import {useAppDispatch} from '../../hooks/useAppDispatch';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const apiContext = useContext(ApiContext);
  const dispatch = useAppDispatch();

  if (!apiContext) {
    throw new Error('LoginScreen must be used within an ApiProvider');
  }
  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % imageList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const validateInputs = () => {
    let isValid = true;
    setUsernameError('');
    setPasswordError('');

    if (!username.trim()) {
      setUsernameError('Username is required');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      let payload = {username, password};
      const result: any = await dispatch(loginUser(payload));

      console.log('Login API result:', result);

      if (result?.payload?.data?.isSuccess) {
        const {storeCode} = result.payload.data;

        let authenticatedUser: 'superAdmin' | 'admin' | null = null;

        if (!storeCode) {
          authenticatedUser = 'superAdmin';
        } else {
          authenticatedUser = 'admin';
        }

        if (authenticatedUser) {
          await AsyncStorage.setItem("user", JSON.stringify({
            role: authenticatedUser,
            isAuthenticated: true,
            storeCode: storeCode || null,
          }));
          dispatch(setUserRole(authenticatedUser));
          dispatch(setUserAuthenticated(true));

          if (Platform.OS === 'android') {
            ToastAndroid.show(
              `Welcome ${authenticatedUser}!`,
              ToastAndroid.SHORT,
            );
          } else {
            ToastAndroid.show(
              `Login Successful, Welcome ${authenticatedUser}!`,
              ToastAndroid.SHORT,
            );
          }

          navigation.navigate('Main', {});
          return;
        }
      }

      ToastAndroid.show(
        'Login Failed: Invalid username or password. Please try again.',
        ToastAndroid.SHORT,
      );
    } catch (error) {
      console.error('Login error:', error);
      ToastAndroid.show(
        'Error: An error occurred during login. Please try again.',
        ToastAndroid.SHORT,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient
        colors={[Colors.primary, Colors.background]}
        start={{x: 0, y: 0}}
        end={{x: 0.6, y: 1}}
        style={{flex: 1}}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Top Half - Carousel */}
          <View style={styles.topHalf}>
            <Image
              source={imageList[currentIndex].image}
              style={styles.carouselImage}
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

          {/* Bottom Half - Login Form */}
          <View style={styles.bottomHalf}>
            <Text style={styles.title}>Welcome to 6am!</Text>
            <Text style={styles.subtitle}>Admin Login</Text>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Username</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                    returnKeyType="done"
                    onFocus={() => {
                      // Auto scroll when username field is focused to show form area
                      setTimeout(() => {
                        scrollViewRef.current?.scrollTo({y: hp(25), animated: true});
                      }, 100);
                    }}
                    onSubmitEditing={() => {
                        // Trigger login when Enter is pressed on username field
                        if (username && password) {
                          handleLogin();
                        } else {
                          // Focus password field if password is empty
                          passwordInputRef.current?.focus();
                        }
                      }}
                  />
                </View>
                {usernameError ? (
                  <Text style={styles.errorText}>{usernameError}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    ref={passwordInputRef}
                    style={styles.input}
                    placeholder="Enter password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                    returnKeyType="done"
                    onFocus={() => {
                      // Auto scroll when password field is focused to ensure it's visible
                      setTimeout(() => {
                        scrollViewRef.current?.scrollTo({y: hp(30), animated: true});
                      }, 100);
                    }}
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}>
                    <Text style={styles.eyeIconText}>
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  {
                    backgroundColor:
                      username && password && !isLoading
                        ? Colors.primary
                        : Colors.greyBackground,
                  },
                ]}
                onPress={handleLogin}
                disabled={!username || !password || isLoading}>
                {isLoading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  topHalf: {
    flex: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: hp(5),
  },
  carouselImage: {
    width: wp(80),
    height: hp(34),
    resizeMode: 'contain',
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
  captionText: {
    textAlign: 'center',
    marginTop: hp(1.2),
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
  },
  bottomHalf: {
    flex: 2,
    backgroundColor: Colors.background,
    borderTopEndRadius: wp(12),
    borderTopLeftRadius: wp(12),
    paddingHorizontal: wp(5),
    paddingTop: hp(3),
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: hp(0.25)},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  title: {
    fontSize: sp(22),
    fontFamily: FontFamily.BOLD,
    color: Colors.black,
    marginBottom: hp(1),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
    textAlign: 'center',
    marginBottom: hp(2),
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: hp(2),
  },
  inputLabel: {
    fontSize: sp(14),
    fontFamily: FontFamily.MEDIUM,
    color: Colors.black,
    marginBottom: hp(0.5),
    marginLeft: wp(2),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.greyBackground,
    borderRadius: wp(2.5),
    backgroundColor: Colors.white,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
  },
  input: {
    flex: 1,
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
  },
  eyeIcon: {
    padding: wp(2),
  },
  eyeIconText: {
    fontSize: sp(18),
  },
  errorText: {
    color: 'red',
    fontSize: sp(11),
    marginTop: hp(0.5),
    marginLeft: wp(1),
  },
  loginButton: {
    paddingVertical: hp(1.8),
    borderRadius: wp(2.5),
    alignItems: 'center',
    marginTop: hp(2),
    // marginBottom: hp(4),
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: sp(18),
    fontFamily: FontFamily.BOLD,
  },

});
