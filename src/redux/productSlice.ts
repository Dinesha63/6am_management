import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import allProducts from './../utils/mock-data/all_products.json';
import { Product } from '../types';

interface ProductWithSubdivisions extends Product {
  subdivisions: Product[];
  count?: number;  // This tracks the quantity of each product
}

interface ProductState {
  items: ProductWithSubdivisions[];
}

const initialState: ProductState = {
  items: allProducts as ProductWithSubdivisions[],
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    increment: (state, action: PayloadAction<string | number>) => {
      const product = state.items.find(p => p.id === action.payload);
      if (product) {
        if (product.count === undefined) {
          product.count = 0;
        }
        product.count += 1;
      }
    },
    decrement: (state, action: PayloadAction<string | number>) => {
      const product = state.items.find(p => p.id === action.payload);
      if (product && product.count !== undefined && product.count > 0) {
        product.count -= 1;
      }
    },
  },
});

export const { increment, decrement } = productSlice.actions;
export default productSlice.reducer;

