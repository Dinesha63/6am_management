import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, SafeAreaView, Animated } from 'react-native';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

const { width } = Dimensions.get('window');

const SingleProductSkeletonView: React.FC = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false, // Changed to false for backgroundColor animation
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    );

    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [shimmerAnim]);

  const shimmerColor = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E1E9EE', '#F5F5F5'],
  });

  const SkeletonBox = ({ 
    width: boxWidth, 
    height, 
    style, 
    borderRadius = 6 
  }: { 
    width: string | number; 
    height: number; 
    style?: any; 
    borderRadius?: number;
  }) => (
    <Animated.View
      style={[
        {
          width: boxWidth,
          height,
          backgroundColor: shimmerColor,
          borderRadius,
        },
        style,
      ]}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        {/* Header with back button and cart */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <SkeletonBox width={32} height={32} borderRadius={16} />
            <SkeletonBox width={32} height={32} borderRadius={16} />
          </View>
        </View>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <SkeletonBox width={width * 0.85} height={200} borderRadius={12} />
        </View>

        {/* Product Title and Share */}
        <View style={styles.productInfoContainer}>
          <View style={styles.productTitleContainer}>
            <SkeletonBox width={width * 0.65} height={24} />
            <SkeletonBox width={24} height={24} borderRadius={12} />
          </View>
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <View style={styles.priceContainer}>
            <SkeletonBox width={60} height={20} style={{ marginRight: 10 }} />
            <SkeletonBox width={80} height={26} />
          </View>
        </View>

        {/* Ratings and Reviews */}
        <View style={styles.ratingsContainer}>
          <SkeletonBox width={120} height={20} style={{ marginRight: 15 }} />
          <SkeletonBox width={80} height={18} style={{ marginRight: 15 }} />
          <SkeletonBox width={60} height={18} style={{ marginRight: 'auto' }} />
          <SkeletonBox width={28} height={28} borderRadius={14} />
        </View>

        {/* Subscription Card */}
        <View style={styles.subscriptionCardContainer}>
          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionLeft}>
              <SkeletonBox width={120} height={18} borderRadius={12} style={{ marginBottom: 8 }} />
              <SkeletonBox width={140} height={20} style={{ marginBottom: 6 }} />
              <SkeletonBox width={100} height={16} style={{ marginBottom: 6 }} />
              <SkeletonBox width={110} height={16} />
            </View>
            <View style={styles.subscriptionRight}>
              <SkeletonBox width={80} height={80} borderRadius={8} />
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsWrapper}>
            <SkeletonBox width={100} height={32} borderRadius={0} style={{ marginRight: 30 }} />
            <SkeletonBox width={80} height={24} borderRadius={0} style={{ marginRight: 30 }} />
            <SkeletonBox width={70} height={24} borderRadius={0} />
          </View>
        </View>

        {/* Description Content */}
        <View style={styles.descriptionContainer}>
          <SkeletonBox width={width * 0.9} height={16} style={{ marginBottom: 8 }} />
          <SkeletonBox width={width * 0.7} height={16} style={{ marginBottom: 8 }} />
          <SkeletonBox width={width * 0.8} height={16} />
        </View>

        {/* Purchase Controls Header */}
        <View style={styles.purchaseControlsContainer}>
          <View style={styles.selectionRow}>
            <SkeletonBox width={90} height={18} />
            <SkeletonBox width={100} height={18} />
            <SkeletonBox width={50} height={18} />
          </View>
          
          {/* Purchase Controls */}
          <View style={styles.actionRow}>
            <View style={styles.quantityControl}>
              <SkeletonBox width={35} height={40} borderRadius={8} />
              <SkeletonBox width={25} height={20} style={{ marginHorizontal: 15 }} />
              <SkeletonBox width={35} height={40} borderRadius={8} />
            </View>
            <SkeletonBox width={120} height={40} borderRadius={8} />
            <SkeletonBox width={80} height={24} />
          </View>
        </View>

        {/* Add to Cart Button */}
        <View style={styles.addToCartContainer}>
          <SkeletonBox width={width * 0.9} height={50} borderRadius={12} />
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollViewContent: {
    paddingBottom: hp(6.25), 
  },
  headerContainer: {
    paddingHorizontal: wp(5.5), 
    paddingTop: hp(1.25), 
    paddingBottom: hp(0.625), 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp(6.25), 
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: hp(2.5), 
    paddingHorizontal: wp(5.5),
  },
  productInfoContainer: {
    paddingHorizontal: wp(5.5),
    marginBottom: hp(1.25),
  },
  productTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSection: {
    paddingHorizontal: wp(5.5),
    marginBottom: hp(1.875), 
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(5.5),
    marginBottom: hp(2.5),
  },
  subscriptionCardContainer: {
    paddingHorizontal: wp(5.5),
    marginBottom: hp(2.5),
  },
  subscriptionCard: {
    flexDirection: 'row',
    padding: wp(5.5),
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(3.2),
    borderWidth: 1,
    borderColor: Colors.greyBackground,
  },
  subscriptionLeft: {
    flex: 1,
    marginRight: wp(4),
  },
  subscriptionRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    paddingHorizontal: wp(5.5),
    marginBottom: hp(2.5),
  },
  tabsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyBackground,
    paddingBottom: hp(1.25),
  },
  descriptionContainer: {
    paddingHorizontal: wp(5.5),
    marginBottom: hp(3.125),
  },
  purchaseControlsContainer: {
    paddingHorizontal: wp(5.5),
    marginBottom: hp(3.125),
  },
  selectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.875),
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addToCartContainer: {
    paddingHorizontal: wp(5.5),
    alignItems: 'center',
  },
});

export default SingleProductSkeletonView;