import React, {useState, useContext, useEffect} from 'react';
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
import {imagePaths} from '../../utils/constants/imagePaths';
import Colors from '../../utils/constants/colors';
import LinearGradient from 'react-native-linear-gradient';

import ApiContext from '../../context/ApiContext';
import {useDispatch} from 'react-redux';
import {setUserRole, setUserAuthenticated} from '../../redux/userSlice';

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

  const apiContext = useContext(ApiContext);
  const dispatch = useDispatch();

  if (!apiContext) {
    throw new Error('LoginScreen must be used within an ApiProvider');
  }

  const {api} = apiContext;

  // Mock admin credentials
  const adminCredentials = {
    superAdmin: {
      username: 'superadmin',
      password: 'superadmin123',
      role: 'superAdmin' as const,
    },
    admin: {
      username: 'admin',
      password: 'admin123',
      role: 'admin' as const,
    },
  };

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
      let authenticatedUser = null;

      if (
        username.trim() === adminCredentials.superAdmin.username &&
        password.trim() === adminCredentials.superAdmin.password
      ) {
        authenticatedUser = adminCredentials.superAdmin;
      } else if (
        username.trim() === adminCredentials.admin.username &&
        password.trim() === adminCredentials.admin.password
      ) {
        authenticatedUser = adminCredentials.admin;
      }

      if (authenticatedUser) {
        dispatch(setUserRole(authenticatedUser.role));
        dispatch(setUserAuthenticated(true));

        if (Platform.OS === 'android') {
          ToastAndroid.show( `Welcome ${authenticatedUser.role}!`,ToastAndroid.SHORT,);
        } else {
          ToastAndroid.show(`Login Successful, Welcome ${authenticatedUser.role}!`,ToastAndroid.SHORT);
        }

        navigation.navigate('Main' as any);
      } else {
        ToastAndroid.show(
          'Login Failed: Invalid username or password. Please try again.', ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show('Error:An error occurred during login. Please try again.',  ToastAndroid.SHORT );
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
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}>
          
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
                    style={styles.input}
                    placeholder="Enter password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
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

              <View style={styles.demoContainer}>
                <Text style={styles.demoTitle}>Demo Credentials:</Text>
                <View style={styles.demoItem}>
                  <Text style={styles.demoLabel}>Super Admin:</Text>
                  <Text style={styles.demoCredential}>
                    {adminCredentials.superAdmin.username} / {adminCredentials.superAdmin.password}
                  </Text>
                </View>
                <View style={styles.demoItem}>
                  <Text style={styles.demoLabel}>Admin:</Text>
                  <Text style={styles.demoCredential}>
                    {adminCredentials.admin.username} / {adminCredentials.admin.password}
                  </Text>
                </View>
              </View>
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
    flex: 5,
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
    fontSize: sp(28),
    fontFamily: FontFamily.BOLD,
    color: Colors.black,
    marginBottom: hp(1),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
    textAlign: 'center',
    marginBottom: hp(3),
  },
  formContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: hp(2),
  },
  inputLabel: {
    fontSize: sp(16),
    fontFamily: FontFamily.MEDIUM,
    color: Colors.black,
    marginBottom: hp(1),
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
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
  },
  eyeIcon: {
    padding: wp(1),
  },
  eyeIconText: {
    fontSize: sp(18),
  },
  errorText: {
    color: 'red',
    fontSize: sp(12),
    marginTop: hp(0.5),
    marginLeft: wp(1),
  },
  loginButton: {
    paddingVertical: hp(1.8),
    borderRadius: wp(2.5),
    alignItems: 'center',
    marginTop: hp(2),
    marginBottom: hp(4),
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: sp(18),
    fontFamily: FontFamily.BOLD,
  },
  demoContainer: {
    backgroundColor: Colors.greyBackground,
    padding: wp(4),
    borderRadius: wp(2.5),
    marginTop: hp(2),
  },
  demoTitle: {
    fontSize: sp(16),
    fontFamily: FontFamily.MEDIUM,
    color: Colors.black,
    marginBottom: hp(1.5),
    textAlign: 'center',
  },
  demoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  demoLabel: {
    fontSize: sp(14),
    fontFamily: FontFamily.MEDIUM,
    color: Colors.black,
  },
  demoCredential: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
  },
});
