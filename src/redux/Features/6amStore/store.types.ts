export interface StoreItem {
  storeId: string;
  storeName: string;
  latitude:  string;
  longitude: string;
  imageUrl:  string;
  address:   string; // <-- add this line
}

export interface StoreListResponse {
  data: {
    nearbyStoreDistance: number;      // in km
    storeList:           StoreItem[];
  }
}

export interface StoreListState {
  nearbyStoreDistance: number;
  stores:              StoreItem[];
  loading:             boolean;
  error:               string | null;
}