import React, { useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import ProductCard from './ProductCard';
import { Product } from '../../types';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

interface ProductGridProps {
  products: Product[];
  showSubscribeButton?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, showSubscribeButton }) => {
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const toggleDropdown = (id: string) =>
    setOpenCardId(prev => (prev === id ? null : id));

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
          <ProductCard
            product={item}
            showSubscribeButton={showSubscribeButton}
            isDropdownOpen={openCardId === item.id.toString()}
            onToggleDropdown={() => toggleDropdown(item.id.toString())}
          />
        </View>
      )}
      contentContainerStyle={styles.grid}
      removeClippedSubviews={false}
    />
  );
};

const styles = StyleSheet.create({
  grid: {
    paddingTop: hp(1),
    paddingBottom: hp(3),
    backgroundColor: Colors.white,
  },
  cardWrapper: {
    flex: 1,
    marginBottom: hp(1),
  },
});

export default ProductGrid;