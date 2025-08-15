import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Colors from '../../../utils/constants/colors';
import {FontFamily} from '../../../utils/constant';
import {useNavigation} from '@react-navigation/native';
import {imagePaths} from '../../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../../utils/constants/responsiveScreen';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types';
import {useProductCatalog} from '../../../hooks/useProductCatalog';
import {fetchProductCategoryListAPI} from '../../../redux/Features/Product/productApi';
import {ProductCategory} from '../../../redux/Features/Product/product.types';
import SimpleIcon from '../../../components/SimpleIcon';

const ExistingCustomerProductExplore = () => {
  const {items, loading, error, getProductCatalog} = useProductCatalog();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const currentDate = new Date();
  const formattedDate = `${String(currentDate.getDate()).padStart(
    2,
    '0',
  )}-${String(currentDate.getMonth() + 1).padStart(
    2,
    '0',
  )}-${currentDate.getFullYear()}`;
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  // console.log("categories ::",categories)

  useEffect(() => {
    getProductCatalog();
    fetchProductCategoryListAPI().then(response => {
      if (response.success) {
        setCategories(response.data);
        setSelectedCategory(response.data[0]?.categoryName || '');
      }
    });
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading products</Text>;

  if (!categories.length) return <Text>Loading categories...</Text>;

  const selectedCategoryData = categories.find(cat => cat.categoryName === selectedCategory);
  const selectedProducts = selectedCategoryData?.product || [];
  
  // If there's only 1 product, show its SKUs instead
  const displayItems = selectedProducts.length === 1 && selectedProducts[0]?.productSku?.length > 0 
    ? selectedProducts[0].productSku.map(sku => ({
        productCode: sku.productSkuCode,
        productName: sku.productSkuName,
        imageUrl: sku.imageUrl,
        price: sku.price,
        mrp: sku.mrp,
        isSku: true
      }))
    : selectedProducts;


    // console.log("selectedProducts ::",selectedProducts)
  // const handleSubscribe = () => {
  //   navigation.navigate('SetSubscriptionScreen', { key: value });
  // };

  return (
    <View style={styles.productcontainer}>
      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{marginBottom: hp(2)}}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.categoryCode}
            style={[
              styles.categoryPill,
              selectedCategory === cat.categoryName && styles.selectedPill,
            ]}
            onPress={() => setSelectedCategory(cat.categoryName)}>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat.categoryName &&
                  styles.selectedCategoryText,
              ]}>
              {cat.categoryName}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Product Explore Section */}
      <View style={{width: '95%'}}>
        <View style={styles.exploreContainer}>
          <Text style={styles.exploreTitle}>Explore Products</Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() =>
              navigation.navigate('List', {
                category: 'Milk',
                headerTitle: 'Products',
              })
            }>
            <Text style={styles.exploreText}>View All</Text>
            <SimpleIcon source={imagePaths.Explore_icon} size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {displayItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.shadowWrapper}
                                            onPress={() => {
                if ((item as any).isSku) {
                  // Navigate to SingleProduct screen for SKUs
                  navigation.navigate('SingleProduct', {
                    product: {
                      id: (item as any).productCode,
                      name: (item as any).productName,
                      imageUrl: (item as any).imageUrl,
                      today_price: (item as any).price,
                      productSkuCode: (item as any).productCode,
                    },
                    productSkuCode: (item as any).productCode,
                  });
                } else {
                  // Navigate to List screen for regular products
                  navigation.navigate('List', {
                    category: item.productName,
                    headerTitle: 'Products',
                  });
                }
              }}>
              <View style={styles.productCard}>
                <Image
                  source={{uri: item?.imageUrl || ""}}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <Text style={styles.productName}>{item.productName}</Text>
               {!displayItems && <Text
                  style={{
                    fontSize: sp(18),
                    color: '#FFD700',
                    paddingLeft: wp(2.5),
                    marginBottom: hp(0.8),
                  }}>
                  ★★★★★
                </Text>}  
                <View style={styles.priceRow}>
                  {(item as any).isSku && (item as any).price && (
                    <Text style={styles.productPrice}>
                      ₹{(item as any).price}
                      {(item as any).mrp && (item as any).mrp > (item as any).price && (
                        <Text style={styles.mrpText}> ₹{(item as any).mrp}</Text>
                      )}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productcontainer: {
    // marginTop: hp(1),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(30),
  },
  exploreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(4),
    backgroundColor: Colors.lightblue,
    marginRight: wp(2),
  },
  exploreText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: sp(14),
  },
  exploreTitle: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
    color: Colors.blackText,
    marginLeft: wp(4),
  },
  sourceText: {
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
    color: Colors.itemText,
    marginBottom: hp(0.6),
    paddingLeft: wp(2.5),
  },
  productImage: {
    width: '100%',
    height: hp(16),
    borderRadius: wp(3),
    marginBottom: hp(1.2),
    backgroundColor: Colors.white,
  },
  productName: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    color: Colors.grey,
    textAlign: 'left',
    paddingLeft: wp(2.5),
    marginBottom: hp(0.5),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingRight: wp(2.5),
  },
  productPrice: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
    color: Colors.danger,
    paddingLeft: wp(2.5),
  },
  mrpText: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'normal',
    color: Colors.grey,
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: wp(4),
    width: wp(7),
    height: hp(3.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    color: Colors.white,
    fontSize: sp(15),
    fontFamily: FontFamily.REGULAR,
    marginTop: hp(-0.25),
  },

  shadowWrapper: {
    marginRight: wp(4),
    marginLeft: wp(3),
    marginBottom: wp(3),
    marginTop: wp(1),
    backgroundColor: Colors.white,
    borderRadius: wp(5),
    shadowColor: Colors.blackText,
  },

  productCard: {
    width: wp(45),
    maxHeight: hp(26),
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    padding: wp(2),
  },
  categoryPill: {
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.8),
    borderRadius: wp(5),
    marginRight: wp(2.5),
  },
  selectedPill: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: sp(14),
  },
  selectedCategoryText: {
    color: Colors.white,
  },
  subscribeButton: {
    flex: 0.6,
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: wp(2),
    paddingVertical: hp(0.5),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
  },
  subscribeText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: sp(13),
  },
});

export default ExistingCustomerProductExplore;
