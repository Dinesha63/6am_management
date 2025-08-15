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

interface CustomerListItemProps {
  customerName: string;
  location: string;
  products: string[];
  amountDue: number;
  onPress: () => void;
}

const CustomerListItem: React.FC<CustomerListItemProps> = ({
  customerName,
  location,
  products,
  amountDue,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.customerName}>{customerName}</Text>
          <View style={styles.amountSection}>
            <Text style={styles.amountDue}>₹{amountDue}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Postpaid</Text>
            </View>
          </View>
        </View>

        <View style={styles.locationRow}>
          <SimpleIcon
            source={imagePaths.Location_Icon}
            style={styles.locationIcon}
          />
          <Text style={styles.locationText}>{location}</Text>
        </View>

        <View style={styles.productsRow}>
          {products.map((product, index) => (
            <View key={index} style={styles.productTag}>
              <Text style={styles.productText}>{product}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    marginBottom: hp(1.5),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    padding: wp(4),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(1),
  },
  customerName: {
    fontSize: sp(16),
    fontFamily: FontFamily.BOLD,
    color: Colors.black,
    flex: 1,
    marginRight: wp(2),
  },
  amountSection: {
    alignItems: 'flex-end',
  },
  amountDue: {
    fontSize: sp(16),
    fontFamily: FontFamily.BOLD,
    color: Colors.black,
    marginBottom: hp(0.5),
  },
  statusBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: wp(2),
  },
  statusText: {
    fontSize: sp(10),
    fontFamily: FontFamily.MEDIUM,
    color: '#FF4444',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  locationIcon: {
    width: wp(3),
    height: wp(3),
    marginRight: wp(1),
    tintColor: Colors.grey,
  },
  locationText: {
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
  },
  productsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  productTag: {
    backgroundColor: Colors.greyBackground,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: wp(2),
    marginRight: wp(1.5),
    marginBottom: hp(0.5),
  },
  productText: {
    fontSize: sp(11),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
  },
});

export default CustomerListItem;
