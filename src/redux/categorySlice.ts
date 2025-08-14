// redux/slices/categorySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import categoriesData from '../utils/mock-data/Categories_Products.json';
interface ProductItem {
  product_id: string;
  main_product_name: string;
  image_url: string;
}

interface Category {
  category_name: string;
  category_id: string;
  products?: ProductItem[];
}

interface CategoryState {
  categories: Category[];
  selectedCategoryName: string;
  selectedProductName: string;
}

const initialState: CategoryState = {
  categories: categoriesData.categories,
  selectedCategoryName: 'Dairy Products',
  selectedProductName: 'Milk',
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    selectProduct: (state, action: PayloadAction<string>) => {
      state.selectedProductName = action.payload;
    },
    selectCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategoryName = action.payload;
    },
    resetCategoryState: (state) => {
      state.selectedCategoryName = 'Dairy Products';
      state.selectedProductName = 'Milk';
    },
  },
});

export const { selectProduct, selectCategory, resetCategoryState } = categorySlice.actions;
export default categorySlice.reducer;
