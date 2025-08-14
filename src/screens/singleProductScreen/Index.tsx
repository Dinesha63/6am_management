// SingleProductScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from './Header';
import SingleProductDetails from './SingleProductDetails';
import BottomSheetBuyOnce from './BottomSheetBuyOnce';
import ProductTabs from './ProductTabs';
import SingleProductSkeletonView from './SingleProductSkeletonView';
import { Product, RootStackParamList } from '../../types';
import { useProductDetails } from '../../hooks/useProductDetails';
import {
  getResponsiveHeight as hp,
} from '../../utils/constants/responsiveScreen';  
import Colors from '../../utils/constants/colors';

type RoutePropType = RouteProp<RootStackParamList, 'SingleProduct'>;
type NavPropType   = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  navigation: NavPropType;
}

const SingleProductScreen: React.FC<Props> = ({ navigation }) => {
  const route = useRoute<RoutePropType>();
  const { product, productSkuCode, quantity } = route.params;

  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false);
  
  // Use the product details hook to fetch API data
  const { productDetail, loading, error } = useProductDetails(productSkuCode);  //testing purpose "PS0001"
  
  // Show loading state while fetching product details
  const isLoading = loading;

  console.log('Product passed to SingleProductScreen:', product);
  console.log('ProductSkuCode:', productSkuCode);
  console.log('Product Detail from API:', productDetail);
  console.log('Loading:', loading);
  console.log('Error:', error);
  console.log("product.today_price:", product.today_price);

  if (isLoading) {
    return <SingleProductSkeletonView />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Header />
        <SingleProductDetails
          product={product}
          productDetail={productDetail}
          onBuyOncePress={() => setShowBottomSheet(true)}
        />
        <ProductTabs productDetail={productDetail} />
      </ScrollView>

      <BottomSheetBuyOnce
        visible={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        pricePerUnit={productDetail?.price}
        product={product}
        initialQuantity={quantity ?? 1}   // ← use route.params.quantity
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollViewContent: { paddingBottom: hp(24) },
});

export default SingleProductScreen;
