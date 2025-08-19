
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchProductCatalog, fetchProductDetail } from './productThunk';
import {
  ProductCatalogItem,
  ProductDetailData,
  ProductState,
} from './product.types';

// --- Initial State ---
const initialState: ProductState = {
  catalog: {
    items: [],
    loading: false,
    error: null,
  },
  details: {
    productDetail: null,
    loading: false,
    error: null,
  },
};

// --- Product Slice ---
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProductCatalog: state => {
      state.catalog.items = [];
      state.catalog.error = null;
    },
    clearProductDetail: state => {
      state.details.productDetail = null;
      state.details.error = null;
    },
    setCatalogError: (state, action: PayloadAction<string>) => {
      state.catalog.error = action.payload;
      state.catalog.loading = false;
    },
    setDetailsLoading: (state, action: PayloadAction<boolean>) => {
      state.details.loading = action.payload;
    },
  },
  extraReducers: builder => {
    // Catalog
    builder
      .addCase(fetchProductCatalog.pending, state => {
        state.catalog.loading = true;
        state.catalog.error = null;
      })
      .addCase(
        fetchProductCatalog.fulfilled,
        (state, action: PayloadAction<ProductCatalogItem[]>) => {
          state.catalog.items = action.payload;
          state.catalog.loading = false;
          state.catalog.error = null;
        },
      )
      .addCase(fetchProductCatalog.rejected, (state, action) => {
        state.catalog.loading = false;
        state.catalog.error =
          (action.payload as string) || 'Failed to fetch product catalog';
      });

    // Details
    builder
      .addCase(fetchProductDetail.pending, state => {
        state.details.loading = true;
        state.details.error = null;
      })
      .addCase(
        fetchProductDetail.fulfilled,
        (state, action: PayloadAction<ProductDetailData>) => {
          state.details.productDetail = action.payload;
          state.details.loading = false;
          state.details.error = null;
        },
      )
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.details.loading = false;
        state.details.error =
          (action.payload as string) || 'Failed to fetch product detail';
      });
  },
});

// --- Exports ---
export const {
  clearProductCatalog,
  clearProductDetail,
  setCatalogError,
  setDetailsLoading,
} = productSlice.actions;

export const productReducer = productSlice.reducer;
