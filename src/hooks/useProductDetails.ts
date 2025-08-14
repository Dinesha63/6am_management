import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from '../redux/store';
import { fetchProductDetail } from '../redux/Features/Product/productThunk';
import { clearProductDetail } from '../redux/Features/Product/productSlice';


export const useProductDetails = (productSkuCode?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const {productDetail, loading, error} = useSelector(
    (state: RootState) => state.products.details,
  ) as {productDetail: any; loading: boolean; error: string | null};

  useEffect(() => {
    if (productSkuCode) {
      dispatch(fetchProductDetail(productSkuCode));
    }

    return () => {
      // Clean up when component unmounts
      dispatch(clearProductDetail());
    };
  }, [dispatch, productSkuCode]);

  const refetchProductDetail = (skuCode: string) => {
    dispatch(fetchProductDetail(skuCode));
  };

  return {
    productDetail,
    loading,
    error,
    refetchProductDetail,
  };
}; 