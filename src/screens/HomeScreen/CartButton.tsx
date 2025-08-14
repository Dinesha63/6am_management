import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import SimpleIcon from '../../components/SimpleIcon';
import {  FontFamily } from '../../utils/constant';
import { imagePaths } from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, Product } from '../../types';

interface CartButtonProps {
  onPress?: () => void;
  product?: Product;
}

const CartButton: React.FC<CartButtonProps> = ({ onPress, product }) => {  
  const [count, setCount] = useState<number>(0);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSubscribe = () => {
    if (product) {
      navigation.navigate('SetSubscriptionScreen', { product });
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <TouchableOpacity
        style={[
          styles.addToCartContainer,
          count > 0 && styles.addToCartContainerSelected
        ]}
        onPress={() => {
          // setCount(count === 0 ? 1 : 0);
          handleSubscribe();
          // if (onPress) onPress();
        }}
      >
        <Text style={[styles.addText, count > 0 && styles.addTextSelected]}>
          Subscribe
        </Text>
        {/* <SimpleIcon
          source={imagePaths.Shopping_Cart_icon}
          style={[styles.cartIcon, count > 0 && { tintColor: '#888' }]}
        /> */}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    margin: wp(2),
  },
  counterWrapper: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: wp(50),
    width: wp(26),
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(1),
    borderWidth: 1,
    borderColor: "#7CC467",
  },
  circleButton: {
    width: wp(8),
    height: wp(8),
    backgroundColor: Colors.primary,
    borderRadius: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbol: {
    color: Colors.white,
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
  },
  middleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    paddingHorizontal: wp(1),
  },
  cartIcon: {
    width: wp(4),
    height: wp(4),
    tintColor: Colors.white,
  },
  countText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
  },
  addToCartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: wp(50),
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
  },
  addText: {
    color: Colors.white,
    fontWeight: 'bold',
    marginRight: wp(1.5),
    fontSize: sp(14),
  },
  addToCartContainerSelected: {
    backgroundColor: Colors.greyBackground,
  },
  addTextSelected: {
    color: Colors.lightGrey,
  },
});


export default CartButton;


