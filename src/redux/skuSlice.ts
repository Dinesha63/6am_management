// redux/slices/skuSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import productSkuData from '../utils/mock-data/product_SKU.json';
interface SKU {
  product_skuid: string;
  product_skuName: string;
  mrp_price: string;
  today_price: number;
  image_list?: { image_url: string }[];
}

interface SKUState {
  skus: SKU[];
  product_id: string;
}

const initialState: SKUState = {
  skus: productSkuData.data.product_skus,
  product_id: productSkuData.data.product_id,
};

const skuSlice = createSlice({
  name: 'skus',
  initialState,
  reducers: {
    resetSkuState: (state) => {
      state.skus = productSkuData.data.product_skus;
      state.product_id = productSkuData.data.product_id;
    },
  },
});

export const { resetSkuState } = skuSlice.actions;
export default skuSlice.reducer;
