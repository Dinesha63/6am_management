import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
  ActivityIndicator,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoreList } from '../../redux/Features/6amStore/storeThunk';
import {
  createStoreNotification,
} from '../../redux/Features/FutureNotification/NotificationThunk';
import { clearNotification } from '../../redux/Features/FutureNotification/NotificationSlice';
import type { RootState } from '../../redux/store';
import { AppDispatch } from '../../redux/store';
import styles from './StoreStyles';
import { imagePaths } from '../../utils/constants/imagePaths';
import Header from './Header';
import { getDistanceFromLatLonInKm } from './StoreTypes';
import  colors  from '../../utils/constants/colors';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';

const GOOGLE_API_KEY = 'AIzaSyBz-AO7iQqzwZPvFXHNJHASj4k7DN4R5hs';

interface EnrichedStore {
  storeId:       string;
  storeName:     string;
  latitude:      number;
  longitude:     number;
  imageUrl:      string;
  address:       string; // <-- add address here
  distanceText:  string;
  durationText:  string;
  distanceValue: number; 
}

const StoreLocationScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const mapRef  = useRef<MapView>(null);

  // store slice
  const {
    stores             = [],
    nearbyStoreDistance= 0,
    loading: storesLoading = false,
    error: storesError = null,
  } = useSelector((s: RootState) => s.store ?? {});

  useEffect(() => {
    console.log('Stores from Redux:', stores);
  }, [stores]);

  // notification slice
  const { loading: notifLoading, error: notifError, notified } = useSelector(
    (s: RootState) => s.notification
  );
  const [region, setRegion] = useState<Region | null>(null);
  const [gotLocation, setGotLocation] = useState(false);
  const [nearbyStores, setNearbyStores] = useState<EnrichedStore[]>([]);
  const [noStores, setNoStores]         = useState(false);
  const [phone, setPhone]               = useState('');
  const [selected, setSelected]         = useState<EnrichedStore | null>(null);
  const [showAll, setShowAll] = useState(false);

  const sortedStores = React.useMemo(() => {
    return [...nearbyStores].sort((a, b) => a.distanceValue - b.distanceValue);
  }, [nearbyStores]);

  const displayedStores = sortedStores;

  const onSeeAll = () => setShowAll(true);
  const onCollapse = () => setShowAll(false);

  useEffect(() => {
    dispatch(fetchStoreList({}));
  }, [dispatch]);

  
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const ok = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (ok !== PermissionsAndroid.RESULTS.GRANTED) {
          ToastAndroid.show('Permission Denied, Location permission is required.',ToastAndroid.SHORT);
          return;
        }
      }
      Geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          const r: Region = {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setRegion(r);
          setGotLocation(true);
          mapRef.current?.animateToRegion(r, 1000);
        },
        () => ToastAndroid.show('Error, Unable to fetch location.',ToastAndroid.SHORT),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    })();
  }, []);

  useEffect(() => {
    if (
      !gotLocation ||
      !region ||
      (stores?.length ?? 0) === 0
    ) return;

    const enriched: EnrichedStore[] = stores.map(s => {
      const lat  = parseFloat(s.longitude);
      const lng  = parseFloat(s.latitude);

      // compute straight‑line distance in km
      const km = getDistanceFromLatLonInKm(
        region.latitude,
        region.longitude,
        lat,
        lng
      );

      return {
        storeId:       s.storeId,
        storeName:     s.storeName,
        latitude:      lat,
        longitude:     lng,
        imageUrl:      s.imageUrl,
        address:       s.address, 
        distanceValue: km * 1000,               
        distanceText:  `${km.toFixed(1)} km`,    
        durationText:  `${Math.ceil((km/40)*60)} min`, 
      };
    });

    const filtered = enriched.filter(
      e => e.distanceValue <= nearbyStoreDistance * 1000
    );
    console.log('Nearby stores after filtering:', filtered);

    filtered.sort((a, b) => a.distanceValue - b.distanceValue);

    setNearbyStores(filtered);
    setNoStores(filtered.length === 0);
  }, [gotLocation, region, stores, nearbyStoreDistance]);

  const nearest = nearbyStores.reduce(
    (best, s) =>
      !best || s.distanceValue < best.distanceValue ? s : best,
    null as EnrichedStore | null
  );

  const onSubmitPhone = () => {
    if (!phone) {
      ToastAndroid.show('Validation, Please enter your phone number.',ToastAndroid.SHORT);
      return;
    }
    dispatch(
      createStoreNotification({
        phoneNumber: phone,
        latitude:    region?.latitude.toString() || '',
        longitude:   region?.longitude.toString() || '',
      })
    );
  };

  useEffect(() => {
    if (notified) {
      ToastAndroid.show(
        'Thank you!,We’ll notify you when we start servicing your area.',ToastAndroid.SHORT);
      dispatch(clearNotification());
    } else if (notifError) {
      ToastAndroid.show(`Error, ${notifError}`,ToastAndroid.SHORT);
    }
  }, [notified, notifError, dispatch]);

  
  const openDirections = (s: EnrichedStore) =>
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${s.latitude},${s.longitude}`
    );


  return (
    <View style={styles.container}>
      <Header hasNearbyStores={!noStores} />
      {region && (
        <MapView ref={mapRef} style={styles.map} region={region}>
          {gotLocation && (
            <Marker
              coordinate={{
                latitude:  region.latitude,
                longitude: region.longitude,
              }}
              title="You"
            />
          )}
          {sortedStores.map(s => (
            <Marker
              key={s.storeId}
              coordinate={{ latitude: s.latitude, longitude: s.longitude }}
              image={imagePaths.Storemap_icon} style={styles.StoremapIcon}
              
              onPress={() => setSelected(s)}
            >
              <Callout onPress={() => setSelected(s)}>
                <Text>{s.storeName}</Text>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}

      <View style={styles.bottomSheet}>
        {storesLoading || !gotLocation ? (
          <>
            <Image source={imagePaths.mapSearch_icon} style={styles.mapIcon} />
            <ActivityIndicator size="large" color="#28c76f" />
          </>
        ) : noStores ? (
          <>
            <Image source={imagePaths.sorry_icon} style={styles.mapIcon} />
            <Text style={styles.title}>SORRY</Text>
            <Text style={styles.subtitle}>
              No nearby stores found. Please leave your phone number.
            </Text>
            <TextInput
              placeholder="+91 12345 67890"
              keyboardType="phone-pad"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={onSubmitPhone}
              disabled={notifLoading}
            >
              <Text style={styles.confirmText}>
                {notifLoading ? 'Submitting…' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* header with See All */}
            <View style={styles.rowBetween}>
              <Text style={styles.listTitle}>Near By You</Text>
              {!showAll ? (
                <TouchableOpacity onPress={onSeeAll}>
                  <Text style={styles.subtitlebutton}>See All</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={onCollapse}>
                  <Text style={styles.subtitlebutton}>Collapse</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* store list */}
            <ScrollView style={{ maxHeight: showAll ? 400 : 200, width: '100%' }}>
              {displayedStores.map(s => (
                <TouchableOpacity
                  key={s.storeId}
                  style={[
                    styles.uniqueStoreCard,
                    selected?.storeId === s.storeId && styles.uniqueStoreCardSelected,
                  ]}
                  activeOpacity={0.95}
                  onPress={() => {
                    setSelected(s);
                    mapRef.current?.animateToRegion(
                      {
                        latitude: s.latitude - 0.005,
                        longitude: s.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      },
                      500
                    );
                  }}
                >
                  <View style={styles.gradientAccent} />
                  <View style={styles.imageWrapper}>
                    <Image
                      source={s.imageUrl ? { uri: s.imageUrl } : imagePaths.Placeholder_Image}
                      style={styles.uniqueStoreImage}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.uniqueStoreContent}>
                    <Text style={styles.uniqueStoreTitle}>{s.storeName}</Text>
                    <Text style={styles.uniqueStoreAddress}>{s.address}</Text>
                    <View style={styles.badgeRow}>
                      <View style={styles.badge}>
                        <Image source={imagePaths.clock_icon} style={styles.badgeIcon} />
                        <Text style={styles.badgeText}>{s.durationText}</Text>
                      </View>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{s.distanceText}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* banner & locate button */}
            <Text style={styles.bannerWords}>
              Quality products, Straight from the farmers
            </Text>
            {selected && (
              <TouchableOpacity
                style={styles.locateButton}
                onPress={() => openDirections(selected)}
              >
                <Text style={styles.locateButtonText}>Locate Store</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default StoreLocationScreen;
