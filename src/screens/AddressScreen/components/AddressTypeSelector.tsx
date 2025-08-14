import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../../utils/constants/responsiveScreen';
import Colors from '../../../utils/constants/colors';
interface AddressTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

const AddressTypeSelector: React.FC<AddressTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
}) => {
  const addressTypes = ['Home', 'Office', 'Other'];

  return (
    <View style={styles.addressTypeContainer}>
      {addressTypes.map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.addressTypeButton,
            selectedType === type && styles.selectedAddressType,
          ]}
          onPress={() => onTypeSelect(type)}>
          <Text
            style={[
              styles.addressTypeText,
              selectedType === type && styles.selectedAddressTypeText,
            ]}>
            {type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  addressTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(3),
  },
  addressTypeButton: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(6),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: Colors.backgroundGrey,
  },
  selectedAddressType: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  addressTypeText: {
    color: Colors.lightGrey,
    fontSize: sp(14),
  },
  selectedAddressTypeText: {
    color: Colors.white,
    fontSize: sp(14),
  },
});


export default AddressTypeSelector;