import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import Colors from '../../../utils/constants/colors';
import {COLORS, FontFamily} from '../../../utils/constant';
import {imagePaths} from '../../../utils/constants/imagePaths';
import ExistingCustomerPaymentCard from './ExistingCustomerPaymentCard';
import ExistingCustomerProductExplore from './ExistingCustomerProductExplore';
import SimpleIcon from '../../../components/SimpleIcon';
import {useNavigation} from '@react-navigation/native';
import {Linking, ToastAndroid} from 'react-native';
import {Routes} from '../../../navigation/routes';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../../utils/constants/responsiveScreen';
import type {CustomerInfo} from '../../../redux/Features/Customer/types/customer.types';
import type {CustomerSubscriptionData} from '../../../redux/Features/Customer/customerSubscription.types';
import {useDispatch, useSelector} from 'react-redux';
import {
  cancelNextDelivery,
  restoreNextDelivery,
} from '../../../redux/Features/Customer/customerSubscriptionThunk';
import {RootState} from '../../../redux/store';
import type {AppDispatch} from '../../../redux/store';
import FeedbackCard from './components/FeedbackCard';
import ExpiredFeedbackCard from './components/ExpiredFeedbackCard';
import DeliveryCard from './components/DeliveryCard';
import StarRating from '../StarRating';
import {homeBannerSelector, homeBannerLoadingSelector, homeSubscribedBannerSelector, homeSubscribedBannerLoadingSelector} from '../../../redux/Features/Promotion/promotionSlice';
import {fetchHomeBanner, fetchHomeSubscribedBanner} from '../../../redux/Features/Promotion/promotionThunk';

interface Props {
  customerInfo?: CustomerInfo | null;
  subscriptionInfo?: CustomerSubscriptionData | null;
}

