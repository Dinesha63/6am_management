import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontFamily } from '../../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../../utils/constants/responsiveScreen';
import Colors from '../../../utils/constants/colors';

interface SubmitButtonProps {
  onPress: () => void;
  disabled: boolean;
  title: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onPress,
  disabled,
  title,
}) => {
  return (
    <TouchableOpacity
      style={[styles.submitButton, disabled && styles.submitButtonDisabled]}
      disabled={disabled}
      onPress={onPress}>
      <Text style={styles.submitButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: wp(2),
    padding: hp(2),
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.backgroundGrey,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: sp(16),
    fontWeight: '600',
  },
});


export default SubmitButton;