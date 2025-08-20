export interface StoreItem {
  storeId: string;
  storeCode: string;
  storeName: string;
  latitude: string;
  longitude: string;
  imageUrl: string;
  address: string;
}

export interface StoreListData {
  nearbyStoreDistance: number;
  storeList: StoreItem[];
}

export interface StoreListResponse {
  success: boolean;
  errors: string[];
  data: StoreListData;
  statusCode: number | null;
}

export interface StoreListState {
  nearbyStoreDistance: number;
  stores: StoreItem[];
  loading: boolean;
  error: string | null;
}
