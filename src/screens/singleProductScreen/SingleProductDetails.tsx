import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Share, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { FontFamily } from '../../utils/constant';
import Colors from '../../utils/constants/colors';
import StarRating from '../HomeScreen/StarRating';
import SimpleIcon from '../../components/SimpleIcon';
import { Product } from '../../types';
import { RootState } from '../../redux/store';
import type { AppDispatch } from '../../redux/store';
import { imagePaths } from '../../utils/constants/imagePaths';
import { productDetailBannerSelector, productDetailBannerLoadingSelector } from '../../redux/Features/Promotion/promotionSlice';
import { fetchProductDetailBanner } from '../../redux/Features/Promotion/promotionThunk';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import { ProductDetailData } from '../../redux/Features/Product/product.types';

interface SingleProductDetailsProps {
  product: Product & {
    mrp?: number;
    volume?: string;
    star_rating?: number;
    likes?: number;
  };
  productDetail?: ProductDetailData;

  onBuyOncePress?: () => void;
}

const SingleProductDetails: React.FC<SingleProductDetailsProps> = ({ product, productDetail, onBuyOncePress }) => {
  console.log('SingleProductDetails images from API:', productDetail?.images);
  console.log('SingleProductDetails :', product);
  console.log('Number of product images:', productDetail?.images?.length);
  console.log('Product images:', productDetail?.images);

  const dispatch = useDispatch<AppDispatch>();
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  // Banner selectors
  const productDetailBanner = useSelector(productDetailBannerSelector);
  const productDetailBannerLoading = useSelector(productDetailBannerLoadingSelector);

  // Fetch product detail banner on component mount
  useEffect(() => {
    dispatch(fetchProductDetailBanner());
  }, [dispatch]);

  const toggleFavorite = (): void => {
    setIsFavorited((prev) => !prev);
  };
  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this product!',
        // url: 'https://your-product-link.com',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  const user = useSelector((state: RootState) => state.user);
  const hasActiveSubscription = user?.has_active_subscription;

  return (
    <View style={styles.content}>
      {/* <Image source={imagePaths.milk_img} style={styles.image} /> */}
      <View style={{ marginVertical: 8 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled>
          {productDetail?.images?.map((img, idx) => (
            <Image
              key={img.order || idx}
              source={{ uri: img.imageUrl }}
              style={styles.productImage}
            />
          ))}
        </ScrollView>
      </View>
      <View style={{ padding: 16 }}>
        <View style={styles.titleRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Text style={styles.title}>{productDetail?.productSkuName}</Text>
            {/* <Text style={styles.volume}>({product.volume || '1000 ml'})</Text> */}
          </View>
          <TouchableOpacity onPress={handleShare} style={styles.iconWrapper}>
            <Image source={imagePaths.share_icon} style={styles.shareIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.priceRow}>
          {productDetail?.mrp && <Text style={styles.mrp}>₹{productDetail?.mrp}</Text>}
          <Text style={styles.price}>₹{productDetail?.price}</Text>
        </View>

        {/* Ratings and Likes right now i ignore this code */}
        {/* <View style={styles.ratingRow}>
          <View style={styles.ratingRow}>
            <StarRating rating={product.star_rating || 0} />
            <Text style={styles.ratingText}>
              {product.rating}{' '}
              <Text style={styles.reviews}>({product.reviews} Reviews)</Text>
            </Text>
            <Text style={styles.dot}> | </Text>
            <Text style={styles.likes}>{product.likes} likes</Text>
          </View>
          <TouchableOpacity style={styles.iconWrapper} onPress={toggleFavorite}>
            <SimpleIcon
              source={imagePaths.favorite_icon}
              style={[styles.icon, { tintColor: isFavorited ? 'red' : '#888' }]}
            />
          </TouchableOpacity>
        </View> */}
      </View>
             {/* Product Detail Banner */}
       {productDetailBanner && Array.isArray(productDetailBanner) && productDetailBanner.length > 0 && !productDetailBannerLoading && (
         <View style={styles.bannerContainer}>
           <TouchableOpacity 
             disabled={true}  
             style={styles.bannerImage}
             onPress={() => {
               // Handle banner click - you can add navigation or other actions here
               console.log('Product Detail Banner clicked:', productDetailBanner[0]);
             }}
           >
             <Image 
               source={{ uri: productDetailBanner[0].imageUrl }}
               style={styles.bannerImageStyle}
               resizeMode="cover"
             />
           </TouchableOpacity>
         </View>
       )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {},
  image: {
    width: '100%',
    height: hp(31.25),
    resizeMode: 'cover',
  },
  title: {
    fontSize: sp(22),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
    color: Colors.textBlack,
  },
  productImage: {
  width: wp(100),
  height: hp(32),
  resizeMode: 'cover',
  borderRadius: wp(2),
  marginRight: wp(2),
},
  volume: {
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
    color: Colors.textBlack,
    marginLeft: wp(1.5),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mrp: {
    textDecorationLine: 'line-through',
    color: Colors.black,
    marginRight: wp(2.5),
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
  },
  price: {
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingText: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    color: Colors.textBlack,
    marginLeft: wp(1),
  },
  reviews: {
    color: Colors.black,
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
  },
  likes: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
  },
  dot: {
    color: Colors.black,
  },
  iconWrapper: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: Colors.greyBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: wp(5),
    height: wp(5),
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderColor: Colors.gradientGreen,
    borderWidth: 1,
    borderRadius: wp(4),
    padding: wp(4),
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: wp(4),
  },
  textContainer: {
    flex: 1,
  },
  badge: {
    position: 'absolute',
    top: hp(-3.75),
    left: wp(1.2),
    backgroundColor: Colors.gradientGreen,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: wp(3),
    alignSelf: 'flex-start',
    zIndex: 1,
  },
  badgeText: {
    color: Colors.white,
    fontSize: sp(10),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
  },
  CardTitle: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
    color: Colors.black,
    lineHeight: sp(22),
  },
  deliveryText: {
    color: Colors.gradientGreen,
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    marginTop: hp(1),
  },
  CardImage: {
    width: wp(18),
    height: wp(18),
    marginLeft: wp(4),
    paddingLeft: wp(25),
  },
  shareIcon: {
    width: wp(5),
    height: wp(5),
    tintColor: Colors.black,
    padding: wp(2.5),
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greyBanner: {
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(4),
    margin: wp(4),
    marginHorizontal: hp(4),
    height: hp(15),
  },
  bannerContainer: {
    width: wp(90),
    marginBottom: hp(1.5),
    borderRadius: wp(2.5),
    overflow: 'hidden',
    marginHorizontal: wp(5),
  },
  bannerImage: {
    width: '100%',
    height: hp(15),
  },
  bannerImageStyle: {
    width: '100%',
    height: '100%',
  },
});


export default SingleProductDetails;