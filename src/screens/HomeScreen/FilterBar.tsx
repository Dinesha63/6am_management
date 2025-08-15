import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView} from 'react-native';
import SimpleIcon from '../../components/SimpleIcon';
import {imagePaths} from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import {FontFamily} from '../../utils/constant';

interface FilterBarProps {
  totalDue: number;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  onDownloadPress: () => void;
  filterType?: 'prepaid' | 'postpaid';
}

const FilterBar: React.FC<FilterBarProps> = ({
  totalDue,
  selectedLocation,
  onLocationChange,
  onDownloadPress,
  filterType = 'prepaid',
}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);

  const locations = [
    'All Stores',
    'Vedapatti',
    'Kovaipudur',
    'Navavoor',
    'Ponnaiahrajapuram',
  ];

    return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.filterRow}>
          <Text style={styles.filterTitle}>
            {filterType === 'prepaid' ? 'Prepaid/Wallet' : 'Postpaid Due Details'}
          </Text>

          <TouchableOpacity style={styles.totalDueButton}>
            <Text style={styles.totalDueText}>₹{totalDue} Total Due</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.locationFilter}
            onPress={() => setShowLocationModal(true)}>
            <SimpleIcon
              source={imagePaths.Location_Icon}
              style={styles.locationIcon}
            />
            <Text style={styles.locationText}>{selectedLocation}</Text>
            <SimpleIcon
              source={imagePaths.drop_down_arrow_icon}
              style={styles.dropdownIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.downloadButton} onPress={onDownloadPress}>
            <Text style={styles.downloadText}>
              {filterType === 'prepaid' ? 'Export Wallet' : 'Export Details'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Location Filter Modal */}
      <Modal
        visible={showLocationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLocationModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Location</Text>
            <ScrollView style={styles.locationList}>
              {locations.map((location, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.locationItem,
                    selectedLocation === location && styles.selectedLocation,
                  ]}
                  onPress={() => {
                    onLocationChange(location);
                    setShowLocationModal(false);
                  }}>
                  <Text
                    style={[
                      styles.locationItemText,
                      selectedLocation === location && styles.selectedLocationText,
                    ]}>
                    {location}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowLocationModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyBackground,
  },
  scrollContent: {
    paddingHorizontal: wp(4),
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  filterTitle: {
    fontSize: sp(14),
    fontFamily: FontFamily.MEDIUM,
    color: Colors.black,
  },
  totalDueButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(4),
  },
  totalDueText: {
    fontSize: sp(12),
    fontFamily: FontFamily.BOLD,
    color: Colors.white,
  },
  locationFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.greyBackground,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: wp(2),
    marginRight: wp(2),
  },
  locationIcon: {
    width: wp(3),
    height: wp(3),
    marginRight: wp(1),
    tintColor: Colors.grey,
  },
  locationText: {
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
    marginRight: wp(1),
  },
  dropdownIcon: {
    width: wp(3),
    height: wp(3),
    tintColor: Colors.grey,
  },
  downloadButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: wp(2),
  },
  downloadText: {
    fontSize: sp(12),
    fontFamily: FontFamily.MEDIUM,
    color: Colors.white,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    padding: wp(5),
    width: wp(80),
    maxHeight: hp(60),
  },
  modalTitle: {
    fontSize: sp(18),
    fontFamily: FontFamily.BOLD,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: hp(3),
  },
  locationList: {
    maxHeight: hp(40),
  },
  locationItem: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    borderRadius: wp(2),
    marginBottom: hp(1),
  },
  selectedLocation: {
    backgroundColor: Colors.primary,
  },
  locationItemText: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
  },
  selectedLocationText: {
    color: Colors.white,
    fontFamily: FontFamily.MEDIUM,
  },
  cancelButton: {
    marginTop: hp(2),
    paddingVertical: hp(1.5),
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(2),
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: sp(16),
    fontFamily: FontFamily.MEDIUM,
    color: Colors.black,
  },
});

export default FilterBar;
