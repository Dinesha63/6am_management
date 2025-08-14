import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Text,
} from 'react-native';
import ProductList from './ProductList';
import Header from './Header';
import SearchBar from './SearchBar';
import SubscribeButton from './SubscribeButton';
import allProducts from '../../utils/mock-data/all_products.json';
import {imagePaths} from '../../utils/constants/imagePaths';
import SimpleIcon from '../../components/SimpleIcon';
import {Product} from '../../types';
import ExistingCustomerDetails from '../HomeScreen/ExistingCustomer/ExistingCustomerDetails';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../redux/store';
import HomeScreenSkeleton from './HomeScreenSkeleton';
import {useProductCatalog} from '../../hooks/useProductCatalog';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import BodyText from '../../components/BodyText';
import Colors from '../../utils/constants/colors';
import {ProductCatalogItem} from '../../redux/Features/Product/product.types';
import SingleProductScreen from '../singleProductScreen/Index';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import type {AppDispatch} from '../../redux/store';
import ApiContext from '../../context/ApiContext';
import {fetchCustomerSubscriptionInfo} from '../../redux/Features/Customer/customerSubscriptionThunk';
import {fetchPromotionImage} from '../../redux/Features/Promotion/promotionThunk';
import {promotionSelctor} from '../../redux/Features/Promotion/promotionSlice';
import {IMAGE_API_BASE_URL} from '../../config/api';
import {fetchProductCategoryListAPI} from '../../redux/Features/Product/productApi';
import {fetchCustomerInfo} from '../../redux/Features/Customer/thunks/customerThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontFamily} from '../../utils/constant';
import {fetchCustomerSubscriptionInfoAPI} from '../../redux/Features/Customer/customerSubscriptionApi';
import {CustomerSubscriptionData} from '../../redux/Features/Customer/customerSubscription.types';
import {
  otpSelector,
  resetOtpState,
} from '../../redux/Features/OtpGeneration/otpSlice';
import { fetchProductDetail } from '../../redux/Features/Product/productThunk';

interface ProductWithSubdivisions {
  id: string | number;
  name: string;
  description?: string;
  image?: string;
  price?: number;
  today_price: number;
  category?: string;
  rating?: number;
  reviews?: number;
  is_favorite?: boolean;
  quantity?: number;
  unit?: string;
  subdivisions: Product[];
}

