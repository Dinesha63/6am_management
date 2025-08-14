import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../utils/constants/colors';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';

interface TransactionItemProps {
  title: string;
  subtitle: string;
  date: string;
  time: string;
  amount: number;
  isPositive: boolean;
  badgeText: string;
  badgeColor: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  title,
  subtitle,
  date,
  time,
  amount,
  isPositive,
  badgeText,
  badgeColor,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.centeredDateTimeContainer}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <View style={[
          styles.amountBadge,
          badgeText === 'Refund' && { marginHorizontal: 6 }, 
        ]}>
        <Text style={[styles.amount, isPositive ? styles.positive : styles.negative]}>
          {isPositive ? '+' : '-'} ₹{amount.toFixed(2)}
        </Text>
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(4),
    backgroundColor: Colors.white,
    borderRadius: wp(2),
    marginBottom: hp(1),
    marginHorizontal: wp(4),
    borderWidth: 1,
    borderColor: Colors.darkPurple,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: sp(14),
    fontWeight: '600',
    color: Colors.blackText,
  },
  subtitle: {
    fontSize: sp(12),
    color: Colors.grey,
    marginTop: hp(0.5),
  },
  centeredDateTimeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
  },
  date: {
    fontSize: sp(12),
    color: Colors.grey,
  },
  time: {
    fontSize: sp(12),
    color: Colors.grey,
    marginTop: hp(0.5),
  },
  amountBadge: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: sp(14),
    fontWeight: '600',
  },
  positive: {
    color: Colors.primary,
  },
  negative: {
    color: Colors.danger,
  },
  badge: {
    marginTop: hp(1),
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: wp(3),
  },
  badgeText: {
    fontSize: sp(10),
    color: Colors.white,
    fontWeight: '600',
  },
});

export default TransactionItem;