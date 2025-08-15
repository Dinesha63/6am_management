import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Colors} from '../../constants/colors';
import LottieView from 'lottie-react-native';
import {imagePath} from '../../constants/imagePath';
import {animationPath} from '../../constants/animationPath';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rs,
} from '../../constants/ResponsiveScreen';

const SplashScreen = (): React.JSX.Element => {
  return (
    <View style={{...styles.container}}>
      <View
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          position: 'relative',
          top: 100,
        }}>
        <LottieView
          source={animationPath.delivery_Icon}
          autoPlay
          loop={false}
          speed={0.4}
          style={styles.centerImage}
        />

        <Image source={imagePath.freshah_directah} style={[styles.textImage]} />
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
    width: wp(35),
    height: wp(35),
    bottom: hp(1.2),
    resizeMode: 'contain',
  },
  textImage: {
    width: wp(38),
    height: wp(38),
    bottom: hp(1.2),
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: wp(5),
    borderRadius: wp(4),
    width: wp(80),
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: sp(16),
    fontWeight: 'bold',
    marginBottom: hp(2.5),
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(1),
  },
  numberText: {
    fontSize: sp(14.5),
    marginRight: wp(3),
  },
  callCircle: {
    backgroundColor: '#1DBF73',
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    marginTop: hp(2.5),
    paddingVertical: hp(1),
    paddingHorizontal: wp(6),
    backgroundColor: '#FE724E',
    borderRadius: wp(3),
  },
  closeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: sp(13.5),
  },
});
export default SplashScreen;
