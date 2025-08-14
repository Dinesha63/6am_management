import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import SimpleIcon from '../../components/SimpleIcon';
import {  FontFamily } from '../../utils/constant';
import { imagePaths } from '../../utils/constants/imagePaths';
import { RootState } from '../../redux/store';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

const Header: React.FC = () => {
  const navigation = useNavigation();
  const cartItemsCount = useSelector((state: RootState) =>
    state.products.catalog.items.length
  );

  return (
    <View style={styles.header}>
      <View style={styles.backContainer}>
        <TouchableOpacity
          onPress={() => {
            console.log('Back button pressed');
            navigation.goBack();
          }}
          style={styles.backBtn}>
          <SimpleIcon source={imagePaths.back_icon}  
          style={styles.backBtn} />  
        </TouchableOpacity>
      </View>

      {/* <TouchableOpacity style={styles.iconCircle}>
        <SimpleIcon
          source={imagePaths.Shopping_Cart_icon}
          style={styles.cartIcon}
          color="black"
        />
        {cartItemsCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartItemsCount}</Text>
          </View>
        )}
      </TouchableOpacity> */}
    </View> 
  );
};

const styles = StyleSheet.create({
  header: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(2),
    paddingTop: hp(1),
    // paddingVertical: hp(1),
    backgroundColor: 'transparent',
    // zIndex: 10,
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: wp(3),
  },
  backIcon: {
    width: wp(6),
    height: wp(6),
    tintColor: Colors.black,
    paddingTop: hp(20),
  },
  iconCircle: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: Colors.greyBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIcon: {
    width: wp(5),
    height: wp(5),
  },
  badge: {
    position: 'absolute',
    right: -wp(1.5),
    top: -wp(1.5),
    backgroundColor: Colors.primary,
    borderRadius: wp(3),
    minWidth: wp(5),
    height: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(1),
  },
  badgeText: {
    color: Colors.white,
    fontSize: sp(12),
    fontWeight: 'bold',
  },
});

export default Header;


