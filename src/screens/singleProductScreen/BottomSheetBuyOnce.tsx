import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {COLORS} from '../../utils/constant';
import {imagePaths} from '../../utils/constants/imagePaths';
import Colors from '../../utils/constants/colors';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {FontFamily} from '../../utils/constant';
import {Product} from '../../types';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const screenHeight = Dimensions.get('window').height;
const sheetHeight = screenHeight * 0.18;

interface BottomSheetBuyOnceProps {
  visible?: boolean;
  onClose?: () => void;
  pricePerUnit: number;
  product: Product;
  initialQuantity?: number; // Optional prop to set initial quantity
}

type PurchaseType = 'One Time' | 'Subscribe';

const BottomSheetBuyOnce: React.FC<BottomSheetBuyOnceProps> = ({
  visible,
  onClose,
  pricePerUnit,
  product,
  initialQuantity = 1,
}) => {
  const navigation = useNavigation<NavigationProp>();
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('Subscribe');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleIncrement = (): void =>
    setQuantity(prev => (prev < 10 ? prev + 1 : 10));
  const handleDecrement = (): void =>
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const totalPrice = pricePerUnit * quantity;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectPurchaseType = (type: PurchaseType) => {
    setPurchaseType(type);
    setIsDropdownOpen(false);
  };

  // useEffect(() => {
  //   if (purchaseType === 'Subscribe') {
  //     navigation.navigate('SetSubscriptionScreen', {product: product});
  //   }
  // }, [purchaseType, navigation, product]);

  // const handleAddToCart = () => {
  //   if (onClose) {
  //     onClose();
  //   }

  //   if (purchaseType === 'Subscribe') {
  //     navigation.navigate('SetSubscriptionScreen', {product: product});
  //   } else {
  //     navigation.navigate('OrderDetail', {
  //       orderItems: [
  //         {
  //           id: String(product.id),
  //           name: product.name,
  //           quantity: quantity,
  //           price: pricePerUnit,
  //           rating: product.rating ?? 0,
  //           description: product.description ?? 'No description available',
  //         },
  //       ],
  //     });
  //   }
  // };
  const handleAddToCart = () => {
    console.log('handleAddToCart ::', product);
    navigation.navigate('SetSubscriptionScreen', {product: product, quantity: quantity});
  };
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header row with labels */}
        <View style={styles.headerRow}>
          <View style={[styles.column, styles.quantityColumn]}>
            <Text style={styles.headerLabel}>Select quantity</Text>
          </View>
          <View style={[styles.column, styles.typeColumn]}>
            {/* <Text style={styles.headerLabel}>Purchase Type</Text> */}
          </View>
          <View style={[styles.column, styles.totalColumn]}>
            <Text style={styles.headerLabel}>Total</Text>
          </View>
        </View>

        {/* Content row with controls */}
        <View style={styles.controlsRow}>
          {/* Quantity selector */}
          <View style={[styles.column, styles.quantityColumn]}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity style={[styles.qtyBtn, quantity <= 1 && { backgroundColor: Colors.grey }]} onPress={handleDecrement} disabled={quantity <= 1}>
                <Text style={[styles.qtyBtnText, quantity <= 1 && { color: Colors.lightGrey }]}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity
                style={[
                  styles.qtyBtn,
                  quantity >= 10 && { backgroundColor: Colors.grey }
                ]}
                onPress={handleIncrement}
                disabled={quantity >= 10}
              >
                <Text style={[styles.qtyBtnText, quantity >= 10 && { color: Colors.lightGrey }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Purchase type dropdown (disabled, fixed to Subscribe) */}
          <View style={[styles.column, styles.typeColumn]}>
          {/* <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: wp(3),
              borderBottomWidth: 1,
              borderBottomColor: Colors.greyBackground,
              opacity: 0.5, 
            }}
            disabled={true} // Disable press
          >
            <Text style={styles.dropdownItemText}>Subscribe</Text>
            <Text style={styles.checkmark}>⦿</Text>
          </TouchableOpacity> */}
            {/* <View style={styles.dropdownContainer}>  V1 phase temp removed */}
              {/* <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
                <Text style={styles.dropdownButtonText}>{purchaseType}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity> */}

            {/* {isDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity 
                    style={styles.dropdownItem} 
                    onPress={() => selectPurchaseType('One Time')}
                  >
                    <Text style={styles.dropdownItemText}>One Time</Text>
                    {purchaseType === 'One Time' && (
                      <Text style={styles.checkmark}>⦿</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.dropdownItem} 
                    onPress={() => selectPurchaseType('Subscribe')}
                  >
                    <Text style={styles.dropdownItemText}>Subscribe</Text>
                    {purchaseType === 'Subscribe' && (
                      <Text style={styles.checkmark}>⦿</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )} */}
            {/* </View> */}
          </View>

          {/* Total price */}
          <View style={[styles.column, styles.totalColumn]}>
            <Text style={styles.total}>₹ {totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        {/* Add to Cart button */}
        {/* <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity> */}
         <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Subscribe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: wp(4),
    borderTopRightRadius: wp(4),
    elevation: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    padding: wp(2.5),
  },
  content: {
    padding: wp(3),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: hp(0.5),
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  quantityColumn: {
    flex: 1,
    marginRight: wp(5),
  },
  typeColumn: {
    flex: 1.2,
    marginHorizontal: wp(2.5),
  },
  totalColumn: {
    flex: 0.8,
    marginLeft: wp(5),
  },
  headerLabel: {
    fontSize: sp(13),
    color: Colors.black,
    textAlign: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: wp(8),
    height: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(2),
  },
  qtyBtnText: {
    fontSize: sp(20),
    color: Colors.black,
  },
  qtyText: {
    fontSize: sp(16),
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: wp(2.5),
  },
  dropdownItemText: {
    fontSize: sp(16),
    color: Colors.black,
  },
  checkmark: {
    fontSize: sp(16),
    color: Colors.primary,
    fontWeight: 'bold',
  },
  total: {
    fontSize: sp(16),
    fontWeight: '600',
    color: Colors.black,
  },
  addToCartBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(1.75),
    borderRadius: wp(2),
    alignItems: 'center',
    marginTop: hp(2),
  },
  addToCartText: {
    color: Colors.white,
    fontSize: sp(16),
    fontWeight: '600',
  },
});

export default BottomSheetBuyOnce;