const NextDeliveryInfo: React.FC<{
  delivery?: CustomerSubscriptionData['nextDeliveries'][0];
}> = ({delivery}) => {
  if (!delivery) return null;
  const formattedDate = delivery.orderDate
    ? new Date(delivery.orderDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';
  return (
    <>
      <Text style={styles.dateDelivery}>Next Delivery {formattedDate}</Text>
      <Text style={styles.timeDelivery}>
        {delivery.deliverySlotDescription || 'Time not available'}
      </Text>
      <Text style={styles.itemsDelivery}>
        {delivery.products?.map(p => p.productName).join(', ')}
      </Text>
    </>
  );
};

const ExistingCustomerDetails = ({customerInfo, subscriptionInfo}: Props) => {
  // console.log('ExistingCustomerDetails customerInfo', customerInfo);
  // console.log('ExistingCustomerDetails subscriptionInfo', subscriptionInfo);
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [items, setItems] = useState(['Milk 1 Litre', 'Curd 1/2 Litre']);
  const [isCancelled, setIsCancelled] = useState(false);

  const [isProductDelivered, setIsProductDelivered] = useState(false); // Set to true to simulate product delivered
  const [showDeliveryCard, setShowDeliveryCard] = useState(true); // Set to false to hide delivery card
  const [showFeedbackCard, setShowFeedbackCard] = useState(true); // Set to true to show feedback card
  const [feedbackTimeExpired, setFeedbackTimeExpired] = useState(false); // Set to true to simulate feedback expired

  const [isFeedbackExpanded, setIsFeedbackExpanded] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  const [partialCancel, setPartialCancel] = useState(false);

  const delivery = subscriptionInfo?.[0];
  // console.log("delivery list ::", delivery)

  const formattedDate = delivery?.orderDate
    ? new Date(delivery.orderDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '';

  const dispatch = useDispatch<AppDispatch>();
  
  // Banner selectors
  const homeBanner = useSelector(homeBannerSelector);
  const homeBannerLoading = useSelector(homeBannerLoadingSelector);
  const homeSubscribedBanner = useSelector(homeSubscribedBannerSelector);
  const homeSubscribedBannerLoading = useSelector(homeSubscribedBannerLoadingSelector);
  
  // Fetch banners on component mount
  useEffect(() => {
    dispatch(fetchHomeBanner());
    dispatch(fetchHomeSubscribedBanner());
  }, [dispatch]);
  
  const cancelState = useSelector(
    (state: RootState) => state.customerSubscription.cancelNextDelivery,
  );

  // Add this effect to select all items by default when delivery changes
  useEffect(() => {
    if (delivery && delivery.products) {
      setSelectedItems(delivery.products.map((p: any) => p.productName));
    }
  }, [delivery]);

  const handleEditPress = () => {
    setIsEditing(true);
    setIsExpanded(true);
    setSelectedItems(delivery?.products.map(p => p.productSkuCode) || []);
    console.log('selectedItems ::', selectedItems);
  };

  const handleCancelPress = () => {
    if (isEditing) {
      const updatedItems = items.filter(item => !selectedItems.includes(item));
      setItems(updatedItems);
      setSelectedItems(delivery?.products.map(p => p.productSkuCode) || []);
      setIsEditing(false);
      setIsExpanded(false);
      setIsCancelled(true);
      ToastAndroid.show(
        'The product has been removed from your delivery',
        ToastAndroid.LONG,
      );
    } else {
      setIsExpanded(false);
    }
  };

  const handleItemPress = (item: string) => {
    if (isEditing) {
      if (selectedItems.includes(item)) {
        setSelectedItems(selectedItems.filter(i => i !== item));
      } else {
        setSelectedItems([...selectedItems, item]);
      }
    }
  };

  const handleStarPress = (rating: number) => {
    setSelectedRating(rating);
    setHoverRating(0);
    if (!isFeedbackExpanded) {
      setIsFeedbackExpanded(true);
    }
  };

  const handleStarPressIn = (rating: number) => {
    setHoverRating(rating);
  };

  const handleStarPressOut = () => {
    setHoverRating(0);
  };

  const handleSubmitFeedback = () => {
    if (selectedRating === 0) {
      ToastAndroid.show(
        'Please select a rating before submitting',
        ToastAndroid.SHORT,
      );
      return;
    }
    ToastAndroid.show('Thank you for your feedback!', ToastAndroid.SHORT);
    setShowFeedbackCard(false);
  };

  const handleSkipFeedback = () => {
    setShowFeedbackCard(false);
  };

  const handleCloseFeedback = () => {
    setShowFeedbackCard(false);
  };

  const renderStars = (interactive = false) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => {
          const isSelected = interactive
            ? hoverRating > 0
              ? hoverRating >= star
              : selectedRating >= star
            : selectedRating >= star;

          return (
            <TouchableOpacity
              key={star}
              onPress={() => interactive && handleStarPress(star)}
              onPressIn={() => interactive && handleStarPressIn(star)}
              onPressOut={() => interactive && handleStarPressOut()}
              disabled={!interactive}
              style={styles.starTouchArea}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.star,
                  isSelected && styles.starSelected,
                  interactive && styles.starInteractive,
                ]}>
                ★
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const handleCancelDelivery = () => {
    if (!delivery?.orderId || !delivery.products) return;

    console.log('📦 Cancelling delivery with selectedItems:', selectedItems);
    console.log('🧾 Order ID:', delivery.orderId);

    dispatch(
      cancelNextDelivery({
        orderId: delivery.orderId,
        products: selectedItems,
      }),
    )
      .unwrap()
      .then((result: any) => {
        console.log('✅ cancelNextDelivery result:', result);

        // Update UI like previous handleCancelPress
        const updatedItems = items.filter(
          item => !selectedItems.includes(item),
        );
        setItems(updatedItems);

        // If not all products are cancelled, set partialCancel true
        if (selectedItems.length < (delivery.products?.length || 0)) {
          setPartialCancel(true);
        } else {
          setPartialCancel(false);
        }

        setSelectedItems(delivery.products.map(p => p.productSkuCode) || []);
        setIsEditing(false);
        setIsExpanded(false);
        setIsCancelled(true);

        ToastAndroid.show(
          'The product has been removed from your delivery',
          ToastAndroid.LONG,
        );
      })
      .catch((error: any) => {
        console.error('❌ cancelNextDelivery error:', error);
        ToastAndroid.show(
          'Failed to cancel the selected items. Please try again.',
          ToastAndroid.LONG,
        );
      });
  };

  const handleRestoreDelivery = () => {
    console.log('handleRestoreDelivery :', delivery?.orderId);
    if (!delivery?.orderId) return;
    dispatch(restoreNextDelivery({orderId: delivery.orderId}))
      .unwrap()
      .then((result: any) => {
        setIsCancelled(false);
        // Optionally show a toast or handle success
      })
      .catch((error: any) => {
        // Optionally show a toast or handle error
      });
  };

  return (
    <View style={styles.container}>
      {showFeedbackCard && isProductDelivered && !feedbackTimeExpired && (
        <FeedbackCard
          isFeedbackExpanded={isFeedbackExpanded}
          setIsFeedbackExpanded={setIsFeedbackExpanded}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          hoverRating={hoverRating}
          setHoverRating={setHoverRating}
          feedbackText={feedbackText}
          setFeedbackText={setFeedbackText}
          handleSubmitFeedback={handleSubmitFeedback}
          handleSkipFeedback={handleSkipFeedback}
          handleCloseFeedback={handleCloseFeedback}
          renderStars={() => <StarRating rating={selectedRating} />}
          styles={styles}
        />
      )}
           {showDeliveryCard  && (subscriptionInfo?.[0]?.products?.length || 0) > 0 &&  (
        <DeliveryCard
          isCancelled={isCancelled}
          isExpanded={isExpanded}
          isEditing={isEditing}
          delivery={delivery}
          formattedDate={formattedDate}
          selectedItems={selectedItems}
          handleEditPress={handleEditPress}
          handleCancelPress={handleCancelDelivery}
          handleItemPress={handleItemPress}
          handleCancelDelivery={handleCancelDelivery}
          navigation={navigation}
          setIsCancelled={setIsCancelled}
          handleRestoreDelivery={handleRestoreDelivery}
          styles={styles}
          imagePaths={imagePaths}
          Routes={Routes}
          setIsEditing={setIsEditing}
          setIsExpanded={setIsExpanded}
          partialCancel={partialCancel}
        />
      )}
      {feedbackTimeExpired && <ExpiredFeedbackCard styles={styles} />}

      {/* {customerInfo && customerInfo.userType === 'Pre-Paid' && (  chnage the condtion to check if the customer is subscribed */}
      {customerInfo && customerInfo?.isSubscribed && customerInfo?.lowWalletBalanceAlert &&  (
        <ExistingCustomerPaymentCard customerInfo={customerInfo} prepaidBalance={customerInfo?.walletAmount} />
      )}
      
      {/* Conditional Banner Display */}
      {subscriptionInfo && !subscriptionInfo?.isSubscribed &&!customerInfo?.lowWalletBalanceAlert?(
        /* Show subscribed banner for subscribed users */
        homeSubscribedBanner && Array.isArray(homeSubscribedBanner) && homeSubscribedBanner.length > 0 && !homeSubscribedBannerLoading && (
          <View style={styles.bannerContainer}>
            <TouchableOpacity 
              style={styles.bannerImage}
              onPress={() => {
                // Handle banner click - you can add navigation or other actions here
                console.log('Subscribed Banner clicked:', homeSubscribedBanner[0]);
              }}
            >
              <Image 
                source={{ uri: homeSubscribedBanner[0].imageUrl }}
                style={styles.bannerImageStyle}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        )
      ) : (
        /* Show regular home banner for non-subscribed users */
        homeBanner && Array.isArray(homeBanner) && homeBanner.length > 0 && !homeBannerLoading&& customerInfo?.lowWalletBalanceAlert && (
          <View style={styles.bannerContainer}>
            <TouchableOpacity 
            disabled={true}
              style={styles.bannerImage}
              onPress={() => {
                // Handle banner click - you can add navigation or other actions here
                console.log('Home Banner clicked:', homeBanner[0]);
              }}
            >
              <Image 
                source={{ uri: homeBanner[0].imageUrl }}
                style={styles.bannerImageStyle}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        )
      )}
      
      <ExistingCustomerProductExplore />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: hp(1),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expiredCard: {
    width: wp(90),
    backgroundColor: Colors.white,
    borderRadius: wp(2.5),
    padding: wp(4),
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: hp(2.4),
    alignItems: 'center',
  },
  expiredText: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    width: wp(90),
    backgroundColor: Colors.white,
    borderRadius: wp(2.5),
    padding: wp(4),
    borderColor: '#B5B5B5',
    borderWidth: 1,
    marginBottom: hp(1.5),
  },
  feedbackCard: {
    width: wp(90),
    backgroundColor: Colors.white,
    borderRadius: wp(2.5),
    padding: wp(4),
    borderColor: Colors.purpleBorder,
    borderWidth: 1,
    marginBottom: hp(2.4),
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: hp(1.2),
    right: wp(4),
    zIndex: 1,
    padding: wp(1.2),
  },
  closeButtonText: {
    fontSize: sp(24),
    color: Colors.grey,
    fontWeight: 'bold',
  },
  feedbackInitial: {
    alignItems: 'center',
  },
  feedbackTitle: {
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    color: Colors.blackText,
    marginBottom: hp(0.5),
  },
  feedbackSubtitle: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
    marginBottom: hp(1),
  },
  ratingPrompt: {
    fontSize: sp(15),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
    marginBottom: hp(1),
    fontWeight: '500',
  },
  feedbackFooter: {
    fontSize: sp(13),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
    textAlign: 'center',
    marginTop: hp(1.5),
  },
  feedbackExpanded: {
    paddingTop: hp(1),
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  feedbackHeaderLeft: {
    flex: 1,
  },
  feedbackExpandedTitle: {
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    color: Colors.blackText,
    marginBottom: hp(0.5),
  },
  feedbackExpandedSubtitle: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
  },
  selectedRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: hp(1),
  },
  starTouchArea: {
    padding: wp(1),
  },
  star: {
    fontSize: sp(32),
    color: Colors.grey,
    marginHorizontal: wp(0.5),
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  starSelected: {
    color: Colors.warning,
  },
  starInteractive: {
    transform: [{scale: 1}],
  },
  feedbackInputSection: {
    marginVertical: hp(1),
  },
  feedbackInputLabel: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
    marginBottom: hp(1),
    fontWeight: '500',
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: wp(2),
    padding: wp(3),
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
    minHeight: hp(12),
  },
  feedbackActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(1),
  },
  contactButtonFeedback: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(2),
  },
  contactIconFeedback: {
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
    tintColor: Colors.primary,
    marginRight: wp(1.5),
  },
  contactTextFeedback: {
    fontSize: sp(15),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    color: Colors.primary,
  },
  feedbackButtonsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: Colors.grey,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    borderRadius: wp(1.5),
    marginRight: wp(2.5),
  },
  skipButtonText: {
    color: Colors.white,
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    borderRadius: wp(1.5),
  },
  submitButtonDisabled: {
    backgroundColor: Colors.lineLight,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  radioButton: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    backgroundColor: Colors.purpleBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(2.5),
    marginTop: hp(0.5),
  },
  checkmark: {
    color: Colors.white,
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
    marginRight: wp(2),
    backgroundColor: Colors.white,
  },
  dateDelivery: {
    fontSize: sp(15),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    color: Colors.grey,
    marginBottom: hp(0.5),
  },
  timeDelivery: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.itemText,
    marginBottom: hp(0.5),
  },
  itemsDelivery: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.itemText,
  },
  icon: {
    tintColor: Colors.grey,
    width: wp(7),
    height: wp(7),
    marginRight: wp(2.5),
  },
  expandedSection: {
    paddingTop: hp(1),
  },
  basketHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.5),
  },
  basketTitle: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    marginBottom: hp(0.5),
    color: Colors.blackText,
  },
  basketDate: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
    marginBottom: hp(1.5),
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1.2),
  },
  basketItem: {
    fontSize: sp(15),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    color: Colors.grey,
  },
  infoRow: {
    marginTop: hp(1.2),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  infoicon: {
    width: wp(5),
    height: wp(5),
    marginRight: wp(1.5),
  },
  infoMsg: {
    fontSize: sp(13),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
    paddingRight: wp(2.5),
  },
  link: {
    fontSize: sp(15),
    fontFamily: FontFamily.REGULAR,
    color: Colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.lineLight,
    paddingTop: hp(1.5),
    marginTop: hp(1.5),
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactIcon: {
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
    tintColor: Colors.borderColour,
    marginRight: wp(1),
  },
  contactTxt: {
    fontSize: sp(15),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    color: Colors.borderColour,
    marginRight: wp(5),
  },
  cancelButton: {
    backgroundColor: Colors.itemText,
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
    borderRadius: wp(1.5),
    position: 'static',
  },
  cancelTxt: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: sp(15),
    fontFamily: FontFamily.REGULAR,
  },
  addProductsButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
    borderRadius: wp(1.5),
    marginLeft: wp(7),
  },
  addProductsTxt: {
    fontSize: sp(15),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    color: Colors.white,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cancelledCard: {
    borderColor: Colors.purpleBorder,
    borderRadius: wp(2.5),
  },
  cancelledTitle: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    color: Colors.blackText,
    marginBottom: hp(0.8),
  },
  cancelledSubtitle: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
    marginBottom: hp(1.5),
  },
  cancelledButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  restoreDeliveryButton: {
    backgroundColor: Colors.warning,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: wp(1.5),
    marginLeft: wp(2.5),
  },
  restoreDeliveryTxt: {
    fontSize: sp(15),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    color: Colors.white,
  },
  outerCircle: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(2.5),
  },
  innerCircle: {
    width: wp(2.5),
    height: wp(2.5),
    borderRadius: wp(1.25),
    backgroundColor: Colors.primary,
  },
  bannerContainer: {
    width: wp(90),
    marginBottom: hp(1.5),
    borderRadius: wp(2.5),
    overflow: 'hidden',
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

export default ExistingCustomerDetails;
