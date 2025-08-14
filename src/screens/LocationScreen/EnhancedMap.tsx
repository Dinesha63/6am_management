import React, { useEffect, useRef, useState } from 'react';
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
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import { FontFamily } from '../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

interface EnhancedMapProps {
  onLocationUpdate: (location: {latitude: number; longitude: number}, address: string) => void;
  compactSearchBar?: boolean;
}

const EnhancedMap: React.FC<EnhancedMapProps> = ({ onLocationUpdate, compactSearchBar }) => {
  const mapRef = useRef<MapView | null>(null);
  const autocompleteRef = useRef<any>(null);

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
console.log(userLocation,currentRegion, "45678")

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
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
  }, []);

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
          latitudeDelta: 0.002,
          longitudeDelta: 0.002,
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
        
        if (retryCount === 0 && (error.code === 3 || error.message.includes('timeout'))) {
          console.log('Retrying with network-based location...');
          getCurrentLocation(1);
          return;
        }
        
        setIsLoadingLocation(false);
        
        let errorMessage = 'Unable to get your current location.';
        switch (error.code) {
          case 1:
            errorMessage = 'Location access denied. Please enable location permissions in your device settings.';
            break;
          case 2:
            errorMessage = 'Location unavailable. Please check your GPS and network connection.';
            break;
          case 3:
            errorMessage = 'Location request timed out. Please try again or check your GPS settings.';
            break;
          default:
            errorMessage = `Location error: ${error.message}`;
        }
        
        Alert.alert(
          'Location Error',
          errorMessage,
          [
            {
              text: 'Retry',
              onPress: () => getCurrentLocation(0),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
      },
      options
    );
  };

  const handlePinCurrentLocation = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to pin your current position on the map.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Required', 
            'Location access is required to pin your current location. Please enable it in your device settings.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Open Settings',
                onPress: () => {
                  console.log('Open device settings');
                },
              },
            ]
          );
          return;
        }
      } catch (err) {
        console.warn('Permission request error:', err);
        return;
      }
    }

    getCurrentLocation(0);
  };

  const fetchReverseGeocodedAddress = async (coordinate: LatLng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}&key=AIzaSyBz-AO7iQqzwZPvFXHNJHASj4k7DN4R5hs`
      );
      const json = await response.json();
      console.log('Reverse Geocoding JSON:', json);
      
      if (json.results && json.results.length > 0) {
        const address = json.results[0].formatted_address;
        onLocationUpdate(coordinate, address);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

const handlePlaceSelect = (data: any, details: any = null) => {
  console.log('Place selected - Raw data:', data);
  console.log('Place details:', details);

  if (!details || !details.geometry || !details.geometry.location) {
    console.error('No geometry data available');
   ToastAndroid.show('Error, Could not get location details for this place', ToastAndroid.SHORT);
    return;
  }

  const location = details.geometry.location;
  const coordinate = {
    latitude: location.lat,
    longitude: location.lng,
  };

  console.log('Found place at:', coordinate);

  if (mapRef.current) {
    mapRef.current.animateToRegion({
      ...coordinate,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  }

  const newMarker = {
    latlng: coordinate,
    title: data.structured_formatting?.main_text || 'Selected Location',
    description: data.description || '',
  };
  setMarker(newMarker);

  const selectedAddress = data.description || details.formatted_address || '';
  onLocationUpdate(coordinate, selectedAddress);

  if (autocompleteRef.current) {
    autocompleteRef.current.setAddressText('');
  }
};
  const handleMapPress = async (event: { nativeEvent: { coordinate: LatLng } }) => {
    const coordinate = event.nativeEvent.coordinate;

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
        {/* Search bar commented out
        <View style={styles.autocompleteContainer}>    
          <GooglePlacesAutocomplete
            ref={autocompleteRef}
            placeholder="Search location"
            fetchDetails={true}
            minLength={2}
            onPress={(data, details = null) => {
              handlePlaceSelect(data, details);
            }}
            query={{
              key: 'AIzaSyBz-AO7iQqzwZPvFXHNJHASj4k7DN4R5hs',
              language: 'en',
              components: 'country:in',
              location: userLocation
                ? `${userLocation.latitude},${userLocation.longitude}`
                : undefined,
              radius: 5000,
            }}
            predefinedPlaces={[]}
            styles={{
               container: { flex: 0 },
                listView: {
                  backgroundColor: 'white',
                  borderRadius: wp(2),
                  marginTop: hp(0.3),
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: hp(0.25) },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  maxHeight: hp(25), 
                },
                textInput: {
                  height: compactSearchBar ? hp(4) : hp(5.5),
                  borderColor: '#ddd',
                  borderWidth: 1,
                  paddingHorizontal: wp(2),
                  backgroundColor: 'white',
                  borderRadius: wp(2),
                  fontSize: sp(16),
                },
                row: {
                  paddingVertical: hp(1.5),
                  paddingHorizontal: wp(4),
                },
                description: {
                  fontSize: sp(14),
                  color: '#666',
                },
            }}
            debounce={400}
            enablePoweredByContainer={false}
            textInputProps={{
              autoCorrect: false,
              autoCapitalize: 'none',
              returnKeyType: 'search',
              placeholderTextColor: '#bfc3c9',

            }}
            keyboardShouldPersistTaps="handled"
            onFail={(error) => console.error('Google Places Error:', error)}
            timeout={8000}
            nearbyPlacesAPI="GooglePlacesSearch"
            GooglePlacesSearchQuery={{
              rankby: 'distance',
            }}
          />
        </View>
        */}

        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={handlePinCurrentLocation}
          disabled={isLoadingLocation}
        >
          <Text style={styles.currentLocationButtonText}>
            {isLoadingLocation ? 'Getting Location...' : '📍'}
          </Text>
        </TouchableOpacity>

        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={false}
          provider={PROVIDER_GOOGLE}
          initialRegion={currentRegion}
            userInterfaceStyle="light"
            // liteMode
          onPress={handleMapPress}
          toolbarEnabled={false}
          onRegionChangeComplete={setCurrentRegion}
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
};

const styles = StyleSheet.create({
  container: {
    height: hp(37.5), // 300px ≈ 37.5% of 800px screen height
    backgroundColor: Colors.greyBackground,
  },
  autocompleteContainer: {
    position: 'absolute',
    top: hp(1.25),
    left: wp(2.5),
    right: wp(2.5),
    zIndex: 10,
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: hp(7.5),
    right: wp(5),
    backgroundColor: Colors.black,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderRadius: wp(6.5),
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
  },
  currentLocationButtonText: {
    color: Colors.white,
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default EnhancedMap;