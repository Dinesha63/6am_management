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
      <HeaderText text="6 am Credits" style={styles.headerTitle} />
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
    backgroundColor: "white",
    position: 'relative',
  },

 backButton: {
    position: 'absolute',
    left: wp(3),
    padding: wp(1),
  },
  backIcon: {
    width: wp(6),
    height: wp(6),
    resizeMode: 'contain',
  },
  headerTitle: {
    // fontSize: sp(20),
    // fontWeight: 'bold',
    textAlign: 'center',
    paddingLeft: wp(5),
    color: Colors.black,
  },
});
export default Header;
