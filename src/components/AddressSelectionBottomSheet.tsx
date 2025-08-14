import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  TextInput,
} from 'react-native';
import SimpleIcon from './SimpleIcon';
import AddAddressForm from './AddAddressForm';
import { FontFamily } from '../utils/constant';
import Colors from '../utils/constants/colors';
import { imagePaths } from '../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../utils/constants/responsiveScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchCustomerAddress } from '../redux/Features/Address/addressThunk';
import { AppDispatch } from '../redux/store';
import { useDispatch } from 'react-redux';
import { CustomerAddress } from '../redux/Features/Address/address.types';

interface AddressSelectionBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onAddressSelect: (address: CustomerAddress) => void;
  onAddAddress: () => void;
}

const AddressSelectionBottomSheet: React.FC<AddressSelectionBottomSheetProps> = ({
  isVisible,
  onClose,
  onAddressSelect,
  onAddAddress,
}) => {
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);    
  
  const fetchAddresses = async () => {
    try {
      const phone = await AsyncStorage.getItem('userPhoneNumber');
      console.log('Fetching addresses for phone:', phone);
  
      if (!phone) {
        console.error('No phone number found in AsyncStorage');
        return;
      }
  
      const safeExistingAddresses = await dispatch(
        fetchCustomerAddress(phone)
      ).unwrap();
  
      console.log('Fetched addresses:', safeExistingAddresses);
      setAddresses(safeExistingAddresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };
  
  useEffect(() => {
    fetchAddresses();
  }, []);

  const isAddressDeliverable = (address: CustomerAddress): boolean => {
    return true;
  };

  const getAddressIcon = (addressType: string) => {
    switch (addressType?.toUpperCase()) {
      case 'WORK':
        return imagePaths.briefcase_icon || '💼';
      case 'HOME':
        return imagePaths.home_icon || '🏠';
      case 'OTHER':
        return imagePaths.person_icon || '👤';
      default:
        return imagePaths.location_icon || '📍';
    }
  };

  const getAddressTypeLabel = (addressType: string) => {
    switch (addressType?.toUpperCase()) {
      case 'WORK':
        return 'Work';
      case 'HOME':
        return 'Home';
      case 'OTHER':
        return 'Other';
      default:
        return 'Other';
    }
  };

  // Format the full address from the address components
  const formatAddress = (address: CustomerAddress): string => {
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.location,
      address.pincode
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  const renderAddressFields = (address: CustomerAddress) => {
    const fields = [];
    
    // Address fields - only show if they exist
    if (address.addressLine1) {
      fields.push(
        <Text key="addressLine1" style={styles.addressText}>
          {address.addressLine1}
        </Text>
      );
    }
    
    if (address.addressLine2) {
      fields.push(
        <Text key="addressLine2" style={styles.addressText}>
          {address.addressLine2}
        </Text>
      );
    }
    
    if (address.location) {
      fields.push(
        <Text key="location" style={styles.addressText}>
          {address.location}
        </Text>
      );
    }
    
    if (address.pincode) {
      fields.push(
        <Text key="pincode" style={styles.addressText}>
          {address.pincode}
        </Text>
      );
    }
    
    // Phone number - only show if it exists
    if (address.phoneNumber) {
      fields.push(
        <Text key="phoneNumber" style={styles.phoneNumber}>
          Phone number: {address.phoneNumber}
        </Text>
      );
    }
    
    // Full name - only show if it exists
    if (address.fullName) {
      fields.push(
        <Text key="fullName" style={styles.fullName}>
          Name: {address.fullName}
        </Text>
      );
    }
    
    return fields;
  };

  const deliverableAddresses = addresses.filter(addr => isAddressDeliverable(addr));
  const nonDeliverableAddresses = addresses.filter(addr => !isAddressDeliverable(addr));

  const handleShowAddForm = () => setMode('add');
  const handleBackToList = () => {
    setMode('list');
    setEditingAddress(null);
  };

  const handleEditAddress = (address: CustomerAddress) => {
    setEditingAddress(address);
    setMode('edit');
  };

  const handleClose = () => {
    setMode('list'); // Reset to list mode when closing
    setEditingAddress(null);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={handleClose}
        />
        <View style={[
          styles.bottomSheet,
          { minHeight: addresses.length <= 1 ? hp(50) : hp(87) }
        ]}>
          <View style={styles.dragIndicator} />

          {mode === 'list' ? (
            <>
              <Text style={styles.title}>Select an address</Text>
              {/* Add Address Button */}
              <TouchableOpacity style={styles.addAddressButton} onPress={handleShowAddForm}>
                <View style={styles.addAddressContent}>
                  <View style={styles.addAddressIcon}>
                    <Text style={styles.addIconText}>+</Text>
                  </View>
                  <Text style={styles.addAddressText}>Add Address</Text>
                </View>
                <Image
                  source={imagePaths.arrow_right_icon || '→'} 
                  style={styles.arrowIcon} 
                />
              </TouchableOpacity>
              {/* Saved Addresses Section */}
              <Text style={styles.sectionTitle}>SAVED ADDRESSES</Text>
              <ScrollView style={styles.addressList} showsVerticalScrollIndicator={false}>
                {/* Deliverable Addresses */}
                {deliverableAddresses.map((address, index) => (
                  <TouchableOpacity
                    key={address.customerAddressId}
                    style={styles.addressCard}
                    onPress={() => onAddressSelect(address)}
                  >
                    <View style={styles.addressContent}>
                      <View style={styles.addressHeader}>
                        <View style={styles.addressTypeContainer}>
                          <Text style={styles.addressType}>{getAddressTypeLabel(address.addressType)}</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => handleEditAddress(address)}
                        >
                          <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                      </View>
                      {renderAddressFields(address)}
                    </View>
                  </TouchableOpacity>
                ))}
                {/* Non-Deliverable Addresses */}
                {nonDeliverableAddresses.map((address, index) => (
                  <View key={address.customerAddressId}>
                    <Text style={styles.doesNotDeliverLabel}>DOES NOT DELIVER TO</Text>
                    <TouchableOpacity
                      style={styles.addressCard}
                      onPress={() => onAddressSelect(address)}
                    >
                      <View style={styles.addressContent}>
                        <View style={styles.addressHeader}>
                          <View style={styles.addressTypeContainer}>
                            <Text style={styles.addressIcon}>{getAddressIcon(address.addressType)}</Text>
                            <Text style={styles.addressType}>{getAddressTypeLabel(address.addressType)}</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => handleEditAddress(address)}
                          >
                            <Text style={styles.editButtonText}>Edit</Text>
                          </TouchableOpacity>
                        </View>
                        {renderAddressFields(address)}
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <AddAddressForm
              onBack={handleBackToList}
              onSubmit={(addressData) => {
                console.log('Address submitted:', addressData);
                handleBackToList();
                fetchAddresses()
              }}
              editingAddress={editingAddress}
              isEditMode={mode === 'edit'}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    paddingTop: hp(2),
    paddingHorizontal: wp(5),
    // paddingBottom: hp(4),
    maxHeight: hp(92),
    minHeight: hp(70),
  },
  dragIndicator: {
    alignSelf: 'center',
    width: wp(10),
    height: hp(0.5),
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(2.5),
    marginBottom: hp(2),
  },
  title: {
    fontSize: sp(18),
    fontWeight: '600',
    color: Colors.black,
    marginBottom: hp(2),
    textAlign: 'center',
  },
  subTitle: {
    fontSize: sp(12),
    color: Colors.grey,
    textAlign: 'center',
    marginBottom: hp(2),
  },
  addHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  backButton: {
    marginRight: wp(2),
    padding: wp(1),
  },
  backButtonText: {
    fontSize: sp(18),
    color: Colors.primary,
    fontWeight: 'bold',
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: Colors.greyBackground,
    marginBottom: hp(3),
  },
  addAddressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addAddressIcon: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  addIconText: {
    color: Colors.white,
    fontSize: sp(20),
    fontWeight: 'bold',
  },
  addAddressText: {
    fontSize: sp(16),
    color: Colors.primary,
    fontWeight: '500',
  },
  arrowIcon: {
    width: wp(6),
    height: wp(6),
    tintColor: Colors.grey,
  },
  sectionTitle: {
    fontSize: sp(12),
    color: Colors.grey,
    marginBottom: hp(2),
    fontWeight: '500',
  },
  addressList: {
    maxHeight: hp(50),
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    // paddingVertical: hp(2),
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.greyBackground,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
    borderRadius: wp(3),
    overflow: 'hidden',
    backgroundColor: '#f5f7fa',
    // borderLeftWidth: 6,
    // borderLeftColor: '#4A90E2', // accent bar
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  addressContent: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  addressIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  addressType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  distance: {
    fontSize: sp(12),
    color: Colors.grey,
  },
  addressText: {
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  phoneNumber: {
    fontSize: 13,
    color: '#888',
  },
  fullName: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: wp(1),
    marginLeft: wp(1),
  },
  actionIcon: {
    fontSize: sp(16),
    color: Colors.primary,
  },
  doesNotDeliverLabel: {
    fontSize: sp(12),
    color: Colors.danger,
    fontWeight: '600',
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  editButton: {
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(3),
    backgroundColor: Colors.primary,
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  editButtonText: {
    color: Colors.white,
    fontSize: sp(12),
    fontWeight: '600',
    textAlign: 'center',
  },
  mapImage: {
    width: '100%',
    height: hp(20),
    borderRadius: wp(2),
    marginBottom: hp(2),
    backgroundColor: Colors.greyBackground,
  },
  fetchLocationButton: {
    backgroundColor: Colors.primary,
    borderRadius: wp(2),
    paddingVertical: hp(1.5),
    alignItems: 'center',
    marginBottom: hp(2),
  },
  fetchLocationButtonText: {
    color: Colors.white,
    fontSize: sp(16),
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(2),
    padding: wp(3),
    fontSize: sp(14),
    marginBottom: hp(1.5),
    color: Colors.black,
  },
  searchInput: {
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(2),
    padding: wp(3),
    fontSize: sp(14),
    marginBottom: hp(2),
    color: Colors.black,
  },
  doorImageLabel: {
    fontSize: sp(14),
    fontWeight: '600',
    color: Colors.black,
    marginTop: hp(2),
    marginBottom: hp(0.5),
  },
  doorImageSubLabel: {
    fontSize: sp(12),
    color: Colors.grey,
    marginBottom: hp(1),
  },
  doorImageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  uploadBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.greyBackground,
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(4),
    marginRight: wp(2),
    backgroundColor: Colors.white,
  },
  uploadIcon: {
    fontSize: sp(24),
    marginBottom: hp(1),
  },
  uploadText: {
    fontSize: sp(14),
    color: Colors.primary,
  },
  laterButton: {
    backgroundColor: Colors.primary,
    borderRadius: wp(2),
    paddingVertical: hp(1.5),
    alignItems: 'center',
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  laterButtonText: {
    color: Colors.white,
    fontSize: sp(16),
    fontWeight: '600',
  },

});

export default AddressSelectionBottomSheet; 