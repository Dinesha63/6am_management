import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import SimpleIcon from '../../components/SimpleIcon';
import {imagePaths} from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import {FontFamily} from '../../utils/constant';
import { StoreItem } from '../../redux/Features/6amStore/store.types';

interface DashboardHeaderProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  onActionPress: () => void;
  locationData: StoreItem[];
  userRole?: 'admin' | 'superAdmin';
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedLocation,
  onLocationChange,
  onActionPress,
  locationData,
  userRole = 'superAdmin',
}) => {
  const [showLocationModal, setShowLocationModal] = useState(false);

  const locations = locationData?.map(store => store.storeName);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.locationSection}>
          <Text style={styles.greeting}>Hello {userRole === 'admin' ? 'Admin' : 'SuperAdmin'}</Text>
          <TouchableOpacity
            style={styles.locationSelector}
            onPress={() => setShowLocationModal(true)}>
            <Text style={styles.locationText}>{selectedLocation}</Text>
            <SimpleIcon
              source={imagePaths.Location_Icon}
              style={styles.locationIcon}
            />
            <SimpleIcon
              source={imagePaths.drop_down_arrow_icon}
              style={styles.dropdownIcon}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={onActionPress}>
          <SimpleIcon
            source={imagePaths.logout_icon}
            style={styles.actionIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Location Selection Modal */}
      <Modal
        visible={showLocationModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLocationModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Location</Text>
            <ScrollView style={styles.locationList}>
              {locationData.map((location, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.locationItem,
                    selectedLocation === location.storeName && styles.selectedLocation,
                  ]}
                  onPress={() => {
                    onLocationChange(location.storeName);
                    setShowLocationModal(false);
                  }}>
                  <Text
                    style={[
                      styles.locationItemText,
                      selectedLocation === location.storeName && styles.selectedLocationText,
                    ]}>
                    {location.storeName}
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
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
    paddingBottom: hp(1.5),
    backgroundColor: Colors.white,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationSection: {
    flex: 1,
  },
  greeting: {
    fontSize: sp(20),
    fontFamily: FontFamily.BOLD,
    color: Colors.black,
    marginBottom: hp(0.5),
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.greyBackground,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: wp(2),
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: sp(14),
    fontFamily: FontFamily.MEDIUM,
    color: Colors.black,
    marginRight: wp(1),
  },
  locationIcon: {
    width: wp(4),
    height: wp(4),
    marginRight: wp(1),
    tintColor: Colors.primary,
  },
  dropdownIcon: {
    width: wp(3),
    height: wp(3),
    tintColor: Colors.grey,
  },
  actionButton: {
    width: wp(12),
    height: wp(12),
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    width: wp(6),
    height: wp(6),
    tintColor: Colors.black,
    transform: [{ rotate: '180deg' }],
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

export default DashboardHeader;
