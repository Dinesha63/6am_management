import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SimpleIcon from '../../components/SimpleIcon';
import {imagePaths} from '../../utils/constants/imagePaths';
import Colors from '../../utils/constants/colors';
import {FontFamily} from '../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../utils/constants/responsiveScreen';

export interface DeliveryItem {
  id: string;
  dayLabel: string; // e.g. Saturday
  dateLabel: string; // e.g. Jan 20
  timeLabel: string; // e.g. 06:30 AM
  status: 'Delivered' | 'Skipped' | 'Pending';
  products: string; // e.g. Milk 500ml, Curd 500ml
  amount: string; // e.g. ₹ 30
}

interface RecentDeliveriesProps {
  title?: string;
  subtitle?: string;
  items: DeliveryItem[];
}

const RecentDeliveries: React.FC<RecentDeliveriesProps> = ({
  title = 'Recent Deliveries',
  subtitle = 'Last 30 days',
  items,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {items.map(item => (
        <View key={item.id} style={styles.card}>
          <View style={styles.rowTop}>
            <View style={styles.leftPart}>
              <View style={styles.bullet} />
              <View>
                <Text style={styles.day}>{item.dayLabel}</Text>
                <Text style={styles.date}>{item.dateLabel}</Text>
              </View>
            </View>
            <View style={styles.midPart}>
              <Text style={styles.timeLabel}>Time</Text>
              <Text style={styles.time}>{item.timeLabel}</Text>
            </View>
            <View style={styles.rightPart}>
              <Text style={styles.statusLabel}>Status</Text>
              <View style={[styles.badge, styles.badgeDelivered]}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>
          </View>

          <View style={styles.rowBottom}>
            <Text style={styles.products}>{item.products}</Text>
            <Text style={styles.amount}>{item.amount}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: hp(2),
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    padding: wp(4),
  },
  title: {
    fontSize: sp(14),
    fontFamily: FontFamily.MEDIUM,
    color: Colors.black,
  },
  subtitle: {
    marginTop: hp(0.5),
    fontSize: sp(12),
    color: Colors.grey,
  },
  card: {
    marginTop: hp(1.5),
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: Colors.lineLight,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.2),
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftPart: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bullet: {
    width: wp(4),
    height: wp(4),
    borderRadius: wp(2),
    backgroundColor: Colors.greyBackground,
    marginRight: wp(2),
  },
  day: {
    fontSize: sp(12),
    color: Colors.grey,
  },
  date: {
    marginTop: hp(0.2),
    fontSize: sp(13),
    fontFamily: FontFamily.MEDIUM,
    color: Colors.black,
  },
  midPart: {
    alignItems: 'center',
    flex: 1,
  },
  timeLabel: {
    fontSize: sp(12),
    color: Colors.grey,
  },
  time: {
    marginTop: hp(0.2),
    fontSize: sp(13),
    fontFamily: FontFamily.MEDIUM,
    color: Colors.black,
  },
  rightPart: {
    alignItems: 'flex-end',
    flex: 1,
  },
  statusLabel: {
    fontSize: sp(12),
    color: Colors.grey,
  },
  badge: {
    marginTop: hp(0.2),
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.4),
    borderRadius: wp(2),
  },
  badgeDelivered: {
    backgroundColor: Colors.SelectedCard,
  },
  badgeText: {
    fontSize: sp(11),
    color: Colors.badgeText,
  },
  rowBottom: {
    marginTop: hp(1),
    borderTopWidth: 1,
    borderTopColor: Colors.lineLight,
    paddingTop: hp(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  products: {
    fontSize: sp(12),
    color: Colors.grey,
  },
  amount: {
    fontSize: sp(13),
    fontFamily: FontFamily.MEDIUM,
    color: Colors.black,
  },
});

export default RecentDeliveries;


