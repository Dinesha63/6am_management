import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OrderItem } from './Index';
import { FontFamily } from '../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

interface OrderItemRowProps {
  item: OrderItem;
}

const OrderItemRow: React.FC<OrderItemRowProps> = ({ item }) => {
  return (
    <View style={styles.itemRow}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.storeName}>{item.storeName}</Text>
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
      </View>
      <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyBackground,
    paddingBottom: hp(1.5),
  },
  imagePlaceholder: {
    width: wp(13),
    height: wp(13),
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(2),
    marginRight: wp(3),
  },
  itemDetails: {
    flex: 1,
  },
  productName: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '700',
    color: Colors.black,
  },
  storeName: {
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
  },
  quantity: {
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
  },
  price: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    color: Colors.black,
    alignSelf: 'center',
  },
});

export default OrderItemRow;