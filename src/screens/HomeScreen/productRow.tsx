import React, {useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import SimpleIcon from '../../components/SimpleIcon';
import {FontFamily} from '../../utils/constant';
import {imagePaths} from '../../utils/constants/imagePaths';
import StarRating from './StarRating';
import CartButton from './CartButton';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Product, RootStackParamList} from '../../types';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

interface ProductRowProps {
  product: Product & {
    source?: string;
    star_rating?: number;
    mrp?: number;
  };
  selected?: string;
}

type ProductRowNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SingleProduct'
>;

// Function to separate product name and unit/quantity
const separateNameAndUnit = (productName: string) => {
  // Regex to match patterns like (250 ml), (1 kg), (500g), etc.
  const unitRegex = /\(([^)]+)\)/;
  const match = productName.match(unitRegex);
  
  if (match) {
    const unit = match[0]; // Full match including parentheses
    const name = productName.replace(unit, '').trim();
    return { name, unit };
  }
  
  // If no parentheses found, try to find patterns like "250 ml", "1 kg" at the end
  const endUnitRegex = /\s+(\d+\s*(?:ml|kg|g|l|pack|pcs|units?))$/i;
  const endMatch = productName.match(endUnitRegex);
  
  if (endMatch) {
    const unit = endMatch[0];
    const name = productName.replace(unit, '').trim();
    return { name, unit };
  }
  
  return { name: productName, unit: '' };
};

const ProductRow: React.FC<ProductRowProps> = ({product, selected}) => {
  useEffect(() => {
    console.log('ProductRow :', product);
  }, []);

  const navigation = useNavigation<ProductRowNavigationProp>();
  const { name, unit } = separateNameAndUnit(product.name);
  const isSpecificCategory = selected && selected !== 'All';
  
  return (
    <TouchableOpacity
      onPress={() => {
        if ('subdivisions' in product) {
          navigation.navigate('List', {
            category: product.name,
            headerTitle: 'Products',
          });
        } else {
          navigation.navigate('SingleProduct', {
            product: product,
            productSkuCode: product.productSkuCode || product.id.toString(),
          });
        }
      }}>
      <View style={styles.container_productrow}>
        <View style={styles.left}>
          <View style={styles.imagePlacholder}>
            <Image
              source={{ uri: product.imageUrl? product.imageUrl : product.image }}
                style={styles.productImage}/>
          </View>

          <View style={styles.details}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{name}</Text>
              {unit && (
                <Text style={[
                  styles.unit,
                  isSpecificCategory && styles.unitGrey
                ]}>
                  {unit}
                </Text>
              )}
            </View>
            {product.source && (
              <Text style={styles.source}>{product.source}</Text>
            )}
            {/* <StarRating rating={product.star_rating || 0} /> */}
            {product.mrp && product.today_price && (
            
              <Text
                style={{flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: hp(1)}}>
                <Text style={styles.mrp}>₹{product.mrp}</Text>
                <Text style={styles.price}> ₹{product.today_price}</Text>{' '}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.cartButtonWrapper}>
          {selected !== 'All' && <CartButton product={product} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container_productrow: {
    backgroundColor: Colors.white,
    borderRadius: wp(1.6),
    padding: wp(2),
    marginTop: hp(1.2),
    // shadowColor: Colors.black,
    // shadowOffset: {width: 0, height: hp(0.25)},
     borderColor: Colors.primary,
    borderWidth: 1,
  
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imagePlacholder: {
    width: 75,
    height: 75,
    borderRadius: wp(2.6),
    overflow: 'hidden',
    marginRight: wp(3.2),
  },
  details: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: hp(0.5),
  },
  name: {
    fontSize: sp(16),
    fontWeight: 'bold',
    fontFamily: FontFamily.REGULAR,
    color: '#474747',
    marginBottom: hp(2),
  },
  unit: {
    fontSize: sp(16),
    fontWeight: 'bold',
    fontFamily: FontFamily.REGULAR,
    color: '#474747',
    marginLeft: wp(1),

  },
  unitGrey: {
    color: Colors.lightGrey,
  },
  source: {
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
    color: Colors.lightGrey,
    marginBottom: hp(0.5),
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp(3.7),
    paddingVertical: hp(1),
    borderRadius: wp(2.1),
  },
  addText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: sp(14),
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  counterBtn: {
    fontSize: sp(18),
    fontWeight: 'bold',
    fontFamily: FontFamily.REGULAR,
    color: Colors.white,
    paddingHorizontal: wp(2),
  },
  addToCartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(1.5),
  },
  cartIcon: {
    width: wp(4.2),
    height: wp(4.2),
    tintColor: Colors.white,
  },
cartButtonWrapper: {
  position: 'absolute',
  bottom: hp(4),
  right: wp(1),
},

productImage: {
  width: '100%',
  height: '100%',
  resizeMode: 'cover',
  borderRadius: wp(2.6),
},
  price: {
    fontSize: sp(18),
    marginVertical: hp(0.5),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
  },
    mrp: {
    textDecorationLine: 'line-through',
    color: Colors.lightGrey,
    marginRight: wp(3),
    fontSize: sp(14),
    fontWeight: 'bold',
   
  },
});

export default ProductRow;