const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [products, setProducts] = useState<ProductWithSubdivisions[]>([]);
  const [subscriptionData, setSubscriptionData] =
    useState<CustomerSubscriptionData | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [promotionIndex, setPromotionIndex] = useState(0);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);
  const promotionScrollTimer = useRef<NodeJS.Timeout | null>(null);
  const isUserScrolling = useRef(false);
  const isAutoScrolling = useRef(false);
  const isPromotionScrolling = useRef(false);
  const isUserPromotionScrolling = useRef(false);
  const promotionScrollRef = useRef<ScrollView>(null);

  const nextDelivery = useSelector(
    (state: RootState) => state.customerSubscription.data ?? [],
  );
  // console.log("nextDelivery ::",nextDelivery)
  const {data, loading} = useSelector(promotionSelctor);
  const {isOtpVerified} = useSelector(otpSelector);
  // const isSubscribed = false;
  useEffect(() => {
    console.log('dataImf', data, loading);
    console.log('isSubscrddibed', isSubscribed);
  }, []);
  const {
    getProductCatalog,
    items: productCatalogItems,
    loading: productCatalogLoading,
    error: productCatalogError,
  } = useProductCatalog();
  // console.log(productCatalogItems, "ertyuio")
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const apiContext = useContext(ApiContext);

  const customerInfo = useSelector((state: RootState) => state.customer.data);

  const isSubscribed = customerInfo?.isSubscribed;

  const subscriptionInfo = useSelector(
    (state: RootState) => state.customerSubscription.data,
  );
  // console.log("subscriptionInfo ::", subscriptionInfo)
  const promotionImage = useSelector(
    (state: RootState) => state.promotion.data ?? null,
  );
  // console.log(promotionImage, "promddotionImage")
  useEffect(() => {
    if (customerInfo && customerInfo.customerName) {
      AsyncStorage.setItem('customerName', customerInfo.customerName);
    }
  }, [customerInfo,isOtpVerified]);
 console.log('calling...........');
    const loadSubscription = async () => {
      if (!apiContext) return;
      const phoneNumber = await apiContext.api.getStoredPhoneNumber();
      console.log('Fetched phone number:', phoneNumber);

      if (!phoneNumber) return;
      try {
        const result = await fetchCustomerSubscriptionInfoAPI(phoneNumber);
        console.log('result result ::', result);
        console.log('result result ::', result);
        setSubscriptionData(result?.data);
        console.log('subscriptionData ::', subscriptionData);
      } catch (error) {
        console.error('Failed to load subscription info:', error);
      }
    };

  // Create infinite scroll data by tripling the original data
  const infiniteScrollData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];

    // Triple the data for seamless infinite scroll
    return [...data, ...data, ...data];
  }, [data]);

  // Create infinite scroll data for promotion images
  const infinitePromotionData = useMemo(() => {
    if (
      !promotionImage ||
      !Array.isArray(promotionImage) ||
      promotionImage.length === 0
    )
      return [];

    // Triple the data for seamless infinite scroll
    return [...promotionImage, ...promotionImage, ...promotionImage];
  }, [promotionImage,isOtpVerified]);

  const BANNER_WIDTH = wp(66);
  const BANNER_MARGIN = wp(3);
  const ITEM_WIDTH = BANNER_WIDTH + BANNER_MARGIN;

  const PROMOTION_WIDTH = wp(100); // Full screen width
  const PROMOTION_MARGIN = 0; // No margin between banners
  const PROMOTION_ITEM_WIDTH = PROMOTION_WIDTH + PROMOTION_MARGIN;
  const initializeData = async () => {
    try {
      console.log('HomeScreen: Initializing data...');
      getProductCatalog();
      await new Promise(resolve => setTimeout(resolve));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    initializeData();
    fetchCustomer();
    loadPromotionImage();
    loadSubscription();
  }, []);
  useEffect(() => {
    if (isOtpVerified) {
      fetchCustomer();
      initializeData();
    loadSubscription();
      loadPromotionImage();
      resetOtpState();
    }
  }, [isOtpVerified]);

  useEffect(() => {
    fetchProductCategoryListAPI()
      .then(response => {
        // Transform API data to ProductWithSubdivisions[]
        const transformed = (response.data || [])
          .map(category =>
            category.product.map(product => ({
              id: product.productCode,
              name: product.productName,
              image: product.imageUrl ?? undefined,
              today_price: product.productSku[0]?.price ?? 0,
              subdivisions: product.productSku.map(sku => ({
                id: sku.productSkuCode,
                name: sku.productSkuName,
                imageUrl: sku.imageUrl ?? '',
                today_price: sku.price,
                mrp: sku.mrp,
              })),
            })),
          )
          .flat();
        setProducts(transformed);
      })
      .catch(error => {
        console.error('fetchProductCategoryListAPI error:', error);
      });
  }, [isOtpVerified]);
  const fetchCustomer = async () => {
    if (!apiContext) return;

    try {
      const phoneNumber = await apiContext.api.getStoredPhoneNumber();
      console.log('Fetched phone number:', phoneNumber);

      if (!phoneNumber) return;

      const customerInfo = await dispatch(
        fetchCustomerInfo(phoneNumber),
      ).unwrap();
      console.clear();
      console.log('fetchCustomerInfo result:', customerInfo);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  const loadPromotionImage = async () => {
    const screen = 'Home - Guest';
    if (!screen) return;

    try {
      const result = await dispatch(fetchPromotionImage(screen)).unwrap();
      console.log('✅ fetchPromotionImage result:', result);
    } catch (error) {
      console.error('❌ fetchPromotionImage error:', error);
    }
  };

  // Auto scroll effect for promotion images
  useEffect(() => {
    if (!infinitePromotionData.length || infinitePromotionData.length < 3)
      return;

    const originalDataLength = infinitePromotionData.length / 3;
    if (originalDataLength === 0) return;

    let mounted = true;

    const startPromotionAutoScroll = () => {
      if (promotionScrollTimer.current) {
        clearInterval(promotionScrollTimer.current);
      }

      promotionScrollTimer.current = setInterval(() => {
        if (!isUserPromotionScrolling.current && mounted) {
          isPromotionScrolling.current = true;

          setPromotionIndex(prevIndex => {
            const nextIndex = prevIndex + 1;

            // Reset to beginning of second set when reaching end of second set
            if (nextIndex >= originalDataLength * 2) {
              setTimeout(() => {
                if (mounted && !isUserPromotionScrolling.current) {
                  promotionScrollRef.current?.scrollTo({
                    x: originalDataLength * PROMOTION_ITEM_WIDTH,
                    animated: false,
                  });
                  isPromotionScrolling.current = false;
                }
              }, 300);
              return originalDataLength;
            }

            const targetX = nextIndex * PROMOTION_ITEM_WIDTH;
            promotionScrollRef.current?.scrollTo({
              x: targetX,
              animated: true,
            });

            setTimeout(() => {
              isPromotionScrolling.current = false;
            }, 300);

            return nextIndex;
          });
        }
      }, AUTO_SCROLL_INTERVAL);
    };

    // Initial setup - position to middle set for seamless scrolling
    const setupPromotionTimer = setTimeout(() => {
      if (mounted) {
        promotionScrollRef.current?.scrollTo({
          x: originalDataLength * PROMOTION_ITEM_WIDTH,
          animated: false,
        });
        setPromotionIndex(originalDataLength);
        startPromotionAutoScroll();
      }
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(setupPromotionTimer);
      if (promotionScrollTimer.current) {
        clearInterval(promotionScrollTimer.current);
      }
    };
  }, [infinitePromotionData]);
  //fetchProductCatalog
  useFocusEffect(
    useCallback(() => {
      setSearchQuery('');
      setShowDropdown(false);
    }, []),
  );

  // Constants for auto-scroll
  const AUTO_SCROLL_INTERVAL = 4000; // 4 seconds interval

  // Fixed auto scroll effect
  useEffect(() => {
    if (!infiniteScrollData.length || infiniteScrollData.length < 3) return;

    const originalDataLength = infiniteScrollData.length;
    if (originalDataLength === 0) return;

    let mounted = true;

    const startAutoScroll = () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }

      autoScrollTimer.current = setInterval(() => {
        if (!isUserScrolling.current && mounted) {
          isAutoScrolling.current = true;

          setBannerIndex(prevIndex => {
            const nextIndex = prevIndex + 1;

            // Reset to beginning of second set when reaching end of second set
            if (nextIndex >= originalDataLength * 2) {
              setTimeout(() => {
                if (mounted && !isUserScrolling.current) {
                  scrollRef.current?.scrollTo({
                    x: originalDataLength * ITEM_WIDTH,
                    animated: false,
                  });
                  isAutoScrolling.current = false;
                }
              }, 300);
              return originalDataLength;
            }

            const targetX = nextIndex * ITEM_WIDTH;
            scrollRef.current?.scrollTo({
              x: targetX,
              animated: true,
            });

            setTimeout(() => {
              isAutoScrolling.current = false;
            }, 300);

            return nextIndex;
          });
        }
      }, AUTO_SCROLL_INTERVAL);
    };

    // Initial setup - position to middle set for seamless scrolling
    const setupTimer = setTimeout(() => {
      if (mounted) {
        scrollRef.current?.scrollTo({
          x: originalDataLength * ITEM_WIDTH,
          animated: false,
        });
        setBannerIndex(originalDataLength);
        startAutoScroll();
      }
    }, 100);

    return () => {
      mounted = false;
      clearTimeout(setupTimer);
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, []);

  // Promotion scroll handler
  const handlePromotionScroll = (event: any) => {
    // Don't interfere with auto-scroll
    if (isPromotionScrolling.current) return;

    const contentOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffset / PROMOTION_ITEM_WIDTH);
    const originalDataLength = infinitePromotionData.length / 3;

    if (originalDataLength === 0) return;

    setPromotionIndex(currentIndex);

    // Handle infinite scroll boundaries only when user is not scrolling
    if (!isUserPromotionScrolling.current) {
      if (currentIndex <= 0) {
        // If at the beginning, jump to the end of first set
        setTimeout(() => {
          promotionScrollRef.current?.scrollTo({
            x: originalDataLength * PROMOTION_ITEM_WIDTH,
            animated: false,
          });
          setPromotionIndex(originalDataLength);
        }, 50);
      } else if (currentIndex >= originalDataLength * 2) {
        // If at the end, jump to the beginning of second set
        setTimeout(() => {
          promotionScrollRef.current?.scrollTo({
            x: originalDataLength * PROMOTION_ITEM_WIDTH,
            animated: false,
          });
          setPromotionIndex(originalDataLength);
        }, 50);
      }
    }
  };

  const handlePromotionScrollBeginDrag = () => {
    isUserPromotionScrolling.current = true;
    isPromotionScrolling.current = false;
    if (promotionScrollTimer.current) {
      clearInterval(promotionScrollTimer.current);
    }
  };

  const handlePromotionScrollEndDrag = () => {
    // Small delay to ensure scroll has settled
    setTimeout(() => {
      isUserPromotionScrolling.current = false;

      // Check if we need to adjust position after user scroll
      const originalDataLength = infinitePromotionData.length / 3;
      if (originalDataLength === 0) return;

      // Get current position
      setTimeout(() => {
        if (promotionScrollRef.current) {
          // Restart auto scroll after user stops scrolling
          const restartPromotionAutoScroll = () => {
            if (promotionScrollTimer.current) {
              clearInterval(promotionScrollTimer.current);
            }

            promotionScrollTimer.current = setInterval(() => {
              if (!isUserPromotionScrolling.current) {
                isPromotionScrolling.current = true;

                setPromotionIndex(prevIndex => {
                  const nextIndex = prevIndex + 1;

                  if (nextIndex >= originalDataLength * 2) {
                    setTimeout(() => {
                      if (!isUserPromotionScrolling.current) {
                        promotionScrollRef.current?.scrollTo({
                          x: originalDataLength * PROMOTION_ITEM_WIDTH,
                          animated: false,
                        });
                        isPromotionScrolling.current = false;
                      }
                    }, 300);
                    return originalDataLength;
                  }

                  const targetX = nextIndex * PROMOTION_ITEM_WIDTH;
                  promotionScrollRef.current?.scrollTo({
                    x: targetX,
                    animated: true,
                  });

                  setTimeout(() => {
                    isPromotionScrolling.current = false;
                  }, 300);

                  return nextIndex;
                });
              }
            }, AUTO_SCROLL_INTERVAL);
          };

          restartPromotionAutoScroll();
        }
      }, 100);
    }, 200);
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    try {
      console.log('HomeScreen: Refreshing data...');
      getProductCatalog();
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  // Filter product catalog items for dropdown
  const dropdownMatches = useMemo(() => {
    if (!searchQuery) return [];
    const lowerQuery = searchQuery.toLowerCase();
    return productCatalogItems.filter(item =>
      item.name.toLowerCase().includes(lowerQuery),
    );
  }, [searchQuery, productCatalogItems]);

  const filteredProducts = useMemo<ProductWithSubdivisions[]>(() => {
    console.log('🔍 Original products:', products);
    console.log('🔎 Search query:', searchQuery);
    if (!searchQuery) {
      return products;
    }
    const lowerQuery = searchQuery.toLowerCase();
    return products
      .map(product => {
        const productMatches = product.name.toLowerCase().includes(lowerQuery);
        const filteredSubdivisions = product.subdivisions.filter(sub =>
          sub.name.toLowerCase().includes(lowerQuery),
        );
        if (productMatches || filteredSubdivisions.length > 0) {
          return {
            ...product,
            subdivisions: productMatches
              ? product.subdivisions
              : filteredSubdivisions,
          };
        }
        return null;
      })
      .filter(
        (product): product is ProductWithSubdivisions => product !== null,
      );
  }, [searchQuery, products]);

const handleDropdownSelect = async (item: ProductCatalogItem) => {
  console.log('Selected Item:', item);

  setSearchQuery(item.name);
  setShowDropdown(false);

  if (item.isSku) {
    console.log('Navigating to SingleProduct with SKU:', item.code);

    try {
      const productDetail = await dispatch(
        fetchProductDetail(item.code)
      ).unwrap();
      const productToSend = {
        id: productDetail.productSkuCode,
        name: productDetail.productSkuName,
        imageUrl: productDetail.images?.[0]?.imageUrl || '',
        today_price: productDetail.price,
        productSkuCode: productDetail.productSkuCode,
      };

      navigation.navigate('SingleProduct', {
        product: productToSend,
        productSkuCode: productDetail.productSkuCode,
      });
    } catch (err) {
      console.error('Failed to fetch product details:', err);
    }
  } else {
    const cleanName = item.name.replace(/^[^\p{L}]+/u, '').trim();
    navigation.navigate('List', { category: cleanName });
  }
};


  if (isLoading) {
    return <HomeScreenSkeleton />;
  }

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps="handled">
      <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
        <View style={styles.container}>
          <View style={styles.fixedTop}>
            <Header
              isSubscribed={isSubscribed || false}
              customerInfo={customerInfo || null}
            />
            <View>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View>
                  <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={text => {
                      setSearchQuery(text);
                      setShowDropdown(!!text);
                    }}
                  />
                  {showDropdown && (
                    <View style={styles.dropdown}>
                      {dropdownMatches.slice(0, 8).map(item => (
                        <TouchableOpacity
                          key={item.code}
                          style={styles.dropdownItem}
                          onPress={() => handleDropdownSelect(item)}>
                          <SimpleIcon
                            style={styles.dropdownIcon}
                            source={imagePaths.search_icon}
                          />
                          <View style={{flex: 1}}>
                            <BodyText text={item.name} />
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={[{paddingBottom: isSubscribed ? 80 : 40}]}
            showsVerticalScrollIndicator={false}>
            {!isSubscribed && <SubscribeButton selected="Milk" />}
            {!isSubscribed && <ProductList products={filteredProducts || []} />}
            {/* Promotion image for guest users */}
            {!isSubscribed && promotionImage && promotionImage.length > 0 && (
              <View style={styles.promotionContainer}>
                <ScrollView
                  ref={promotionScrollRef}
                  horizontal
                  pagingEnabled={true}
                  showsHorizontalScrollIndicator={false}
                  style={styles.promotionScroll}
                  scrollEventThrottle={16}
                  onScroll={handlePromotionScroll}
                  onScrollBeginDrag={handlePromotionScrollBeginDrag}
                  onScrollEndDrag={handlePromotionScrollEndDrag}
                  decelerationRate="normal"
                  bounces={false}
                  overScrollMode="never">
                  {infinitePromotionData.map(
                    (img: {imageUrl: string}, index: number) => (
                      <TouchableOpacity
                      disabled={true}
                        key={`promotion-${index}-${img.imageUrl}`}
                        style={styles.promotionWrapper}>
                        <Image
                          source={{uri: img.imageUrl}}
                          style={styles.promotionImage}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    ),
                  )}
                </ScrollView>
              </View>
            )}
            {!isSubscribed ? null : (
              <ExistingCustomerDetails
                customerInfo={customerInfo}
                subscriptionInfo={subscriptionData}
              />
            )}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  fixedTop: {
    zIndex: 1,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: hp(0.25)},
    shadowOpacity: 0.2,
    shadowRadius: hp(0.25),
  },
  dropdown: {
    position: 'absolute',
    top: hp(6),
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    // borderWidth: 1,
    // borderColor: Colors.greyBackground,
    maxHeight: hp(25),
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 15,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3),
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyBackground,
  },
  dropdownIcon: {
    width: wp(5),
    height: wp(5),
    marginRight: wp(2),
    tintColor: Colors.lightGrey,
  },
  bannerScroll: {
    marginTop: hp(1.2),
    paddingLeft: wp(2.5),
  },
  bannerWrapper: {
    marginRight: wp(3),
    borderRadius: wp(2.5),
    overflow: 'hidden',
  },
  bannerImage: {
    width: wp(66),
    height: hp(15),
    resizeMode: 'cover',
    backgroundColor: Colors.black,
    borderRadius: wp(2.5),
    marginBottom: hp(1),
  },
  promotionContainer: {
    marginVertical: hp(2),
  },
  promotionScroll: {
    // Remove padding to allow full width
  },
  promotionWrapper: {
    width: wp(100), // Full screen width
    borderRadius: wp(3),
    overflow: 'hidden',
  },
  promotionImage: {
    width: wp(100), // Full screen width
    height: hp(18),
    resizeMode: 'cover',
    borderRadius: wp(3),
    marginBottom: hp(2),
  },
  text: {
    fontWeight: '800',
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
    marginRight: wp(1.5),
  },
});

export default HomeScreen;
