import { useCallback } from 'react';

import { RootState } from '../redux/store';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { fetchProductCatalog } from '../redux/Features/Product/productThunk';
import { clearProductCatalog } from '../redux/Features/Product/productSlice';

export const useProductCatalog = () => {
  const dispatch = useAppDispatch();

  const { items, loading, error } = useAppSelector((state: RootState) => state.products.catalog);
// console.log(items, loading, error, 'useProductCatalog');
  const getProductCatalog = useCallback(() => {
    dispatch(fetchProductCatalog());
  }, [dispatch]);

  const clearCatalog = useCallback(() => {
    dispatch(clearProductCatalog());
  }, [dispatch]);

  // Helper functions to filter products and SKUs
  const getProducts = useCallback(() => {
    return items.filter(item => !item.isSku);
  }, [items]);

  const getSkus = useCallback(() => {
    return items.filter(item => item.isSku);
  }, [items]);

  const getProductByName = useCallback((name: string) => {
    return items.find(item => item.name.toLowerCase().includes(name.toLowerCase()));
  }, [items]);

  return {
    items,
    loading,
    error,
    getProductCatalog,
    clearCatalog,
    getProducts,
    getSkus,
    getProductByName,
  };
}; 