import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { imagePaths } from '../../utils/constants/imagePaths';
import SimpleIcon from '../../components/SimpleIcon';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

const GuestSubscriptionScreen: React.FC = () => {
  const navigate =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigate.goBack()}>
          <SimpleIcon source={imagePaths.back_icon}  style={{width: wp(6), height: wp(6), resizeMode: 'contain'}} /> 
        </TouchableOpacity>
        <Text style={styles.title}>My Subscription</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>315x189</Text>
          <Text style={styles.bannerSubText}>Promotional Banner</Text>
        </View>

        {/* Subscription Info */}
        <View style={styles.subscriptionContainer}>
          <SimpleIcon
            source={imagePaths.package_1}
            size={120}
            color="#43A047"
            style={{ marginBottom: 20 }}
          />

          <Text style={styles.notSubscribedText}>You’re not subscribed Yet!</Text>
          <Text style={styles.subText}>Start your subscription journey today.</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.exploreButton}
             onPress={() => navigate.navigate('List')} 
          >
            <Text style={styles.buttonText}>Explore Products</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.deliveryText}>Free Door Delivery, Always!</Text>
      </ScrollView>
    </View>
  );
};

export default GuestSubscriptionScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp(1.8),            
    paddingHorizontal: wp(4.3),     
    backgroundColor: Colors.white,
  },
  headerContainer: {
    height: hp(7.4),                
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: sp(18),
    fontWeight: 'bold',
  },
  backBtn: {
    width: wp(4.8),                 
    height: wp(4.8),
    tintColor: Colors.blackText,
  },
  banner: {
    height: hp(23),                 
    width: wp(84),                  
    alignSelf: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: wp(3.2),          
    marginVertical: hp(2.5),        
    justifyContent: 'center',
  },
  bannerText: {
    fontSize: sp(24),
    color: Colors.grey,
    alignSelf: 'center',
  },
  bannerSubText: {
    fontSize: sp(14),
    color: Colors.grey,
    alignSelf: 'center',
  },
  scrollContent: {
    paddingBottom: hp(5),           
  },
  subscriptionContainer: {
    alignItems: 'center',
    marginTop: hp(2.5),             
  },
  subscriptionIcon: {
    width: wp(32),                  
    height: wp(32),
    marginBottom: hp(2.5),          
    tintColor: Colors.primary,
  },
  notSubscribedText: {
    fontSize: sp(18),
    fontWeight: '600',
    marginBottom: hp(1),            
    color: Colors.blackText,
  },
  subText: {
    fontSize: sp(14),
    color: Colors.grey,
    marginBottom: hp(2.5),          
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(1.5),       
    paddingHorizontal: wp(8.5),     
    borderRadius: wp(2.1),          
    marginBottom: hp(2),            
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: sp(16),
    textAlign: 'center',
  },
  deliveryText: {
    position: 'relative',
    fontSize: sp(15),
    fontWeight: '500',
    color: Colors.blackText,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    padding: wp(0.5),               
    borderTopColor: Colors.lineLight,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: wp(2.1),          
    padding: wp(2.6),               
    alignItems: 'center',
  },
});
