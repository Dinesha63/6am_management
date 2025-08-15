import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import SimpleIcon from '../../components/SimpleIcon';
import {imagePaths} from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import {FontFamily} from '../../utils/constant';

interface AdminSummaryCardProps {
  title: string;
  value: string;
  subtitle: string;
  backgroundColor: string;
  icon: any;
  onPress: () => void;
}

const AdminSummaryCard: React.FC<AdminSummaryCardProps> = ({
  title,
  value,
  subtitle,
  backgroundColor,
  icon,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.card, {backgroundColor}]}
    onPress={onPress}
    activeOpacity={0.8}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      <SimpleIcon source={icon} style={styles.cardIcon} />
    </View>
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={styles.cardSubtitle}>{subtitle}</Text>
    <View style={styles.arrowContainer}>
      <SimpleIcon
        source={imagePaths.arrow_right_icon}
        style={styles.arrowIcon}
      />
    </View>
  </TouchableOpacity>
);

interface AdminSummaryCardsProps {
  onCardPress: (cardType: string) => void;
}

const AdminSummaryCards: React.FC<AdminSummaryCardsProps> = ({onCardPress}) => {
  const summaryData = [
    {
      title: 'PRODUCTS',
      value: '243',
      subtitle: 'today & tomorrow',
      backgroundColor: '#E8E4F3', 
      icon: imagePaths.package_1,
      type: 'products',
    },
    {
      title: 'CUSTOMERS',
      value: '5',
      subtitle: '3 prepaid • 3 postpaid',
      backgroundColor: '#E3F2FD', 
      icon: imagePaths.Person_icon,
      type: 'customers',
    },
    {
      title: 'DELIVERIES',
      value: '2',
      subtitle: 'pending',
      backgroundColor: '#FFEBEE', 
      icon: imagePaths.delivery_icon,
      type: 'deliveries',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {summaryData.map((item, index) => (
          <AdminSummaryCard
            key={index}
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
            backgroundColor={item.backgroundColor}
            icon={item.icon}
            onPress={() => onCardPress(item.type)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    marginBottom: hp(2),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: wp(28),
    height: hp(12),
    borderRadius: wp(3),
    padding: wp(3),
    marginBottom: hp(2),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  cardTitle: {
    fontSize: sp(12),
    fontFamily: FontFamily.BOLD,
    color: Colors.black,
    flex: 1,
  },
  cardIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: Colors.black,
  },
  cardValue: {
    fontSize: sp(20),
    fontFamily: FontFamily.BOLD,
    color: Colors.black,
    marginBottom: hp(0.5),
  },
  cardSubtitle: {
    fontSize: sp(10),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
    marginBottom: hp(1),
  },
  arrowContainer: {
    position: 'absolute',
    bottom: wp(3),
    right: wp(3),
  },
  arrowIcon: {
    width: wp(4),
    height: wp(4),
    tintColor: Colors.grey,
  },
});

export default AdminSummaryCards;
