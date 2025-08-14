import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontFamily } from '../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  itemCount: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, discount, itemCount }) => {
  const total = subtotal - discount;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
      
      <View style={styles.row}>
        <Text style={styles.label}>Sub Total ({itemCount} items)</Text>
        <Text style={styles.value}>₹{subtotal.toFixed(2)}</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Discount</Text>
        <Text style={[styles.value, styles.discount]}>- ₹{discount.toFixed(2)}</Text>
      </View>
      
      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    padding: wp(4),
    marginTop: hp(1.5),
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.1,
    shadowRadius: wp(1),
    elevation: 8,
  },
  title: {
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    marginBottom: hp(2),
    color: Colors.black,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  label: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
  },
  value: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '500',
    color: Colors.black,
  },
  discount: {
    color: Colors.primary,
  },
  totalRow: {
    marginTop: hp(1.5),
    paddingTop: hp(1.5),
    borderTopWidth: 1,
    borderTopColor: Colors.greyBackground,
  },
  totalLabel: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    color: Colors.black,
  },
  totalValue: {
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '700',
    color: Colors.black,
  },
});
export default OrderSummary;
