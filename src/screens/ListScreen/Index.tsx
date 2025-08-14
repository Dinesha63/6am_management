import React, {useMemo, useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../redux/store';
import {selectProduct} from '../../redux/categorySlice';
import Header from './Header';
import CategorySidebar from './CategorySidebar';
import ProductGrid from './ProductGrid';
import ListScreenSkeleton from './ListScreenSkeleton';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import { fetchProductCategoryListAPI } from '../../redux/Features/Product/productApi';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

const ListScreen: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categoryList, setCategoryList] = useState<any[]>([]);

  // ––– grab your params and fire off the right selectProduct –––
  const route = useRoute<RouteProp<RootStackParamList, 'List'>>();
  const routeCategory = route.params?.category;
  const routeProduct = (route.params as any)?.product;

  useEffect(() => {
    // if you passed a product, use that; otherwise fall back to the category
    const initial = routeProduct ?? routeCategory;
    if (initial) {
      dispatch(selectProduct(initial));
    }
  }, [routeCategory, routeProduct, dispatch]);

  const {categories, selectedCategoryName, selectedProductName} = useSelector(
    (state: RootState) => state.category,
  );
 

  const user = useSelector((state: RootState) => state.user);

  const isSubscribed = user?.has_active_subscription;
  const headerTitle = isSubscribed
    ? 'Products'
    : 'Subscribe for Morning Delivery';

  const {skus, product_id} = useSelector((state: RootState) => state.skus);

  const selectedProductFromApi = useMemo(() => {
    return categoryList
      .flatMap(cat => cat.product || [])
      .find(prod => prod.productName === selectedProductName);
  }, [categoryList, selectedProductName]);

  const filteredSkus = useMemo(() => {
    return selectedProductFromApi?.productSku || [];
  }, [selectedProductFromApi]);

  const formattedSkus = (filteredSkus as Array<any>).map(
    (sku, index: number) => ({
      id: sku.productSkuCode || index,
      name: sku.productSkuName,
      today_price: sku.price,
      mrp: sku.mrp,
      image: sku.imageUrl,
    }),
  );

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchProductCategoryListAPI();
        setCategoryList(result.data || []);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <ListScreenSkeleton />;
  }
  return (
    <View style={styles.container}>
      <Header title={headerTitle} />
      <View style={styles.content}>
        <View style={styles.sidebar}>
          <CategorySidebar
            categories={categoryList
              .flatMap(cat => cat.product || [])
              .map(prod => ({name: prod.productName, imageUrl: prod.imageUrl}))}
            selected={selectedProductName}
            onSelect={name => dispatch(selectProduct(name))}
          />
        </View>
        <View style={styles.productArea}>
          <ProductGrid products={formattedSkus} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: wp(24),
    borderRightWidth: wp(0.5),
    borderRightColor: Colors.greyBackground,
  },
  productArea: {
    width: wp(76),
  },
});

export default ListScreen;
