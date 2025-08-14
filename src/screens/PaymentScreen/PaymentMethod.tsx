import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontFamily } from '../../utils/constant';
import Colors from '../../utils/constants/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import WalletToggle from './WalletToggle';
import AddMoneyCard from './AddMoneyCard';
 
interface PaymentMethodProps {
  amount: number;
  walletAmount: number;
  walletSelected: boolean;
  onPress: () => void;
  walletEnabled: boolean;
  setWalletEnabled: (enabled: boolean) => void;
}
 
const PaymentMethod: React.FC<PaymentMethodProps> = ({
  amount,
  walletAmount,
  walletSelected,
  onPress,
  walletEnabled,
  setWalletEnabled,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<
    'CARD' | 'UPI' | 'NETBANKING' | null
  >('UPI');
  const [addMoneySelected, setAddMoneySelected] = useState(false);
  const isToggleAllowed = walletAmount >= amount;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Handle add money selection
  const handleAddMoneyToggle = (enabled: boolean) => {
    setAddMoneySelected(enabled);
    if (enabled) {
      // If add money is selected, disable wallet usage
      setWalletEnabled(false);
    } else {
      // If add money is deselected, automatically enable wallet (if allowed)
      if (isToggleAllowed) {
        setWalletEnabled(true);
      }
    }
  };

  // Handle wallet toggle
  const handleWalletToggle = (enabled: boolean) => {
    setWalletEnabled(enabled);
    if (enabled) {
      // If wallet is selected, disable add money
      setAddMoneySelected(false);
    } else {
      // If wallet is deselected, automatically enable add money
      setAddMoneySelected(true);
    }
  };

  useEffect(() => {
    if (isToggleAllowed && !addMoneySelected) {
      setWalletEnabled(true);
    } else if (!isToggleAllowed) {
      setWalletEnabled(false);
    }
  }, [isToggleAllowed, addMoneySelected]);
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.creditsCard} onPress={() => navigation.navigate('CreditsScreenWallet')}>
        <Text style={styles.creditsTitle}>6 am Credits</Text>
        {walletSelected ? (
          <Text style={styles.creditsSubtitleIn}>₹ {walletAmount.toFixed(2)}</Text>
        ) : (
          <Text style={styles.creditsSubtitle}>Add 6 am Credits</Text>
        )}
        <Text style={styles.creditsDescription}>
          Can be used for your Orders & Subscriptions
        </Text>
      </TouchableOpacity>
 
      <View style={styles.methodsContainer}>
    
        {
        walletSelected && (
          <WalletToggle
            amount={walletAmount}
            isEnabled={walletEnabled}
            onToggle={handleWalletToggle}
            disabled={!isToggleAllowed}
            isToggleAllowed={isToggleAllowed && !addMoneySelected}
          />
        )
      }
      
      {
        !isToggleAllowed && walletSelected && (
          <View
            style={{
              backgroundColor: '#FFF5F5',
              marginTop: hp(1),
              paddingHorizontal: wp(2),
              padding: wp(1),
              borderRadius: wp(3),
              borderLeftColor: '#FF4D4D',
            }}
          >
            <Text style={{ color: '#FF4D4D', fontSize: sp(14) }}>
              ⚠️ Insufficient wallet balance to pay full amount of ₹{amount}
            </Text>
          </View>
        )
      }
        <AddMoneyCard  
          isToggleAllowed={isToggleAllowed}  
          disabled={!isToggleAllowed} 
          walletAmount={walletAmount} 
          amount={amount}
          isSelected={addMoneySelected}
          onToggle={handleAddMoneyToggle}
        />
      </View>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    padding: wp(4),
    
  },
  creditsCard: {
    backgroundColor: Colors.primary,
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
  },
  creditsTitle: {
    color: Colors.white,
    fontSize: sp(14),
    opacity: 0.8,
  },
  creditsSubtitle: {
    color: Colors.white,
    fontSize: sp(20),
    fontWeight: '600',
    marginVertical: hp(0.5),
  },
  creditsSubtitleIn: {
    marginTop: hp(1.2),
    marginBottom: hp(3),
    color: Colors.white,
    fontSize: sp(35),
    fontWeight: '600',
    marginVertical: hp(0.5),
  },
  creditsDescription: {
    color: Colors.white,
    fontSize: sp(12),
    opacity: 0.8,
  },
  methodsContainer: {
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    // padding: wp(4),
  },
  methodsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  methodsHeaderIn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  paymentLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1.5),
    paddingHorizontal: wp(1),
  },
  paymentLabel: {
    fontSize: sp(14),
    color: '#000',
  },
  addText: {
    color: '#0AA99C',
    fontWeight: '500',
  },
  addTextIn: {
    color: '#F52D6A',
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyBackground,
    backgroundColor: Colors.white,
    borderColor: '#E0E0F0',
    borderWidth: 1,
    marginBottom: hp(2),
    borderRadius: wp(3),
    padding: wp(3),
  },
  radioContainer: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: wp(2.5),
    height: wp(2.5),
    borderRadius: wp(1.25),
    backgroundColor: Colors.primary,
  },
  methodText: {
    flex: 1,
    marginLeft: wp(3),
    fontSize: sp(14),
  },
  rightArrow: {
    fontSize: sp(20),
    color: Colors.black,
  },
});
 
export default PaymentMethod;