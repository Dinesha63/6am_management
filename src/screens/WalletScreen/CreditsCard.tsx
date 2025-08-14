import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types'; 
import { FontFamily } from '../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import { useDispatch } from 'react-redux';
import { logCustomEvent } from '../../utils/eventLogger';
import { AppDispatch } from '../../redux/store';
interface CreditsCardProps {
  amount: number;
  onTopUpPress: () => void;
}

const CreditsCard: React.FC<CreditsCardProps> = ({ amount, onTopUpPress }) => {
   const navigation =
      useNavigation<NativeStackNavigationProp<RootStackParamList>>();
   const dispatch = useDispatch<AppDispatch>();

   const handleTopUpPress = async () => {
     try {
       // Log user navigation to credit screen
       await logCustomEvent(dispatch, `User navigated to CreditScreen from WalletScreen to top up credits. Current balance: ₹${amount}`);
       
       // Navigate to credit screen
       navigation.navigate('CreditScreen', { unitPrice: 0, flowType: 'Main' });
     } catch (error) {
       console.log('Event logging failed:', error);
       // Don't block navigation if logging fails
       navigation.navigate('CreditScreen', { unitPrice: 0, flowType: 'Main' });
     }
   };

   return (
     <View>
       <TouchableOpacity 
         onPress={handleTopUpPress}
         >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>6 am Credits</Text>
            <View style={styles.topUpButton}>
            <View style={styles.topUpIcon}>
              <Text style={styles.plusIcon}>+</Text>
            </View>
            <Text style={styles.topUpText}>Top Up</Text>
            </View>
        </View>
        <Text style={styles.amount}>₹ {amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
      </View>
      </TouchableOpacity>
      <Text style={styles.description}>Can be used for your Orders & Subscriptions</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    borderRadius: wp(4),
    padding: wp(4),
    marginHorizontal: wp(4),
    marginVertical: hp(1),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  title: {
    color: Colors.white,
    fontSize: sp(16),
    fontWeight: '500',
    fontFamily: FontFamily.REGULAR,
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.7),
    borderRadius: wp(10),
  },
  topUpIcon: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(1.5),
  },
  plusIcon: {
    color: Colors.white,
    fontSize: sp(14),
    fontWeight: 'bold',
    fontFamily: FontFamily.REGULAR,
  },
  topUpText: {
    color: Colors.white,
    fontSize: sp(12),
    fontWeight: '500',
    fontFamily: FontFamily.REGULAR,
  },
  amount: {
    color: Colors.white,
    fontSize: sp(32),
    fontWeight: 'bold',
    marginBottom: hp(0.5),
    fontFamily: FontFamily.REGULAR,
  },
  description: {
    color: Colors.blackText,
    fontSize: sp(12),
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: FontFamily.REGULAR,
  },
});

export default CreditsCard;