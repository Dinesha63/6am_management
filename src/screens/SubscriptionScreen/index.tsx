import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { FontFamily} from '../../utils/constant';
import { imagePaths } from '../../utils/constants/imagePaths';
import SimpleIcon from '../../components/SimpleIcon';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import SetSubscriptionScreen from './SetSubscriptionScreen';
import SubscriptionSuccessScreen from './SubscriptionSuccessScreen';
import Header from './header';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
interface MenuItem {
  title: string;
  imagePath: any;
  badge1?: string;
  badge1Color?: string;
  badge2?: string;
  badge2Color?: string;
  screen: string;
}

const menuItems: MenuItem[] = [
  {
    title: 'Mark Vacation',
    imagePath: imagePaths.Mark_Vacation_icon,
    screen: 'MarkVacationScreen',
  },
  {
    title: 'Report Damage',
    imagePath: imagePaths.Report_Damage,
    screen: 'ReportDamageScreen',
  },
  {
    title: 'Recharge Wallet',
    imagePath: imagePaths.Make_Payment_icon,
    badge1: '-₹510',
    badge1Color: '#FE2121',
    badge2: '₹510',
    badge2Color: '#43A047',
    screen: 'CreditsScreenWallet',
  },
  {
    title: 'Manage Products',
    imagePath: imagePaths.Manage_Products_icon,
    screen: 'ManageProducts',
  },
  {
    title: 'Refer & Earn',
    imagePath: imagePaths.Replacement_icon,
    screen: 'ReferScreen',
  },
  {
    title: 'Cancel Subscription',
    imagePath: imagePaths.cancelSubscription,
    screen: 'CancelSubscription',
  },
];

const SubscriptionScreen: React.FC = () => {
  const navigate =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();


  return (
    <View style={styles.container}>

     <Header />
      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>315x189</Text>
          <Text style={styles.bannerSubText}>Promotional Banner</Text>
        </View>
        {/* Grid */}
        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.gridItem}
              onPress={() => navigate.navigate(item.screen as never)}>
              <SimpleIcon
                source={item.imagePath}
                size={50}
                color="#7CC467"
                style={styles.iconImage}
              />

              {item.badge1 && (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: item.badge1Color || '#E53935',
                      top: 30,
                      right: 30,
                    },
                  ]}>
                  <Text style={styles.badgeText}>{item.badge1}</Text>
                </View>
              )}
              {item.badge2 && (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: item.badge2Color || '#43A047',
                      top: 48,
                      right: 30,
                    },
                  ]}>
                  <Text style={styles.badgeText}>{item.badge2}</Text>
                </View>
              )}
              <Text style={styles.label} numberOfLines={2}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp(1.85),           
    paddingHorizontal: wp(4.3),     
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: hp(6.2),                
  },
  backText: {
    fontSize: sp(40),
    fontFamily: FontFamily.REGULAR,
    color: Colors.darkinfo,
  },
  headerContainer: {
    height: hp(7.4),                
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
  },
  backBtn: {
    width: wp(4.8),                 // ≈18px
    height: wp(4.8),
    tintColor: Colors.blackText,
  },
  banner: {
    height: hp(23),                 
    width: wp(84),                  
    alignSelf: 'center',
    backgroundColor: Colors.lineLight,
    borderRadius: wp(3.2),          
    marginVertical: hp(2.5),        
    justifyContent: 'center',
  },
  bannerText: {
    fontSize: sp(24),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
    alignSelf: 'center',
  },
  bannerSubText: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
    alignSelf: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  gridItem: {
    width: '50%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: Colors.white,
    position: 'relative',
  },
  iconImage: {
    width: wp(13.3),                
    height: wp(13.3),
    marginBottom: hp(1.2),          
  },
  label: {
    fontSize: sp(13),
    fontFamily: FontFamily.REGULAR,
    textAlign: 'center',
    marginTop: hp(0.5),             
    color: Colors.blackText,
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: hp(5),                     
    right: wp(8),                   
    borderRadius: wp(2.6),          
    paddingHorizontal: wp(1.3),     
  },
  badgeText: {
    color: Colors.white,
    fontSize: sp(8),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: hp(5),           
  },
});

