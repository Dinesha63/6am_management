// src/screens/Auth/LocationChecker.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rs,
} from '../../constants/ResponsiveScreen';


const LocationChecker = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);

  const checkLocationPermissionAndGPS = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log(granted, 'granded')
        Geolocation.getCurrentPosition(
          position => {
            console.log('Location fetched:', position);
            setShowLocationModal(false);
          },
          error => {
            console.log('GPS might be off:', error.message);
            setShowLocationModal(false); // Show modal if GPS is OFF
          },
          { enableHighAccuracy: true, timeout: 1000, maximumAge: 1000 }
        );
      } else {
        console.warn('Permission denied');
        setShowLocationModal(false);
      }
    }
  };

  const openLocationSettings = () => {
    Linking.openSettings();
  };

  useEffect(() => {
    checkLocationPermissionAndGPS();
  }, []);

  return (
    <>
      {/* Your other components can go here */}

      <Modal visible={showLocationModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enable Location Services</Text>
            <Text style={styles.modalText}>
              Location services are required to use this app. Please enable your GPS.
            </Text>
            <TouchableOpacity style={styles.button} onPress={openLocationSettings}>
              <Text style={styles.buttonText}>Open Location Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default LocationChecker;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: wp(85),
    padding: rs(20),
    backgroundColor: 'white',
    borderRadius: rs(10),
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: sp(18),
    fontWeight: 'bold',
    marginBottom: rs(10),
  },
  modalText: {
    fontSize: sp(14),
    textAlign: 'center',
    marginBottom: rs(20),
    color: '#555',
  },
  button: {
    backgroundColor: '#0066CC',
    paddingVertical: rs(10),
    paddingHorizontal: rs(25),
    borderRadius: rs(5),
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
