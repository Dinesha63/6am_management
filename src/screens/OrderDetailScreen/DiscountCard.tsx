import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors  from '../../utils/constants/colors';

const DiscountCard: React.FC = () => {
  return (
    <View style={styles.discountCard}>
      <Text style={styles.discountText}>Enjoy discount up to 10%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  discountCard: {
    padding: wp(4),
    backgroundColor: Colors.white,
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: Colors.greyBackground,
  },
  discountText: {
    fontSize: sp(14),
    color: Colors.black,
  },
});

export default DiscountCard;