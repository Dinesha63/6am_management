import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Colors from '../../../utils/constants/colors';
import {FontFamily} from '../../../utils/constant';
import {useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../../utils/constants/responsiveScreen';
import type {CustomerInfo} from '../../../redux/Features/Customer/types/customer.types';
import {imagePaths} from '../../../utils/constants/imagePaths';

interface Props {
  customerInfo?: CustomerInfo | null;
  isPrepaid?: boolean; 
  prepaidBalance?: number; 
}

const ExistingCustomerPaymentCard = ({customerInfo, isPrepaid = true, prepaidBalance = 0}: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const currentDate = new Date();
  const totalDueAmount = customerInfo?.dueAmount;

  if (!isPrepaid) {
    return (
      <View style={styles.container}>
        <View style={styles.paymentCard}>
          <View style={styles.paymentInfo}>
            <Text style={styles.amountText}>₹ {totalDueAmount}</Text>
            <Text style={styles.dueText}>
              {`Due For: ${customerInfo?.dueFor}`}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.payNowButton}
            onPress={() =>
              navigation.navigate('DueSettlement', { 
                totalDueAmount: totalDueAmount ?? 0
              })
            }
          >
            <Text style={styles.payNowText}>PAY NOW</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.paymentCard}>
        <Image source={imagePaths.Recharge_icon} style={styles.backgroundImage} />
        <View style={styles.paymentInfo}>
          <Text style={styles.amountText}>₹ {prepaidBalance}</Text>
          <Text style={styles.dueText}>
            Available Balance
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.payNowButton, styles.rechargeButton]}
          onPress={() =>
            navigation.navigate('CreditScreen', { 
              unitPrice: prepaidBalance,
              flowType: 'Main'
            })
          }
        >
          <Text style={[styles.payNowText, styles.rechargeText]}>RECHARGE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentCard: {
    width: wp(90),
    height: hp(15),
    padding: wp(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: wp(90),
    height: hp(15),
    resizeMode: 'cover',
  },
  paymentInfo: {},
  amountText: {
    fontSize: sp(20),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
    color: Colors.white,
  },
  dueText: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.white,
    marginTop: hp(0.5),
  },
  payNowButton: {
    backgroundColor: Colors.warning,
    borderRadius: wp(1.5),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
  },
  // Recharge button styling
  rechargeButton: {
    backgroundColor: Colors.white,
  },
  payNowText: {
    color: Colors.black,
    fontWeight: '700',
    fontSize: sp(13),
    fontFamily: FontFamily.REGULAR,
  },
  rechargeText: {
    color: Colors.success || Colors.primary || '#4CAF50',
  },
});

export default ExistingCustomerPaymentCard;