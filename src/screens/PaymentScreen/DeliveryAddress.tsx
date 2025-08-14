import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AddressData, RootStackParamList} from '../../types';
import {FontFamily} from '../../utils/constant';
import Colors from '../../utils/constants/colors';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import AddressSelectionBottomSheet from '../../components/AddressSelectionBottomSheet';
import {CustomerAddress} from '../../redux/Features/Address/address.types';

interface DeliveryAddressProps {
  amount: number;
  addressData: AddressData;
  addressSelected: boolean;
  walletSelected: boolean;
  onPress: () => void;
  onAddressSelect: (address: CustomerAddress) => void;
  showAddressBottomSheet: boolean;
  setShowAddressBottomSheet: React.Dispatch<React.SetStateAction<boolean>>;
}
const DeliveryAddress: React.FC<DeliveryAddressProps> = ({
  amount = 0,
  addressData,
  addressSelected,
  walletSelected,
  onPress,
  onAddressSelect,
  showAddressBottomSheet,
  setShowAddressBottomSheet,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleAddressSelect = (address: CustomerAddress) => {
    setShowAddressBottomSheet(false);
    onAddressSelect(address);
    // Handle address selection logic here
    console.log('Selected address:', address);
  };

  const handleAddAddress = () => {
    setShowAddressBottomSheet(false);
    navigation.navigate('LocationAddressScreen', {
      addressData: undefined,
      formData: {goToPaymentOnBack: true},
    });
  };

  const handleCloseBottomSheet = () => {
    setShowAddressBottomSheet(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Delivery Address</Text>
        {addressSelected ? (
          <TouchableOpacity onPress={() => setShowAddressBottomSheet(true)}>
            <Text style={styles.addButton}>Change</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setShowAddressBottomSheet(true)}>
            <Text style={styles.addButton}>Add +</Text>
          </TouchableOpacity>
        )}
      </View>
      {addressSelected ? (
        <View>
          {addressData?.addressLine1 && (
            <Text style={styles.placeholder}>{addressData.addressLine1}</Text>
          )}
          {/* {addressData?.addressLine2 && (
            <Text style={styles.placeholder}>{addressData.addressLine2}</Text>
          )} */}
          {/* {addressData?.location && (
            <Text style={styles.placeholder}>{addressData.location}</Text>
          )} */}
          {addressData?.pincode && (
            <Text style={styles.placeholder}>{addressData.pincode}</Text>
          )}
          {/* {addressData?.phoneNumber && (
            <Text style={styles.placeholder}>Phone: {addressData.phoneNumber}</Text>
          )} */}
          {addressData?.fullName && (
            <Text style={styles.placeholder}>Name: {addressData.fullName}</Text>
          )}
        </View>
      ) : (
        <Text style={styles.placeholder}>Add your address</Text>
      )}

      {/* <View style={styles.amountContainer}>
        <Text style={styles.label}>Total amount payable</Text>
        <Text style={styles.amount}>{amount}</Text>
        {amount} 
        amount.toFixed(2)
      </View> */}

      <AddressSelectionBottomSheet
        isVisible={showAddressBottomSheet}
        onClose={handleCloseBottomSheet}
        onAddressSelect={handleAddressSelect}
        onAddAddress={handleAddAddress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: wp(4),
    padding: wp(4),
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    borderColor: Colors.greyBackground,
    borderWidth: 1,
    position: 'absolute',
    bottom: hp(8.5),
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  title: {
    fontSize: sp(16),
    fontWeight: '500',
  },
  addButton: {
    color: Colors.primary,
    fontSize: sp(14),
    backgroundColor: Colors.lightblue,
    padding: wp(1),
  },
  placeholder: {
    color: Colors.black,
    fontSize: sp(14),
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(2),
    paddingTop: hp(3.5),
  },
  label: {
    fontSize: sp(14),
    color: Colors.black,
  },
  amount: {
    fontSize: sp(14),
    color: Colors.primary,
    fontWeight: '600',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: wp(2),
    padding: hp(2),
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: sp(16),
    fontWeight: '600',
  },
});

export default DeliveryAddress;
