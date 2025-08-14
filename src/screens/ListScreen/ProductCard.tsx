import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Product, RootStackParamList } from '../../types';
import { FontFamily } from '../../utils/constant';
import { imagePaths } from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import { useFocusEffect } from '@react-navigation/native';
interface ProductCardProps {
  product: Product & { mrp?: number };
  showSubscribeButton?: boolean;
}

type ProductCardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SingleProduct'
>;

const ProductCard: React.FC<ProductCardProps> = ({ product, showSubscribeButton }) => {
  console.log(product,": ProductCard")
  const navigation = useNavigation<ProductCardNavigationProp>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const selectQuantity = (qty: number) => {
    setQuantity(qty);
    setIsDropdownOpen(false);
  };

  const handleSubscribe = () => {
    navigation.navigate('SetSubscriptionScreen', {
      product,
      quantity,    // ← pass it here
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsDropdownOpen(false);
    }, [])
  );
  console.log(product,123156456)
  const ITEM_HEIGHT = hp(5);

  return (
    <>
      {isDropdownOpen && (
        <Pressable style={styles.overlay} onPress={() => setIsDropdownOpen(false)} />
      )}
      <View style={[styles.cardWrapper, isDropdownOpen && styles.cardWrapperOpen]}>
        <Pressable style={styles.cardTouchable} 
        onPress={() => navigation.navigate('SingleProduct',
         { product, productSkuCode: product.productSkuCode || product.id.toString(), quantity: quantity })}>
          <View style={[styles.card, isDropdownOpen && styles.cardOpen]}>
            <View style={styles.leftSection}>
              <Image source={{uri : product.image}} style={styles.image} />
              {/* Discount Badge */}
              {/* <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>10% OFF</Text>
              </View> */}
            </View>

            <View style={styles.rightSection}>
              <Text style={styles.name}>
                {(() => {
                  const match = product.name.match(/^([^\d]+)(.*)$/);
                  if (match) {
                    return (
                      <>
                        {match[1].trim()}
                        {match[2] && (
                          <>
                            {' '}
                            <Text style={styles.sizeText}>{match[2].trim()}</Text>
                          </>
                        )}
                      </>
                    );
                  }
                  return product.name;
                })()}
              </Text>
              <Text style={styles.priceRow}>
                <Text style={styles.price}>₹{product.today_price}</Text>{' '}
                <Text style={styles.mrp}>₹{product.mrp}</Text>
              </Text>

              <View style={[styles.quantitySection, isDropdownOpen && styles.quantitySectionOpen]}>
                {/* <View style={styles.quantityRow}>
                  <Text style={styles.quantityLabel}>Quantity</Text>
                  <Pressable style={{...styles.dropdownButton}} onPress={toggleDropdown}>
                    <Text style={styles.dropdownButtonText}>{quantity}</Text>
                    <Text style={[styles.dropdownArrow, isDropdownOpen && styles.dropdownArrowRotated]}>
                      ▼
                    </Text>
                  </Pressable>
                </View> */}

                {isDropdownOpen && (
                  <View style={styles.dropdownMenu}>
                    <ScrollView style={{ maxHeight: ITEM_HEIGHT * 3 }} nestedScrollEnabled={true}
                      showsVerticalScrollIndicator={false}

                    >
                      {[1, 2, 3, 4, 5].map((qty) => (
                        <Pressable
                          key={qty}
                          style={[styles.dropdownItem, qty === 5 && styles.dropdownItemLast]}
                          onPress={() => selectQuantity(qty)}
                        >
                          <Text style={styles.dropdownItemText}>{qty}</Text>
                          {quantity === qty && <Text style={styles.checkmark}>✓</Text>}
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
                  <Text style={styles.subscribeText}>Subscribe</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.addButton}>
                  <Text style={styles.cartIcon}>🛒</Text>
                  <Text style={styles.addText}>Add</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </View>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    zIndex: 1,
  },
  cardWrapperOpen: {
    zIndex: 1000,
  },
  cardTouchable: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.SelectedCard,
    borderRadius: wp(4),
    padding: wp(3),
    margin: wp(2),
    shadowColor: Colors.black,
    alignItems: 'flex-start',
    position: 'relative',
    zIndex: 1,
  },
  cardOpen: {
    zIndex: 1000,
  },
  leftSection: {
    width: wp(26),
    height: wp(26),
    marginRight: wp(2.5),
    flexShrink: 0,
    backgroundColor: Colors.white,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: wp(2.5),
    resizeMode: 'cover',
  },
  rightSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: sp(14),
    fontWeight: 'bold',
    color: Colors.black,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(0.5),
  },
  price: {
    fontSize: sp(15),
    fontWeight: 'bold',
    color: Colors.black,
  },
  mrp: {
    textDecorationLine: 'line-through',
    color: Colors.lightGrey,
    fontSize: sp(12),
    marginLeft: wp(1),
  },
  quantitySection: {
    width: '100%',
    position: 'relative',
    zIndex: 1,
    marginBottom: hp(1.5),
  },
  quantitySectionOpen: {
    zIndex: 1001,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center', // vertical alignment
    // justifyContent: 'space-between', // horizontal spacing
  },
  quantityLabel: {
    fontSize: sp(14),
    color: Colors.primary, // green
    fontWeight: 'bold',
  },
  dropdownButton: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft :5,
    // backgroundColor: Colors.greyBackground,
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: Colors.greyBackground,
    // paddingVertical: hp(1),
    paddingHorizontal: wp(1.5),
    minWidth: wp(5),
    height: hp(3.5),
  },
  dropdownButtonText: {
    fontSize: sp(14),
    color: Colors.black,
  },
  dropdownArrow: {
    fontSize: sp(12),
    color: Colors.lightGrey,
    marginLeft: wp(2),
    transform: [{ rotate: '0deg' }],
  },
  dropdownArrowRotated: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownMenu: {
    position: 'absolute',
    top: hp(5),
    right: hp(4.4),
    minWidth: wp(5), // restored for proper width
    backgroundColor: Colors.white,
    borderRadius: wp(2),
    borderWidth: 1,
    
    borderColor: Colors.greyBackground,
    zIndex: 1100,
    elevation: 25,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyBackground,
    minHeight: hp(5),
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: sp(14),
    color: Colors.black,
  },
  checkmark: {
    fontSize: sp(16),
    color: Colors.primary,
    fontWeight: 'bold',
    marginLeft :4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: wp(2),
    justifyContent :"flex-end"
  },
  subscribeButton: {
    flex: 1,
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: wp(2),
    paddingVertical: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2),
    shadowColor: Colors.primary,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 2,
  },
  subscribeText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: sp(13),
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.greyBackground,
    borderRadius: wp(2),
    paddingVertical: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 1,
  },
  cartIcon: {
    fontSize: sp(16),
    color: Colors.primary,
    marginRight: wp(1),
  },
  addText: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: sp(14),
  },
  discountBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#FF6A00',
    borderTopLeftRadius: wp(2.5),
    borderBottomRightRadius: wp(2.5),
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2),
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: sp(10),
    textAlign: 'center',
    lineHeight: sp(12),
  },
  sizeText: {
    fontWeight: 'normal',
    fontSize: sp(13),
    color: Colors.black,
  },
});


export default ProductCard;
