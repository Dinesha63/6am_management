import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import SimpleIcon from '../../components/SimpleIcon';
import {imagePaths} from '../../utils/constants/imagePaths';
import Colors from '../../utils/constants/colors';
import {FontFamily} from '../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../utils/constants/responsiveScreen';

interface DeliveryManagementCardProps {
  nextDeliveryText: string;
  onSkipNext?: () => void;
  onSelectEndDate?: () => void;
  onApply?: () => void;
  onSetInactiveIndefinite?: () => void;
}

const DeliveryManagementCard: React.FC<DeliveryManagementCardProps> = ({
  nextDeliveryText,
  onSkipNext,
  onSelectEndDate,
  onApply,
  onSetInactiveIndefinite,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <SimpleIcon source={imagePaths.clock_icon} style={styles.titleIcon} />
          <Text style={styles.title}>Delivery Management</Text>
        </View>
        <TouchableOpacity onPress={onSkipNext} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip Next</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subText}>Next Delivery: {nextDeliveryText}</Text>

      <View style={styles.sectionSpacer} />

      <Text style={styles.sectionTitle}>Set Inactive Period</Text>

      <View style={styles.row}>
        <TouchableOpacity onPress={onSelectEndDate} style={styles.calendarBtn}>
          <SimpleIcon source={imagePaths.calender_icon} style={styles.calendarIcon} />
          <Text style={styles.calendarText}>Select End Date</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onApply} style={styles.applyBtn}>
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onSetInactiveIndefinite} style={styles.indefBtn}>
        <SimpleIcon source={imagePaths.information_icon} style={styles.infoIcon} />
        <Text style={styles.indefText}>Set Inactive (Indefinite)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FBEAEA',
    borderRadius: wp(3),
    padding: wp(4),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    width: wp(4),
    height: wp(4),
    marginRight: wp(2),
    tintColor: Colors.danger,
  },
  title: {
    fontSize: sp(14),
    fontFamily: FontFamily.MEDIUM,
    color: Colors.black,
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(2),
  },
  skipText: {
    fontSize: sp(12),
    color: Colors.black,
    fontFamily: FontFamily.MEDIUM,
  },
  subText: {
    marginTop: hp(1.5),
    fontSize: sp(12),
    color: Colors.black,
  },
  sectionSpacer: {
    height: hp(2),
  },
  sectionTitle: {
    fontSize: sp(13),
    color: Colors.black,
    fontFamily: FontFamily.MEDIUM,
    marginBottom: hp(1),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: wp(2),
  },
  calendarIcon: {
    width: wp(4),
    height: wp(4),
    marginRight: wp(2),
    tintColor: Colors.black,
  },
  calendarText: {
    fontSize: sp(12),
    color: Colors.black,
    fontFamily: FontFamily.MEDIUM,
  },
  applyBtn: {
    marginLeft: wp(3),
    backgroundColor: '#FFDFA6',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: wp(2),
  },
  applyText: {
    fontSize: sp(12),
    color: Colors.black,
    fontFamily: FontFamily.MEDIUM,
  },
  indefBtn: {
    marginTop: hp(1.5),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
  },
  infoIcon: {
    width: wp(4),
    height: wp(4),
    marginRight: wp(2),
    tintColor: Colors.black,
  },
  indefText: {
    fontSize: sp(12),
    color: Colors.black,
  },
});

export default DeliveryManagementCard;


