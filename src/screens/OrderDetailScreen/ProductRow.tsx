import React, { useState } from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {increment, decrement} from '../../redux/productSlice';
import { FontFamily} from '../../utils/constant';
import {RootState} from '../../redux/store';
import StarRating from '../HomeScreen/StarRating';
import { imagePaths } from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
interface ProductRowProps {
  item: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    rating: number;
    description: string;
  };
}

const ProductRow: React.FC<ProductRowProps> = ({item}) => {
    const [quantityOfItem, setQuantityOfItem] = useState<number>(item.quantity);
    // console.log(" quantity is :", quantityOfItem)
  
  console.log("item :", item);
  const dispatch = useDispatch();

  const handleIncrement = () => {
    console.log("increment"); 
    // dispatch(increment(item.id));
    setQuantityOfItem( prev =>prev > 1 ? prev + 1 : prev + 1);
  };

  const handleDecrement = () => {
    console.log("decrement");
    // dispatch(decrement());
    setQuantityOfItem( prev => prev > 1 ? prev - 1 : 1);
  };


  const quantity = useSelector(
    (state: RootState) =>
      state.products.catalog.items.find(p => p.code === item.id)?.count ?? item.quantity,
  );
  return (
    <View style={styles.itemCard}>
      <Image source={imagePaths.milk_img} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>
          {item.name} {item.description}
        </Text>
        <View style={styles.ratingContainer}>
          <StarRating rating={item.rating} />
          <Text style={styles.itemDescription}>
            Sells food, either fresh, specie, chili
          </Text>
        </View>
        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.quantityCircle}
            onPress={handleDecrement}>
            <Text style={styles.quantityText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityValue}>
            {quantityOfItem}
          </Text>
          <TouchableOpacity
            style={styles.quantityCircle}
            onPress={handleIncrement}>
            <Text style={styles.quantityText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.itemPrice}>
            <Text>Price: </Text>
            <Text>₹ {item.price.toFixed(2)}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    flexDirection: 'row',
    padding: wp(3),
    marginBottom: hp(2),
    backgroundColor: Colors.white,
    borderRadius: wp(2),
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.1,
    shadowRadius: wp(1),
    elevation: 8,
  },
  itemImage: {
    width: wp(32),
    height: hp(12),
    borderRadius: wp(2),
    backgroundColor: Colors.greyBackground,
  },
  itemDetails: {
    flex: 1,
    marginLeft: wp(3),
  },
  itemName: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
  },
  ratingContainer: {
    marginVertical: hp(0.5),
  },
  rating: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
  },
  starIcon: {
    color: Colors.primary,
  },
  itemDescription: {
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
    marginTop: hp(1),
  },
  quantityCircle: {
    width: wp(6.5),
    height: wp(6.5),
    borderRadius: wp(3.25),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: Colors.white,
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    bottom: hp(0.2),
  },
  quantityValue: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
  },
  itemPrice: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    color: Colors.black,
  },
});
export default ProductRow;
