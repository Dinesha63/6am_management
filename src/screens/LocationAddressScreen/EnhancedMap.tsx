import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Platform,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
  Text,
  ToastAndroid,
} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  LatLng,
} from 'react-native-maps';

import Geolocation from '@react-native-community/geolocation';
import { FontFamily } from '../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

interface EnhancedMapProps {
  onLocationUpdate: (location: {latitude: number; longitude: number}, address: string) => void;
  onMapPress?: () => void;
  initialLocation?: {latitude: number; longitude: number};
}

const EnhancedMap = forwardRef<{ fetchCurrentLocation: () => void }, EnhancedMapProps>(({ onLocationUpdate, onMapPress, initialLocation }, ref) => {
  const mapRef = useRef<MapView | null>(null);

  const [marker, setMarker] = useState<{
    latlng: LatLng;
    title?: string;
    description?: string;
  } | null>(null);
  
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 11.0168,
    longitude: 76.9558,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useImperativeHandle(ref, () => ({
    fetchCurrentLocation: () => {
      getCurrentLocation();
    }
  }));

  useEffect(() => {
    if (initialLocation) {
      // Use provided initial location (for editing addresses)
      const location = initialLocation;
      setUserLocation(location);
      
      const region = {
        ...location,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setCurrentRegion(region);

      setTimeout(() => {
        mapRef.current?.animateToRegion(region);
      }, 500);

      const newMarker = {
        latlng: location,
        title: 'Address Location',
        description: 'Selected Address',
      };
      setMarker(newMarker);
      
      // Get address for the initial location
      fetchReverseGeocodedAddress(location);
    } else {
      // Fetch current location (for new addresses)
      const requestLocation = async () => {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.warn('Location permission denied');
            return;
          }
        }

        getCurrentLocation();
      };

      requestLocation();
    }
  }, [initialLocation]);

  const getCurrentLocation = (retryCount = 0) => {
    setIsLoadingLocation(true);
    
    const options = retryCount === 0 ? {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000,
    } : {
      enableHighAccuracy: false, 
      timeout: 12000,
      maximumAge: 30000,
    };
    
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { latitude, longitude };
        setUserLocation(location);
        
        const region = {
          ...location,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        setCurrentRegion(region);

        setTimeout(() => {
          mapRef.current?.animateToRegion(region);
        }, 500);

        const newMarker = {
          latlng: location,
          title: 'You are here',
          description: 'Current Location',
        };
        setMarker(newMarker);
        
        // Get address for current location
        fetchReverseGeocodedAddress(location);
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error.message);
        setIsLoadingLocation(false);
        
        let errorMessage = 'Unable to get your current location.';
        switch (error.code) {
          case 1:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case 2:
            errorMessage = 'Location unavailable. Please check your GPS and network.';
            break;
          case 3:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
        
       ToastAndroid.show(`Location Error: ${errorMessage}`, ToastAndroid.LONG);
      },
      options
    );
  };

  const fetchReverseGeocodedAddress = async (coordinate: LatLng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}&key=AIzaSyBz-AO7iQqzwZPvFXHNJHASj4k7DN4R5hs`
      );
      const json = await response.json();
      
      if (json.results && json.results.length > 0) {
        const address = json.results[0].formatted_address;
        onLocationUpdate(coordinate, address);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };



  const handleMapPress = async (event: { nativeEvent: { coordinate: LatLng } }) => {
    const coordinate = event.nativeEvent.coordinate;

    // Call the onMapPress callback to toggle map height
    if (onMapPress) {
      onMapPress();
    }

    const newMarker = {
      latlng: coordinate,
      title: 'Selected Location',
      description: '',
    };
    setMarker(newMarker);

    // Fetch address for the tapped location
    fetchReverseGeocodedAddress(coordinate);
  };

  const handleMarkerDragEnd = async (event: { nativeEvent: { coordinate: LatLng } }) => {
    const coordinate = event.nativeEvent.coordinate;
    
    const updatedMarker = {
      ...marker!,
      latlng: coordinate,
    };
    setMarker(updatedMarker);

    // Fetch new address for dragged location
    fetchReverseGeocodedAddress(coordinate);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={styles.container}>

        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={false}
          provider={PROVIDER_GOOGLE}
          initialRegion={currentRegion}
          onPress={handleMapPress}
          toolbarEnabled={false}
          onRegionChangeComplete={setCurrentRegion}
          mapType="standard"
        >
          {marker && (
            <Marker
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
              pinColor="red"
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
            />
          )}
        </MapView>
      </View>
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },

  searchLabel: {
    fontSize: sp(14),
    fontWeight: '600',
    color: Colors.dark,
  },
  searchSubLabel: {
    fontSize: sp(12),
    color: Colors.lightGrey,
  },

  map: {
    flex: 1,
  },
});

export default EnhancedMap; 