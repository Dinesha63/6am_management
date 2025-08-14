import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import {FontFamily} from '../../utils/constant';
import {useNavigation} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/index';
import { imagePaths } from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

const AccountSummaryCards = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLearnMore = () => {
    navigation.navigate('LegalScreen');
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}>
      {/* <View style={[styles.card, {backgroundColor: '#E97784'}]}>
        <Text style={styles.cardTitle}>₹ 1500.00</Text>
        <Text style={styles.cardSubtitle}>Due for Jan 2025</Text>
        <Pressable
          android_ripple={{color: 'rgba(255, 255, 255, 0.3)'}}
          style={({pressed}) => [
            styles.cardButton,
            pressed && Platform.OS === 'ios' && styles.iosPressed,
          ]}>
            <TouchableOpacity  onPress={() => navigation.navigate('DueSettlement', { 'totalDueAmount': 1500.00 })}   >
          <Text style={styles.cardButtonText}>PAY NOW</Text>
          </TouchableOpacity>
        </Pressable>
      </View> */}

      <View style={styles.bannerCard}>
        <Image 
          source={imagePaths.promotion_icon} 
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.bannerOverlay}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>6 am Credits</Text>
            <Text style={styles.bannerSubtitle}>Add for more benefits</Text>
            <Pressable
              android_ripple={{color: 'rgba(255, 255, 255, 0.3)'}}
              style={({pressed}) => [
                styles.learnMoreButton,
                pressed && Platform.OS === 'ios' && styles.iosPressed,
              ]}
              onPress={handleLearnMore}>
              <Text style={styles.learnMoreText}>Learn More</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={[styles.card, {backgroundColor: '#8CE0B8'}]}>
        <Text style={styles.cardTitle}>6 am Credits</Text>
        <Text style={styles.cardSubtitle}>Add for more benefits</Text>
        <Pressable
          android_ripple={{color: 'rgba(255, 255, 255, 0.3)'}}
          style={({pressed}) => [
            styles.cardButton,
            pressed && Platform.OS === 'ios' && styles.iosPressed,
          ]}>
          <TouchableOpacity  onPress={() => navigation.navigate({ name: 'CreditScreen', params: { unitPrice: 0 } })}   >
          <Text style={styles.cardButtonText}>ADD</Text>
            </TouchableOpacity>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: wp(0.5),
  },
  card: {
    width: wp(95),
    height: hp(18),
    padding: wp(4),
    borderRadius: wp(3),
    marginHorizontal: wp(2),
  },
  cardTitle: {
    fontSize: sp(20),
    color: Colors.white,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: sp(15),
    color: Colors.white,
    marginBottom: hp(1.2),
  },
  cardButton: {
    backgroundColor: Colors.yellow,
    alignSelf: 'flex-end',
    paddingHorizontal: wp(6),
    paddingVertical: hp(1),
    borderRadius: wp(1.5),
  },
  iosPressed: {
    opacity: 0.7,
  },
  cardButtonText: {
    fontSize: sp(16),
    fontWeight: 'bold',
  },
  // Banner styles for unsubscribed users
  bannerCard: {
    width: wp(95),
    height: hp(18),
    borderRadius: wp(3),
    overflow: 'hidden',
    position: 'relative',
    marginHorizontal: wp(2),
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    paddingHorizontal: wp(4),
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: sp(18),
    color: Colors.blackText,
    fontWeight: 'bold',
    marginBottom: hp(0.5),
  },
  bannerSubtitle: {
    fontSize: sp(14),
    color: Colors.blackText,
    marginBottom: hp(1.5),
  },
  learnMoreButton: {
    backgroundColor: '#7CC467',
    alignSelf: 'flex-start',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: wp(2),
  },
  learnMoreText: {
    fontSize: sp(14),
    fontWeight: '600',
    color: Colors.blackText,
  },
});


export default AccountSummaryCards;
