import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import Header from './Header';
import OrderTabs from './TransactionTabs';
import TransactionSection from './TransactionSectionList';
import TransactionsDataRaw from '../../utils/mock-data/TransactionPage.json';
import NoTransactionScreen from './NoTransactions';
import {TransactionTabType} from '../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import {fetchTransactions} from '../../redux/Features/transactionHistory/fetchTransactionsThunk';
import {useDispatch, useSelector} from 'react-redux';
import type {AppDispatch, RootState} from '../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TransactionItem {
 transactionDate: string;
  orderNo: string;
  orderType: string;
  amount: number;
  paymentMethod: string;
  transactionType: string;
  transactionDetails: [
    {
      productSkuCode: string;
      productSkuName: string;
      productSkuImageUrl: string;
      quantity: number;
    },
  ];
}

export interface Transaction extends TransactionItem {
  date: string;
  time: string;
}


const TransactionScreen: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState<TransactionTabType>('All');
  
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: TransactionData,
    loading,
    error,
  } = useSelector((state: RootState) => state.transactions);

  console.log(
    'Redux data:',
    TransactionData,
    'loading:',
    loading,
    'error:',
    error,
  );

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

const baseTransactions: Transaction[] = Array.isArray(TransactionData)
  ? TransactionData.map(tx => ({
      ...tx,
      transactionType: tx.transactionType,
      date: tx.transactionDate.split('T')[0],
      time: tx.transactionDate.split('T')[1].split('Z')[0],
      transactionDetails: (tx as any).transactionDetails || [{
        productSkuCode: '',
        productSkuName: '',
        productSkuImageUrl: '',
        quantity: 0,
      }],
    }))
  : [];

  const getTransactionsForTab = (): Transaction[] => {
  switch (selectedTab) {
    case 'All':
      return baseTransactions;

    case '6am Credit':
      return baseTransactions.filter(tx => tx.transactionType === 'Credit' || tx.transactionType === '6am Credit');

    case 'Credits Added':
      // Assuming "Credits Added" means positive transactions not marked as "Purchase"
      return baseTransactions.filter(
        tx => tx.orderType === 'Credit' || tx.amount > 0 && tx.transactionType === 'Credit',
      );

    case 'Purchases':
      return baseTransactions.filter(tx => tx.transactionType === 'Debit');

    default:
      return [];
  }
};


  const filteredTransactions = getTransactionsForTab();
  console.log('Filtered transactions:', filteredTransactions);
  //const EmptyState = filteredTransactions.length === 0;

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredTransactions.length === 0 ? (
          <NoTransactionScreen />
        ) : (
          <TransactionSection transactions={filteredTransactions} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    padding: wp(4),
    paddingBottom: hp(4),
  },
});
export default TransactionScreen;
