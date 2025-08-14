import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Image, ToastAndroid } from 'react-native';
import { Store } from './StoreTypes';
import styles from './StoreStyles';

interface Props {
  loading: boolean;
  noStoresFound: boolean;
  nearbyStores: Store[];
  selectedStore: Store | null;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  onLocate: (store: Store) => void;
  onNavigate: (store: Store) => void;
  onCancel: () => void;
}

const StoreBottomSheet: React.FC<Props> = ({
  loading,
  noStoresFound,
  nearbyStores,
  selectedStore,
  phoneNumber,
  setPhoneNumber,
  onLocate,
  onNavigate,
  onCancel,
}) => {
  if (loading) {
    return (
      <View style={styles.bottomSheet}>
        <Text style={styles.title}>Fetching your location...</Text>
        <Text style={styles.bannerWords}>Quality products, Straight from the farmers</Text>
        <TouchableOpacity style={styles.confirmButton} onPress={onCancel}>
          <Text style={styles.confirmText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (noStoresFound) {
    return (
      <View style={styles.bottomSheet}>
        <Text style={styles.title}>SORRY</Text>
        <Text style={styles.subtitle}>No nearby stores found. Please leave your phone number.</Text>
        <TextInput
          placeholder="12345 67890"
          keyboardType="number-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={{
            width: '100%',
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            paddingHorizontal: 12,
            marginBottom: 10,
          }}
        />
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => ToastAndroid.show(`Submitted, We'll notify you at ${phoneNumber}`,ToastAndroid.LONG)}
        >
          <Text style={styles.confirmText}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.bottomSheet}>
      <View style={styles.rowBetween}>
        <Text style={styles.listTitle}>Nearby Shops</Text>
        <TouchableOpacity>
          <Text style={[styles.subtitlebutton, { color: '#28c76f', fontWeight: 'bold' }]}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ maxHeight: 200, width: '100%' }}>
        {nearbyStores.map((store) => (
          <TouchableOpacity
            key={store.id}
            onPress={() => onLocate(store)}
            style={[
              styles.storeItem,
              selectedStore?.id === store.id && styles.selectedStoreItem,
            ]}
          >
            <Image
              source={{ uri: store.imageUrl }}
              style={styles.storeImage}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{store.name}</Text>
              <Text>{store.durationText} • {store.distanceText}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.bannerWords}>Quality products, Straight from the farmers</Text>

      {selectedStore && (
        <TouchableOpacity style={styles.locateButton} onPress={() => onNavigate(selectedStore)}>
          <Text style={styles.locateButtonText}>Locate Store</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default StoreBottomSheet;
