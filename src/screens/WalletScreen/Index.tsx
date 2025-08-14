import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Header from './Header';
import CreditsCard from './CreditsCard';
import TransactionItem from './TransactionItem';
import InviteSection from './InviteSection';
import creditTransactionData from '../../utils/mock-data/WalletTransaction.json';
import Colors from '../../utils/constants/colors';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import { FontFamily } from '../../utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTransactions } from '../../redux/Features/transactionHistory/fetchTransactionsThunk';

interface CreditTransaction {
  title: string;
  description: string;
  date: string;
  time: string;
  amount: string;
  tag: string;
}

const CreditsScreenWallet: React.FC = () => {
  // const transactions: CreditTransaction[] = creditTransactionData.CreditTransaction.All.slice(0, 3);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const customerInfo = useSelector((state: RootState) => state.customer.data);

  const handleBackPress = () => {
    console.log('Back pressed');
  };
  const handleTopUpPress = () => {
    console.log('Top up pressed');
  };
  const handleInvitePress = () => {
    console.log('Invite pressed');
  };
  const handleLearnMorePress = () => {
    navigation.navigate('LegalScreen', undefined);
  };

  const parseAmount = (amountString: string): number => {
    const numericValue = parseFloat(amountString.replace(/[^\d.]/g, ''));
    return amountString.includes('-') ? -numericValue : numericValue;
  };

  const isPositiveTransaction = (amountString: string): boolean => {
    return amountString.includes('+');
  };

  const getBadgeColor = (tag: string): string => {
    if (tag === 'Refund') {
      return '#FF9800'; // Orange for refunds
    }
    return '#4CAF50'; // Green for 6am Credit
  };
  const dispatch = useDispatch<AppDispatch>();

  const {
    data: TransactionData,
    loading,
    error,
  } = useSelector((state: RootState) => state.transactions);

  console.log('Reduxsdfdata:', TransactionData);
  const transactions = (TransactionData || []).slice(0, 5).map(item => {
    const dateObj = new Date(item.transactionDate);

    const date = dateObj.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }); 

    const time = dateObj.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }); 

    return {
      title: item.orderNo,
      description: item.orderType,
      date,
      time,
      amount: item.amount,
      tag: item.paymentMethod,
      orderType: item.transactionType,
    };
  });

  const fetchNumber = async () => {
    const number = await AsyncStorage.getItem('userPhoneNumber');
    if (number) {
      dispatch(fetchTransactions(number));
    } else {
      console.error('No phone number found in AsyncStorage');
    }
  };
  useEffect(() => {
    fetchNumber();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <CreditsCard
          amount={Number(customerInfo?.walletAmount)}
          onTopUpPress={handleTopUpPress}
        />
        {transactions.length > 0 ? (
          <View style={styles.transactionsSection}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {transactions.map((transaction, index) => (
              <TransactionItem
                key={index}
                title={transaction.title}
                subtitle={transaction.description}
                date={transaction.date}
                time={transaction.time}
                amount={parseAmount(transaction.amount.toString())}
                isPositive={transaction.orderType === 'Credit' ? true : false}
                badgeText={transaction.tag}
                badgeColor={getBadgeColor(transaction.tag)}
              />
            ))}
          </View>
        ) : (
          <View
            style={{
              marginVertical: hp(2),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#F8FAFC',
              borderRadius: 12,
              paddingVertical: hp(4),
              paddingHorizontal: wp(5),
              borderColor: '#E2E8F0',
              shadowColor: '#000',
              // shadowOffset: { width: 0, height: 2 },
              // shadowOpacity: 0.05,
              // shadowRadius: 4,
              // elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: sp(24),
                marginBottom: hp(1),
              }}
            >
              💳
            </Text>
            <Text
              style={{
                fontSize: sp(13),
                color: '#64748B',
                fontWeight: '500',
                textAlign: 'center',
              }}
            >
              No Recent Transactions
            </Text>
          </View>
        )}

        <View style={styles.factSection}>
          <Text style={styles.factText}>
            Did you know that milk is about 87% water and 13% solids?
          </Text>
        </View>
        {/* <InviteSection onInvitePress={handleInvitePress} /> */}
      </ScrollView>
      
      <TouchableOpacity
        style={styles.learnMoreButton}
        onPress={handleLearnMorePress}>
        <Text style={styles.learnMoreText}>Learn More About 6 am Credits</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  transactionsSection: {
    marginVertical: hp(2),
  },
  transactionsEmptyState: {
    marginVertical: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.grey,
  },
  sectionTitle: {
    fontSize: sp(12),
    fontWeight: '600',
    color: Colors.blackText,
    marginHorizontal: wp(4),
    marginBottom: hp(1.5),
  },
  sectionSubtitle: {
    fontSize: sp(12),
    fontWeight: '600',
    color: Colors.blackText,
    marginHorizontal: wp(4),
    marginBottom: hp(1.5),
  },
  factSection: {
    marginHorizontal: wp(3),
    // marginTop: -hp(2),
    marginBottom: hp(0.5),
  },
  factText: {
    fontSize: sp(12),
    color: Colors.grey,
    textAlign: 'center',
    fontFamily: FontFamily.REGULAR,
  },
  learnMoreButton: {
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    paddingVertical: hp(1.5),
    marginHorizontal: wp(4),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: Colors.darkPurple,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  learnMoreText: {
    fontSize: sp(16),
    fontWeight: '500',
    color: Colors.blackText,
    textAlign: 'center',
    fontFamily: FontFamily.REGULAR,
  },
});

export default CreditsScreenWallet;
