import { createAsyncThunk } from '@reduxjs/toolkit';
import { getProductCatalogAPI, fetchProductDetailAPI } from './productApi';
import { ProductCatalogItem } from './product.types';

export const fetchProductCatalog = createAsyncThunk(
  'product/fetchProductCatalog',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProductCatalogAPI();
      console.log('Product Catalog API Response:', response);
      if (response.success) {
        return response.data as ProductCatalogItem[];
      } else {
        console.error('Product catalog fetch failed:', response);
        return rejectWithValue('Failed to fetch product catalog');
      }
    } catch (err: any) {
      console.error('Error in fetchProductCatalog:', err);
      return rejectWithValue(err.response?.data?.message || 'Network error occurred');
    }
  }
);

export const fetchProductDetail = createAsyncThunk(
  'productDetails/fetchProductDetail',
  async (productSkuCode: string, { rejectWithValue }) => {
    try {
      const response = await fetchProductDetailAPI(productSkuCode);
      console.log('fetchProductDetail ::', response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch product detail');
    }
  }
);
