import React, { useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  SafeAreaView,
} from 'react-native';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

const { width } = Dimensions.get('window');

const HomeScreenSkeleton: React.FC = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
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
      <View style={styles.fixedTop}>
        {/* Header Skeleton */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <SkeletonBox width={120} height={24} style={{ marginBottom: 8 }} />
            <SkeletonBox width={180} height={16} />
          </View>
          <View style={styles.headerRight}>
            <SkeletonBox width={80} height={32} borderRadius={16} style={{ marginRight: 10 }} />
            <SkeletonBox width={32} height={32} borderRadius={16} />
          </View>
        </View>

        {/* Search Bar Skeleton */}
        <View style={styles.searchContainer}>
          <SkeletonBox width={width - 32} height={45} borderRadius={12} />
        </View>

        {/* Subscribe Button Skeleton */}
        <View style={styles.subscribeContainer}>
          <SkeletonBox width={width - 32} height={50} borderRadius={12} />
        </View>

        {/* Category Pills Skeleton */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryPills}>
              <SkeletonBox width={50} height={32} borderRadius={16} style={{ marginRight: 12 }} />
              <SkeletonBox width={60} height={32} borderRadius={16} style={{ marginRight: 12 }} />
              <SkeletonBox width={70} height={32} borderRadius={16} style={{ marginRight: 12 }} />
              <SkeletonBox width={80} height={32} borderRadius={16} style={{ marginRight: 12 }} />
              <SkeletonBox width={65} height={32} borderRadius={16} />
            </View>
          </ScrollView>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product List Skeletons */}
        {[1, 2, 3, 4].map((_, index) => (
          <View key={index} style={styles.productItemContainer}>
            <View style={styles.productItem}>
              <SkeletonBox width={80} height={80} borderRadius={12} />
              <View style={styles.productContent}>
                <View style={styles.productInfo}>
                  <SkeletonBox width="75%" height={20} style={{ marginBottom: 6 }} />
                  <SkeletonBox width="55%" height={16} style={{ marginBottom: 8 }} />
                  <View style={styles.ratingContainer}>
                    <SkeletonBox width={80} height={16} style={{ marginRight: 8 }} />
                  </View>
                  <SkeletonBox width="40%" height={18} />
                </View>
                <View style={styles.addButtonContainer}>
                  <SkeletonBox width={60} height={36} borderRadius={8} />
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Explore More Button */}
        <View style={styles.exploreContainer}>
          <SkeletonBox width={140} height={40} borderRadius={20} />
        </View>

        {/* Horizontal Banners Skeleton */}
        <View style={styles.bannerSection}>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.bannerScroll}
          >
            {[1, 2, 3].map((_, index) => (
              <View key={index} style={styles.bannerWrapper}>
                <SkeletonBox width={280} height={140} borderRadius={12} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Tab Bar Skeleton */}
        <View style={styles.tabBarContainer}>
          <View style={styles.tabBar}>
            {[1, 2, 3, 4].map((_, index) => (
              <View key={index} style={styles.tabItem}>
                <SkeletonBox width={24} height={24} borderRadius={4} style={{ marginBottom: 4 }} />
                <SkeletonBox width={50} height={12} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  fixedTop: {
    backgroundColor: Colors.white,
    paddingBottom: hp(1.2),
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyBackground,
  },
  scrollContent: {
    paddingBottom: hp(12.5),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: wp(4),
    marginBottom: hp(2),
  },
  subscribeContainer: {
    paddingHorizontal: wp(4),
    marginBottom: hp(2),
  },
  categoryContainer: {
    paddingLeft: wp(4),
    marginBottom: hp(1.2),
  },
  categoryPills: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productItemContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: wp(4),
    marginVertical: hp(1),
    borderRadius: wp(3),
    padding: wp(3),
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  productContent: {
    flex: 1,
    marginLeft: wp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productInfo: {
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  addButtonContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  exploreContainer: {
    alignItems: 'center',
    marginVertical: hp(2.5),
  },
  bannerSection: {
    marginTop: hp(1.2),
  },
  bannerScroll: {
    paddingLeft: wp(4),
  },
  bannerWrapper: {
    marginRight: wp(4),
  },
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.greyBackground,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: hp(1.5),
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default HomeScreenSkeleton;