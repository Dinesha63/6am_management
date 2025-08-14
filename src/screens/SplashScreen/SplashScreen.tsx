import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import SimCardsManager from 'react-native-sim-cards-manager';
import SimpleIcon from '../../components/SimpleIcon';
import {FontFamily} from '../../utils/constant';
import ApiContext from '../../context/ApiContext';
import LottieView from 'lottie-react-native';
import Colors from '../../utils/constants/colors';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import * as PermissionsUtil from '../../config/permissions';


interface SplashScreenProps {}

const SplashScreen: React.FC<SplashScreenProps> = () => {
  const apiContext = useContext(ApiContext);

  if (!apiContext) {
    throw new Error('SplashScreen must be used within an ApiProvider');
  }

  const {api} = apiContext;

  useEffect(() => {
    const timer = setTimeout(async () => {
      const hasPermission = await PermissionsUtil.requestLocationPermission();
      if (hasPermission) {
        await getLocation();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getLocation = async () => {
    await apiContext?.api
      .getCurrentLocation()
      .then(async location => {
        await apiContext.api.getPlusCode(location?.latitude || 0, location?.longitude || 0);
      })
      .catch(async error => {
        console.error('Error getting current location:', error);
      });
  };


 return (
  <View style={styles.container}>
    <View style={styles.centerSection}>
      <LottieView
        source={require('../../assets/Animation/6amAnime2.json')}
        autoPlay
        loop={false}
        speed={0.8}
        style={styles.centerImage}
      />
    </View>
    <View style={styles.textSection}>
      <Image
        source={require('../../assets/images/freshah-directah.png')}
        style={styles.textImage}
      />
    </View>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.greyBackground,
  },
  centerImage: {
    width: wp(44),
    height: wp(44),
    bottom: hp(1.25),
    resizeMode: 'contain',
  },
  textImage: {
    width: wp(46.5),
    height: wp(46.5),
    bottom: hp(1.25),
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerSection: {
  flex: 15,
  justifyContent: 'center',
  alignItems: 'center',
},
textSection: {
  flex: 5,
  justifyContent: 'center',
  alignItems: 'center',
},
  modalBox: {
    backgroundColor: Colors.white,
    padding: wp(5.5), 
    borderRadius: wp(4),
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
    marginBottom: hp(2.5),
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(1),
  },
  numberText: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    marginRight: wp(2.5),
  },
  callCircle: {
    backgroundColor: Colors.primary,
    width: wp(10.5),
    height: wp(10.5),
    borderRadius: wp(5.25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    marginTop: hp(2.5),
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
    backgroundColor: Colors.primary,
    borderRadius: wp(3),
  },
  closeText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: sp(14),
  },
});

export default SplashScreen;