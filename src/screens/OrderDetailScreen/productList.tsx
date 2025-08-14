import React from 'react';
import {View} from 'react-native';
import ProductRow from './ProductRow';
interface ProductListProps {
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    rating: number;
    description: string;
  }>;
}
const ProductList: React.FC<ProductListProps> = ({items}) => {
  return (
    <View>
      {' '}
      {items.map(item => (
        <ProductRow key={item.id} item={item} />
      ))}
    </View>
  );
};

export default ProductList;
