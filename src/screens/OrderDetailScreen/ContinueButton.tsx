import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import OrderSuccessModal from './OrderSuccessModal';
import { FontFamily } from '../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';  

interface ContinueButtonProps {
  onPress: () => void;
  totalAmount: number;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({ onPress, totalAmount }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    // First call the parent's onPress handler
    onPress();
    
    // Navigate to Payment screen
    // setShowSuccessModal(true);
    navigation.navigate('Payment', { totalAmount });
  };

  return (
    <>
      <TouchableOpacity style={styles.continueButton} onPress={handlePress}>
        <Text style={styles.continueButtonText}>Continue to Payment</Text>
      </TouchableOpacity>

      <OrderSuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  continueButton: {
    backgroundColor: Colors.primary,
    padding: hp(2),
    margin: wp(4),
    borderRadius: wp(2),
    alignItems: 'center',
  },
  continueButtonText: {
    color: Colors.white,
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
  },
});

export default ContinueButton;
