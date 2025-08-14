// components/StoreMap.tsx
import React from 'react';
import { Image } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { StoreMapProps } from './StoreTypes';
import { hp } from '../../utils/constants/responsive';

const StoreMap: React.FC<StoreMapProps> = ({
  mapRef,
  region,
  confirmed,
  stores,
  selectedStore,
  setSelectedStore,
}) => {
  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={{ flex: 1 }}
      region={region}
      userInterfaceStyle='light'
    >
      {confirmed && (
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}>
          <Image source={require('../../assets/images/google_map_pin_icon.png')} style={{ width: hp(3), height: hp(3) }} />
        </Marker>
      )}

      {confirmed &&
        stores.map((store) => (
          <Marker
            key={store.id}
            coordinate={{ latitude: store.lat, longitude: store.long }}
            onPress={() => setSelectedStore(store)}
          >
            <Callout onPress={() => setSelectedStore(store)}>
              <Image source={require('../../assets/images/MapLogo.png')}  />
            </Callout>
          </Marker>
        ))}
    </MapView>
  );
};

export default StoreMap;
