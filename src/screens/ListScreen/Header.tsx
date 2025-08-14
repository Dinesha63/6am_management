import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { FontFamily } from '../../utils/constant';
import SimpleIcon from '../../components/SimpleIcon';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { imagePaths } from '../../utils/constants/imagePaths';
import HeaderText from '../../components/HeaderText';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

type HeaderNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigation = useNavigation<HeaderNavigationProp>();
  
  const cartItemsCount = useSelector((state: RootState) =>
    state.products.catalog.items.reduce((total, item) => total + (item.isSku ? 1 : 0), 0)
  );

  return (
    <View style={styles.header}>
      <View style={styles.sideContainer}>
        <TouchableOpacity
          style={styles.backBtnWrapper}
          onPress={() => navigation.goBack()}>
          <SimpleIcon source={imagePaths.back_icon} 
          style={styles.backBtn}  />
        </TouchableOpacity>
      </View>

      <View style={styles.centerContainer}>
        {/* <HeaderText text={title} style={styles.title} /> */}
        <Text style={styles.title}>Products</Text>
      </View>

      {/* <TouchableOpacity style={styles.cartWrapper}>
        <SimpleIcon
          source={imagePaths.Shopping_Cart_icon}
          style={styles.cartIcon}
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
    height: hp(7),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: wp(4),
    position: 'relative',
  },
  sideContainer: {
    width: wp(10),
    justifyContent: 'center',
  },
  centerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: sp(18),
    fontWeight: 'bold',
    color: Colors.black,
  },
  backBtnWrapper: {
    width: wp(6),
    height: hp(4),
    justifyContent: 'center',
  },
  cartWrapper: {
    width: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp(2),
  },
  cartIcon: {
    width: wp(6.5),
    height: wp(6.5),
    tintColor: Colors.black,
  },
  backBtn: {
    width: wp(4.5),
    height: wp(4.5),
    tintColor: Colors.black,
  },
  badge: {
    position: 'absolute',
    right: wp(0.5),
    top: hp(0.5),
    backgroundColor: Colors.primary,
    minWidth: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(1),
  },
  badgeText: {
    color: Colors.white,
    fontSize: sp(10),
    fontWeight: 'bold',
  },
});

export default Header;

