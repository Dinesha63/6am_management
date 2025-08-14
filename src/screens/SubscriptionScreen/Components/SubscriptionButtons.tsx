import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Colors from '../../../utils/constants/colors';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../../utils/constants/responsiveScreen';

interface ActionButtonsProps {
  selectedOption: string | null;
  onCancel: () => void;
  onProceed: () => void;
  button2Disabled?: boolean;
  button2TextDisabled?: boolean;
}
const ActionButtons: React.FC<ActionButtonsProps> = ({
  selectedOption,
  onCancel,
  onProceed,
  button2Disabled = false,
  button2TextDisabled = false,
}) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={onCancel}
        activeOpacity={0.6}
        style={styles.button1}>
        <Text style={styles.button1Text}>
          {selectedOption === 'break'
            ? 'Pause Subscription'
            : selectedOption === 'moving'
            ? 'Explore Our Other Store Areas'
            : 'Keep My Subscription'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onProceed}
        activeOpacity={selectedOption && !button2Disabled ? 0.6 : 1}
        disabled={!selectedOption || button2Disabled}
        style={[
          styles.button2,
          (!selectedOption || button2Disabled) && styles.button2Disabled
        ]}>
        <Text style={[
          styles.button2Text,
          (!selectedOption || button2TextDisabled) && styles.button2TextDisabled
        ]}>Proceed to cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'center',
    marginTop: hp(5), 
  },
  button1: {
    backgroundColor: Colors.lightGreen,
    borderRadius: wp(1.3), 
    padding: hp(1.3), 
    width: wp(64), 
  },
  button1Text: {
    alignSelf: 'center',
    color: Colors.white,
    fontSize: sp(14),
  },
  button2: {
    backgroundColor: Colors.secondary,
    borderRadius: wp(1.3),
    padding: hp(1.3),
    width: wp(64),
    marginTop: hp(1.3),
  },
  button2Text: {
    alignSelf: 'center',
    color: Colors.white,
    fontSize: sp(14),
  },
  button2Disabled: {
    backgroundColor: Colors.lightGrey,
  },
  button2TextDisabled: {
    color: Colors.grey,
  },
});


export default ActionButtons;
