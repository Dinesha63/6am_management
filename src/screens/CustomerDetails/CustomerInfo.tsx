import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import SimpleIcon from '../../components/SimpleIcon';
import {imagePaths} from '../../utils/constants/imagePaths';
import Colors from '../../utils/constants/colors';
import {FontFamily} from '../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../utils/constants/responsiveScreen';
import InfoRow from './InfoRow';
import DeliveryManagementCard from './DeliveryManagementCard';
import RecentDeliveries, {DeliveryItem} from './RecentDeliveries';

const CustomerInfo: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const customerName = 'Rajesh Kumar';
  const customerLocation = 'Vedapatti';
  const recent: DeliveryItem[] = [
    {
      id: '1',
      dayLabel: 'Saturday',
      dateLabel: 'Jan 20',
      timeLabel: '06:30 AM',
      status: 'Delivered',
      products: 'Milk 500ml',
      amount: '₹ 30',
    },
    {
      id: '2',
      dayLabel: 'Friday',
      dateLabel: 'Jan 19',
      timeLabel: '06:25 AM',
      status: 'Delivered',
      products: 'Milk 500ml, Curd 500ml',
      amount: '₹ 75',
    },
    {
      id: '3',
      dayLabel: 'Thursday',
      dateLabel: 'Jan 18',
      timeLabel: '06:20 AM',
      status: 'Delivered',
      products: 'Milk 500ml',
      amount: '₹ 30',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <SimpleIcon source={imagePaths.Back_Arrow_icon} style={styles.backIcon} />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>{customerName}</Text>
          <Text style={styles.headerSubtitle}>{customerLocation}</Text>
        </View>
        <View style={{width: wp(6)}} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <SimpleIcon source={imagePaths.Person_icon} style={styles.titleIcon} />
            <Text style={styles.cardTitle}>Customer Information</Text>
          </View>

          <View style={styles.infoRows}>
            <InfoRow icon={imagePaths.Phone_icon} text={'+91 98765 43210'} />
            <InfoRow
              icon={imagePaths.Location_Icon}
              text={'123 Main Street, Vedapatti, Coimbatore - 641003'}
            />
            <InfoRow
              icon={imagePaths.calender_icon}
              text={'Member since January 15th, 2024'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Payment Type</Text>
            <View style={[styles.badge, styles.badgeInfo]}>
              <Text style={styles.badgeText}>prepaid</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Balance/Due</Text>
            <Text style={styles.amount}>₹ 450</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Status</Text>
            <View style={[styles.badge, styles.badgeSuccess]}>
              <Text style={styles.badgeText}>active</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <SimpleIcon source={imagePaths.subscription_icon} style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Subscription Details</Text>
          </View>

          <View style={styles.subscriptionItem}>
            <View>
              <Text style={styles.productTitle}>Milk 500ml</Text>
              <Text style={styles.productSubtext}>Qty: 1 | daily</Text>
            </View>
            <Text style={styles.productPrice}>₹ 30</Text>
          </View>

          <View style={styles.subscriptionItem}>
            <View>
              <Text style={styles.productTitle}>Curd 500ml</Text>
              <Text style={styles.productSubtext}>Qty: 1 | alternate</Text>
            </View>
            <Text style={styles.productPrice}>₹ 45</Text>
          </View>
        </View>

        <View style={{height: hp(2)}} />

        <DeliveryManagementCard
          nextDeliveryText={'January 21st, 2024'}
        />

        <RecentDeliveries items={recent} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGreyScreen,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(1.5),
    backgroundColor: Colors.white,
  },
  backBtn: {
    width: wp(8),
    height: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: Colors.black,
  },
  headerTextWrap: {
    flex: 1,
    marginLeft: wp(2),
  },
  headerTitle: {
    fontSize: sp(18),
    fontFamily: FontFamily.BOLD,
    color: Colors.black,
  },
  headerSubtitle: {
    fontSize: sp(12),
    color: Colors.grey,
    marginTop: hp(0.3),
  },
  scrollContent: {
    padding: wp(4),
  },
  card: {
    backgroundColor: 'lightblue',
    borderRadius: wp(3),
    padding: wp(4),
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  titleIcon: {
    width: wp(5),
    height: wp(5),
    marginRight: wp(2),
    tintColor: Colors.darkinfo,
  },
  cardTitle: {
    fontSize: sp(14),
    fontFamily: FontFamily.MEDIUM,
    color: Colors.black,
  },
  infoRows: {
    gap: hp(1),
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lineLight,
    marginVertical: hp(1.5),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(0.5),
  },
  metaLabel: {
    fontSize: sp(13),
    color: Colors.black,
    fontFamily: FontFamily.MEDIUM,
  },
  badge: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: wp(2),
  },
  badgeInfo: {
    backgroundColor: '#E3F2FD',
  },
  badgeSuccess: {
    backgroundColor: Colors.SelectedCard,
  },
  badgeText: {
    fontSize: sp(11),
    color: Colors.badgeText,
    fontFamily: FontFamily.MEDIUM,
    textTransform: 'lowercase',
  },
  amount: {
    fontSize: sp(16),
    color: Colors.DueGreenText,
    fontFamily: FontFamily.BOLD,
  },
  section: {
    marginTop: hp(2),
    backgroundColor: '#E6EBEB',
    borderRadius: wp(3),
    padding: wp(4),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  sectionIcon: {
    width: wp(5),
    height: wp(5),
    marginRight: wp(2),
    tintColor: Colors.black,
  },
  sectionTitle: {
    fontSize: sp(14),
    fontFamily: FontFamily.MEDIUM,
    color: Colors.black,
  },
  subscriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    borderRadius: wp(2),
    backgroundColor: Colors.backgroundGreyScreen,
    marginBottom: hp(1),
  },
  productTitle: {
    fontSize: sp(14),
    fontFamily: FontFamily.MEDIUM,
    color: Colors.black,
  },
  productSubtext: {
    fontSize: sp(12),
    color: Colors.grey,
    marginTop: hp(0.3),
  },
  productPrice: {
    fontSize: sp(16),
    fontFamily: FontFamily.BOLD,
    color: Colors.black,
  },
});

export default CustomerInfo;
