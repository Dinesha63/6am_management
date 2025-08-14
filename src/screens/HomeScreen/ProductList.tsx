import React, {useState, useMemo} from 'react';
import {FlatList, View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {useSelector} from 'react-redux';
import ProductRow from './productRow';
import CategoryFilter from './CategoryFilter';
import Colors from '../../utils/constants/colors';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Product, RootStackParamList} from '../../types';
import {RootState} from '../../redux/store';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import {useRoute} from '@react-navigation/native';
import {selectCategory, selectProduct} from '../../redux/categorySlice';
import {useDispatch} from 'react-redux';
import {useEffect} from 'react';
import SimpleIcon from '../../components/SimpleIcon';
import {imagePaths} from '../../utils/constants/imagePaths';
import {Routes} from '../../navigation/routes';

interface ProductWithSubdivisions extends Product {
  subdivisions: Product[];
}

interface ProductListProps {
  products: ProductWithSubdivisions[];
}

type ProductListNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProductList: React.FC<ProductListProps> = ({products}) => {
  const navigation = useNavigation<ProductListNavigationProp>();
  const [selected, setSelected] = useState<string>('');
  const dispatch = useDispatch();
  const route = useRoute();
  const {category, product}: {category?: any; product?: any} =
    route.params || {};

  useEffect(() => {
    if (category) dispatch(selectCategory(category));
    if (product) dispatch(selectProduct(product));
  }, [category, product, dispatch]);

  const categories = useMemo<string[]>(() => {
    if (products.length > 1) {
      const unique = [...new Set(products.map(p => p.name))];
      return ['All', ...unique];
    }
    return [];
  }, [products]);

  useEffect(() => {
    if (products.length > 1) {
      setSelected('All');
    } else if (products.length === 1) {
      setSelected(products[0].name);
    } else {
      setSelected('');
    }
  }, [products]);
  const handleCategorySelect = (cat: string): void => {
    setSelected(cat);
  };

  const productsToDisplay =
    products.length > 1
      ? selected === 'All'
        ? products
        : products.find(p => p.name === selected)?.subdivisions || []
      : products[0]?.subdivisions || [];

  const shouldShowViewAll = productsToDisplay.length > 3;
  return (
<View style={{...styles.container}}>
      {products.length > 1 && (
        <CategoryFilter
          categories={categories}
          selected={selected}
          onSelect={handleCategorySelect}
        />
      )}

      {/* Show products or SKUs */}
      {productsToDisplay.slice(0, 3).map(item => (
        <ProductRow key={item.id} product={item} selected={selected} />
      ))}
      {shouldShowViewAll && (
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => {
            const selectedCategory = products.find(product => product.name);

            console.log('selectedCategory ::', selectedCategory);
            navigation.navigate(Routes.List, {
              category: selected === 'All' ? 'All' : selected,
              headerTitle: 'Products',
            });
          }}>
          <Text style={styles.exploreText}>View All </Text>
          <SimpleIcon
            source={imagePaths.Explore_icon}
            size={16}
            color={Colors.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
  },
  exploreButton: {
    alignSelf: 'flex-end',
    marginTop: hp(1),
    paddingHorizontal: wp(4.3),
    paddingVertical: hp(1.1),
    borderRadius: wp(5.3),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
    // borderColor: Colors.primary,
    // borderWidth: 1,
  },
  exploreText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: sp(14),
  },
});

export default ProductList;
