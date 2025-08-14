import { Region } from 'react-native-maps';

export interface Store {
  id: string;
  name: string;
  imageUrl: string;
  durationText: string;
  distanceText: string;
  lat: number;   // <-- add this
  long: number;  // <-- add this
  // ...other properties as needed
}

export interface StoreMapProps {
  mapRef: React.RefObject<any>;
  region: Region;
  confirmed: boolean;
  stores: Store[];
  selectedStore: Store | null;
  setSelectedStore: (store: Store) => void;
}
export const storeData: Store[] = [
  { id: '1', name: '6 am Rs Puram', imageUrl: '', durationText: '', distanceText: '', lat: 11.018, long: 76.968 },
  { id: '2', name: '6 am Ponnaiah Rajapuram', imageUrl: '', durationText: '', distanceText: '', lat: 11.017, long: 76.965 },
  { id: '3', name: '6 am Veerakeralam', imageUrl: '', durationText: '', distanceText: '', lat: 11.0165, long: 76.9705 },
];

export const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const apiStores = [
  {
    storeId: '1',
    storeName: 'Store 1',
    imageUrl: 'http://example.com/image1.png',
    durationText: '10 mins',
    distanceText: '2 km',
  },
  {
    storeId: '2',
    storeName: 'Store 2',
    imageUrl: 'http://example.com/image2.png',
    durationText: '15 mins',
    distanceText: '3 km',
  },
];

const mappedStores = apiStores.map(store => ({
  id: store.storeId,
  name: store.storeName,
  imageUrl: store.imageUrl,
  durationText: store.durationText,
  distanceText: store.distanceText,
  // ...other properties
}));
