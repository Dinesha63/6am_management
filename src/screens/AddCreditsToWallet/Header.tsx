import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { FontFamily} from '../../utils/constant';
import { imagePaths } from '../../utils/constants/imagePaths';
import HeaderText from '../../components/HeaderText';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import SimpleIcon from '../../components/SimpleIcon';

const Header: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
          <SimpleIcon
         source={imagePaths.back_icon}
         style={styles.backIcon}  />
      </TouchableOpacity>
      <HeaderText text="Add Credits To Wallet" style={styles.headerTitle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: hp(1.5),
    paddingHorizontal: wp(1),
    backgroundColor: Colors.white,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: wp(1),
    padding: wp(1.5), // Ensure the button has a background color
    borderRadius: wp(3), // Optional: Add some border radius for better aesthetics
  },
  backIcon: {
    width: wp(6),
    height: wp(6),
    resizeMode: 'contain',
  },
  headerTitle: {
    // fontSize: sp(20),
    // fontWeight: 'bold',
    // textAlign: 'center',
    color: '#000',
  },
});


export default Header;
