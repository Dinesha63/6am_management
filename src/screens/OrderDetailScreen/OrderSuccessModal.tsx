import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import {  FontFamily } from '../../utils/constant';
import { imagePaths } from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

interface OrderSuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ visible, onClose }) => {
  const navigation = useNavigation();

  const handleViewOrders = () => {
    onClose();
    // Navigate to orders screen
    // navigation.navigate('Main', { screen: 'Orders' });
  };

  const handleContinueShopping = () => {
    onClose();
    // Navigate back to home screen
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'List' }],
      })
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.checkmarkContainer}>
            <Image 
              source={imagePaths.Order_check_icon}
              style={styles.checkmark}
            /> 
          </View>
          
          <Text style={styles.title}>Order successful!</Text>
          <Text style={styles.subtitle}>Your order will be delivered on time.</Text>
          <Text style={styles.thankYou}>Thank you!</Text>

          <TouchableOpacity 
            style={styles.viewOrdersButton}
            onPress={handleViewOrders}
          >
            <Text style={styles.viewOrdersText}>View orders</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.continueShoppingButton}
            onPress={handleContinueShopping}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    padding: wp(6),
    width: wp(80),
    alignItems: 'center',
  },
  checkmarkContainer: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  checkmark: {
    width: wp(8),
    height: wp(8),
    tintColor: Colors.white,
  },
  title: {
    fontSize: sp(20),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: hp(1),
  },
  subtitle: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: hp(0.5),
  },
  thankYou: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
    marginBottom: hp(3),
  },
  viewOrdersButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: wp(2),
    width: '100%',
    marginBottom: hp(1.5),
  },
  viewOrdersText: {
    color: Colors.white,
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    textAlign: 'center',
  },
  continueShoppingButton: {
    paddingVertical: hp(1.5),
  },
  continueShoppingText: {
    color: Colors.primary,
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
  },
});

export default OrderSuccessModal;


