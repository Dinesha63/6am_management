import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {FontFamily} from '../../utils/constant';
import SimpleIcon from '../../components/SimpleIcon';
import {imagePaths} from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import {
  CommonActions,
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { paymentSuccessBannerSelector, paymentSuccessBannerLoadingSelector } from '../../redux/Features/Promotion/promotionSlice';
import { fetchPaymentSuccessBanner } from '../../redux/Features/Promotion/promotionThunk';
import type { AppDispatch } from '../../redux/store';
import { RootStackParamList } from '../../types';
import { Routes } from '../../navigation/routes';



const SubscriptionSuccessScreen = () => {


  //const navigation = useNavigation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  const dispatch = useDispatch<AppDispatch>();
  
  // Banner selectors
  const paymentSuccessBanner = useSelector(paymentSuccessBannerSelector);
  const paymentSuccessBannerLoading = useSelector(paymentSuccessBannerLoadingSelector);
  
  // Fetch payment success banner on component mount
  useEffect(() => {
    dispatch(fetchPaymentSuccessBanner());
  }, [dispatch]);

  const gotoSubscription = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: Routes.Main}],
      }),
    );
  };
  const gotoMain = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: Routes.List}],
      }),
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          {/* Base tick icon */}
          <SimpleIcon source={imagePaths.tick_icon} style={styles.baseIcon} />
          {/* Overlay icon */}
          <SimpleIcon
            source={imagePaths.white_tick_icon}
            style={styles.overlayIcon}
          />
        </View>

        <Text style={styles.title}>Subscription Successful!</Text>
        <Text style={styles.subtitle}>
          Your order will be delivered on time.{'\n'}Thank you!
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => gotoSubscription()}>
          <Text style={styles.primaryButtonText}>Go to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => gotoMain()}>
          <Text style={styles.secondaryButtonText}>
            Want to add more products?
          </Text>
        </TouchableOpacity>
      </View>

      {/* Payment Success Banner */}
      {paymentSuccessBanner && Array.isArray(paymentSuccessBanner) && paymentSuccessBanner.length > 0 && !paymentSuccessBannerLoading && (
        <TouchableOpacity 
          style={styles.banner}
          onPress={() => {
            // Handle banner click - you can add navigation or other actions here
            console.log('Payment Success Banner clicked:', paymentSuccessBanner[0]);
          }}
        >
          <Image 
            source={{ uri: paymentSuccessBanner[0].imageUrl }}
            style={styles.bannerImage}
            resizeMode="stretch"
          />
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default SubscriptionSuccessScreen;

const styles = StyleSheet.create({
  container: {
    paddingVertical: hp(3.5),
    paddingHorizontal: wp(6.4),
    backgroundColor: Colors.white,
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: hp(3),
    position: 'relative',
    width: wp(64),
    height: hp(24),
  },
  baseIcon: {
    height: hp(24),
    width: wp(64),
    tintColor: Colors.primary,
  },
  overlayIcon: {
    position: 'absolute',
    width: wp(16),
    height: wp(16),
    top: '56%',
    left: '36%',
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  title: {
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
    color: Colors.darkGreen,
    marginTop: hp(2),
    marginBottom: hp(1),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
    textAlign: 'center',
    marginBottom: hp(4),
    lineHeight: hp(2.5),
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(1.8),
    borderRadius: wp(2),
    width: '100%',
    marginBottom: hp(1.5),
  },
  primaryButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: Colors.lineLight,
    paddingVertical: hp(1.8),
    borderRadius: wp(2),
    width: '100%',
    marginBottom: hp(4),
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    textAlign: 'center',
  },
  banner: {
    height: hp(18),
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerText: {
    color: Colors.blackText,
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
  },
});
