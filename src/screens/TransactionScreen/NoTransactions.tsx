import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { imagePaths } from '../../utils/constants/imagePaths';
import Header from './Header';
import SimpleIcon from '../../components/SimpleIcon';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

type RootStackParamList = {
  List: { category?: string };
};

const NoTransactionScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.orderContainer}>
            <SimpleIcon
  source={imagePaths.wallet_Icon_1}
  size={120}
  color="#43A047"
  style={styles.walletIcon}
/>

            <Text style={styles.noOrdersText}>No transactions found!</Text>
            <Text style={styles.subText}>Your recent transactions will appear here..</Text>

            <TouchableOpacity style={styles.exploreButton}
             onPress={() => navigation.navigate('List', { category: 'All' })} 
             >
              <Text style={styles.buttonText}>Explore Products</Text>
            </TouchableOpacity>

            <Text style={styles.deliveryText}>Free Door Delivery, Always!</Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: wp(4),
  },
  walletIcon: {
  marginBottom: 20,
},
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(5),
  },
  orderContainer: {
    alignItems: 'center',
  },
  logisticsIcon: {
    width: wp(30),
    height: wp(30),
    marginBottom: hp(2.5),
    tintColor: Colors.primary,
  },
  noOrdersText: {
    fontSize: sp(18),
    fontWeight: '600',
    color: Colors.blackText,
    marginBottom: hp(1),
    textAlign: 'center',
  },
  subText: {
    fontSize: sp(14),
    color: Colors.grey,
    marginBottom: hp(3),
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(25),
    borderRadius: wp(2),
    marginBottom: hp(2),
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: sp(16),
    textAlign: 'center',
  },
  deliveryText: {
    fontSize: sp(15),
    fontWeight: '500',
    color: Colors.blackText,
    textAlign: 'center',
  },
});



export default NoTransactionScreen;