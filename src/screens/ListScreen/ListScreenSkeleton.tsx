import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ScrollView } from 'react-native';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

const ListScreenSkeleton: React.FC = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const SkeletonBox = ({ width, height, style }: { width: string | number; height: number; style?: any }) => (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: '#E8E8E8',
          borderRadius: 6,
          opacity: shimmerOpacity,
        },
        style,
      ]}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header with back button and cart */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <SkeletonBox width={24} height={24} />
          <SkeletonBox width={80} height={20} />
          <SkeletonBox width={24} height={24} />
        </View>
      </View>
      
      <View style={styles.content}>
        {/* Left Sidebar - Categories */}
        <View style={styles.sidebar}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {['Milk', 'Ghee', 'Paneer', 'Flavored Milks', 'Butter', 'Sprouts'].map((_, index) => (
              <View key={`category-${index}`} style={styles.categoryItem}>
                <SkeletonBox 
                  width={50} 
                  height={50} 
                  style={{ borderRadius: 8, marginBottom: 8 }} 
                />
                <SkeletonBox width={45} height={12} />
              </View>
            ))}
          </ScrollView>
        </View>
        
        {/* Right Side - Product List */}
        <View style={styles.productArea}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {Array(4).fill(0).map((_, index) => (
              <View key={`product-${index}`} style={styles.productCard}>
                {/* Product Image */}
                <View style={styles.productImageContainer}>
                  <SkeletonBox 
                    width={100} 
                    height={100} 
                    style={{ borderRadius: 8 }} 
                  />
                </View>
                
                {/* Product Details */}
                <View style={styles.productDetails}>
                  {/* Product Title */}
                  <SkeletonBox width="80%" height={16} style={{ marginBottom: 8 }} />
                  
                  {/* Price */}
                  <View style={styles.priceContainer}>
                    <SkeletonBox width={60} height={18} style={{ marginRight: 8 }} />
                    <SkeletonBox width={40} height={14} />
                  </View>
                  
                  {/* Quantity Controls */}
                  <View style={styles.quantityContainer}>
                    <SkeletonBox width={80} height={14} style={{ marginBottom: 8 }} />
                    <SkeletonBox width={60} height={32} style={{ borderRadius: 4 }} />
                  </View>
                  
                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <SkeletonBox width={80} height={32} style={{ borderRadius: 4, marginRight: 8 }} />
                    <SkeletonBox width={60} height={32} style={{ borderRadius: 4 }} />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <SkeletonBox width={24} height={24} style={{ marginBottom: 4 }} />
          <SkeletonBox width={35} height={10} />
        </View>
        <View style={styles.navItem}>
          <SkeletonBox width={24} height={24} style={{ marginBottom: 4 }} />
          <SkeletonBox width={65} height={10} />
        </View>
        <View style={styles.navItem}>
          <SkeletonBox width={24} height={24} style={{ marginBottom: 4 }} />
          <SkeletonBox width={40} height={10} />
        </View>
        <View style={styles.navItem}>
          <SkeletonBox width={24} height={24} style={{ marginBottom: 4 }} />
          <SkeletonBox width={50} height={10} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    height: hp(7.5),
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyBackground,
    justifyContent: 'center',
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
  },
  content: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: wp(22),
    borderRightWidth: 1,
    borderRightColor: Colors.greyBackground,
    paddingVertical: hp(2),
  },
  categoryItem: {
    alignItems: 'center',
    paddingHorizontal: wp(3),
    paddingVertical: hp(2),
    marginBottom: hp(1),
  },
  productArea: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: Colors.greyBackground,
  },
  productImageContainer: {
    marginRight: wp(4),
  },
  productDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  quantityContainer: {
    marginBottom: hp(1.5),
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomNav: {
    height: hp(9),
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.greyBackground,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: hp(1),
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navItem: {
    alignItems: 'center',
  },
});


export default ListScreenSkeleton;