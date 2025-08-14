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

interface HeaderProps {
  hasNearbyStores: boolean;
}
const Header: React.FC<HeaderProps> = ({ hasNearbyStores }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
          <SimpleIcon
         source={imagePaths.back_icon}  style={{width: wp(6), height: wp(6), resizeMode: 'contain'}} /> 
      </TouchableOpacity>
      <HeaderText text={hasNearbyStores ? '6 am Stores' : 'Finding Near By Store'} style={styles.headerTitle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(1),
    backgroundColor: Colors.white,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: wp(3),
    padding: wp(1.5),
    
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
    color: Colors.black,
  },
});

export default Header;
