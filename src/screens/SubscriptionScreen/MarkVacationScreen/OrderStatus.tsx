import {StyleSheet, Text, View} from 'react-native';
import { COLORS, FontFamily } from '../../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../../utils/constants/responsiveScreen';
import Colors from '../../../utils/constants/colors';

export type StatusKey = 'undelivered' | 'canceled' | 'delivered' | 'vacation';
export const STATUS_TYPES: Record<
  StatusKey,
  {label: string; color: string; key: string}   
> = {
  undelivered: {label: 'Undelivered', color: Colors.yellow, key: 'undelivered'},
  canceled: {label: 'Canceled', color: Colors.orangeColour, key: 'canceled'},
  delivered: {label: 'Delivered', color: Colors.primary, key: 'delivered'},
  vacation: {label: 'Vacation', color: Colors.darkPurple, key: 'vacation'},
};

type StatusProps = {
  status: StatusKey;
};

export const OrderStatus: React.FC<StatusProps> = ({status}) => {
  const statusInfo = STATUS_TYPES[status];

  return (
    <View style={styles.container}>
      <View style={[styles.dot, {backgroundColor: statusInfo.color}]} />
      <Text style={styles.label}>{statusInfo.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: wp(2.6),             // ≈10px
    height: wp(2.6),
    borderRadius: wp(1.3),      // ≈5px
    marginRight: wp(1.3),       // ≈5px
  },
  label: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: '#6F7F95',
  },
});
