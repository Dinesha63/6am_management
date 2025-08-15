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

interface DeliveriesCardProps {
  completed: number;
  total: number;
  pending: number;
  skipped: number;
  onPress: () => void;
}

const DeliveriesCard: React.FC<DeliveriesCardProps> = ({
  completed,
  total,
  pending,
  skipped,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>DELIVERIES TODAY</Text>
          {/* <SimpleIcon
            source={imagePaths.delivery_truck_icon}
            style={styles.cardIcon}
          /> */}
        </View>
        
        <Text style={styles.cardValue}>12/18</Text>
        
        <Text style={styles.cardSubtitle}>
          {pending} pending • {skipped} skipped
        </Text>
        
        <View style={styles.arrowContainer}>
          {/* <SimpleIcon
            source={imagePaths.arrow_right}
            style={styles.arrowIcon}
          /> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    marginBottom: hp(2),
  },
  card: {
    backgroundColor: '#E3F2FD', // Light blue
    borderRadius: wp(3),
    padding: wp(4),

  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  cardTitle: {
    fontSize: sp(14),
    fontFamily: FontFamily.BOLD,
    color: Colors.black,
    flex: 1,
  },
  cardIcon: {
    width: wp(6),
    height: wp(6),
    tintColor: Colors.black,
  },
  cardValue: {
    fontSize: sp(24),
    fontFamily: FontFamily.BOLD,
    color: Colors.black,
    marginBottom: hp(0.5),
  },
  cardSubtitle: {
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
    marginBottom: hp(2),
  },
  arrowContainer: {
    position: 'absolute',
    bottom: wp(4),
    right: wp(4),
  },
  arrowIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: Colors.grey,
  },
});

export default DeliveriesCard;
