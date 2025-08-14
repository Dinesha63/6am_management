import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

interface AddressTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

const AddressTypeSelector: React.FC<AddressTypeSelectorProps> = ({
  selectedType,
  onTypeSelect,
}) => {
  const addressTypes = [
    { key: 'Home', icon: '🏠', label: 'Home' },
    { key: 'Office', icon: '🏢', label: 'Office' },
    { key: 'Other', icon: '📍', label: 'Other' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Address Type</Text>
      <View style={styles.addressTypeContainer}>
        {addressTypes.map((type) => (
          <TouchableOpacity
            key={type.key}
            style={[
              styles.addressTypeButton,
              selectedType === type.key && styles.selectedAddressType,
            ]}
            onPress={() => onTypeSelect(type.key)}>
            <Text style={styles.addressTypeIcon}>{type.icon}</Text>
            <Text
              style={[
                styles.addressTypeText,
                selectedType === type.key && styles.selectedAddressTypeText,
              ]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(2),
  },
  title: {
    fontSize: sp(16),
    fontWeight: '600',
    color: Colors.dark,
    marginBottom: hp(1.5),
  },
  addressTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(3),
  },
  addressTypeButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: Colors.backgroundGrey,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedAddressType: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  addressTypeIcon: {
    fontSize: sp(18),
    marginBottom: hp(0.5),
  },
  addressTypeText: {
    color: Colors.lightGrey,
    fontSize: sp(14),
    fontWeight: '500',
  },
  selectedAddressTypeText: {
    color: Colors.white,
    fontSize: sp(14),
    fontWeight: '600',
  },
});

export default AddressTypeSelector; 