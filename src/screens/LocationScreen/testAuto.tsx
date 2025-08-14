import React from 'react';
import { View, StyleSheet, Alert, ToastAndroid } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';

const TestAutocomplete = () => {
  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search location"
        fetchDetails={true}
        minLength={2}
        onPress={(data, details = null) => {
          ToastAndroid.show(`Place Selected: ${data.description || 'No description'}`,ToastAndroid.SHORT);
          console.log('✅ onPress fired');
          console.log('Data:', data);
          console.log('Details:', details);
        }}
        query={{
          key: 'AIzaSyBz-AO7iQqzwZPvFXHNJHASj4k7DN4R5hs',
          language: 'en',
          components: 'country:in',
        }}
        
            predefinedPlaces={[]}
        debounce={400}
        enablePoweredByContainer={false}
        styles={{
          container: { flex: 0 },
          listView: { backgroundColor: 'white' },
          textInput: {
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            paddingHorizontal: 10,
            backgroundColor: 'white',
          },
        }}
        onFail={error => console.error('Google Places Error:', error)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: hp(6), 
    flex: 1,
  },
});

export default TestAutocomplete;
