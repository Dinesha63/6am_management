import API from '../../../services/api';
import { ProductCatalogResponse, ProductCategoryListResponse, ProductDetailResponse } from './product.types';


export const getProductCatalogAPI = async (): Promise<ProductCatalogResponse> => {
  console.log('📦 [API CALL] getProductCatalogAPI started...');
  try {
    const response = await API.get('/ProductCatalog/GetProductAndSkuNameList');
    console.log('✅ [API SUCCESS] Product Catalog Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ [API ERROR] Failed to fetch product catalog:', error);
    throw error;
  }
};

// Product Catalog API
export const fetchProductCategoryListAPI = async (): Promise<ProductCategoryListResponse> => {
  const response = await API.get('/ProductCatalog/GetProductCategoryList');
  return response.data;
};

// Product Details API
export const fetchProductDetailAPI = async (
  productSkuCode: string
): Promise<ProductDetailResponse> => {
  const response = await API.get('/ProductCatalog/GetProductDetail', {
    params: { ProductSkuCode: productSkuCode }
  });
  return response.data;
};