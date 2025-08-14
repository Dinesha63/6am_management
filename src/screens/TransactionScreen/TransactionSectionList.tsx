import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import TransactionItemRow from './TransactionsItemRow';
import Colors from '../../utils/constants/colors';
import {FontFamily, TransactionTabType} from '../../utils/constant';
import TransactionTabs from './TransactionTabs';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';

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

interface TransactionSectionProps {
  transactions: Transaction[];
  selectedTab: TransactionTabType;
  setSelectedTab: (tab: TransactionTabType) => void;
}

const TransactionSection: React.FC<TransactionSectionProps> = ({
  transactions,
  selectedTab,
  setSelectedTab,
}) => {
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);
  const [filter, setFilter] = useState<'This Month' | 'Last 7 Days'>(
    'This Month',
  );

  const toggleExpand = (index: number) => {
    const transaction = filteredTransactions[index];
    const hasTransactionDetails =
      transaction.transactionDetails &&
      transaction.transactionDetails.length > 0;

    // Only allow expansion if there are transaction details
    if (!hasTransactionDetails) {
      return;
    }

    setExpandedIndices(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index],
    );
  };

  // const filteredTransactions = useMemo(() => {
  //   const now = new Date();
  //   return transactions.filter((txn) => {
  //     const txnDate = new Date(txn.date);
  //     const matchesDate =
  //       filter === 'This Month'
  //         ? txnDate.getMonth() === now.getMonth() && txnDate.getFullYear() === now.getFullYear()
  //         : txnDate >= new Date(new Date().setDate(now.getDate() - 7)) && txnDate <= now;

  //     const matchesTab =
  //       selectedTab === 'All' ||
  //       (selectedTab === 'Credits Added' && txn.action === 'Refund') ||
  //       (selectedTab === 'Purchases' && txn.action !== 'Refund');

  //     return matchesDate && matchesTab;
  //   });
  // }, [filter, transactions, selectedTab]);

  const filteredTransactions = useMemo(() => transactions, [transactions]);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {/* Tabs and Filter combined */}
      <TransactionTabs
        activeTab={selectedTab}
        setActiveTab={setSelectedTab}
        filter={filter}
        setFilter={setFilter}
      />

      {/* Transactions */}
      {filteredTransactions.map((transaction, index) => {
        const isExpanded = expandedIndices.includes(index);
        const hasTransactionDetails =
          transaction.transactionDetails &&
          transaction.transactionDetails.length > 0;

        return (
          <TouchableOpacity
            key={transaction.orderNo}
            style={styles.card}
            onPress={() => hasTransactionDetails && toggleExpand(index)}
            activeOpacity={hasTransactionDetails ? 0.8 : 1}
            disabled={!hasTransactionDetails}>
            <View style={styles.rowHeader}>
              <View>
                <Text style={styles.orderText}>#{transaction.orderNo}</Text>
                <Text style={styles.subText}>{transaction.paymentMethod}</Text>
              </View>
              <View>
                <Text style={styles.dateText}>{transaction.date}</Text>
                <Text style={styles.subText}>{transaction.time}</Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text
                  style={[
                    styles.amount,
                    transaction.transactionType === 'Credit'
                      ? styles.amountPositive
                      : styles.amountNegative,
                  ]}>
                  {transaction.transactionType === 'Credit'
                    ? `+ ₹${transaction.amount.toFixed(2)}`
                    : `- ₹${transaction.amount.toFixed(2)}`}
                </Text>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>
                    {transaction.paymentMethod}
                  </Text>
                </View>
                {hasTransactionDetails && (
                  <Text
                    style={[
                      styles.expandIndicator,
                      isExpanded && styles.expandIndicatorRotated,
                    ]}>
                    ▼
                  </Text>
                )}
              </View>
            </View>

            {isExpanded && hasTransactionDetails && (
              <FlatList
                data={transaction.transactionDetails}
                keyExtractor={(item, idx) => item.productSkuName + idx}
                renderItem={({item}) => <TransactionItemRow item={item} />}
                scrollEnabled={false}
                contentContainerStyle={{paddingTop: 8}}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: hp(4),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: Colors.lightPurple,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderText: {
    fontSize: sp(14),
    fontWeight: '600',
    fontFamily: FontFamily.REGULAR,
    color: Colors.blackText,
  },
  subText: {
    fontSize: sp(12),
    color: Colors.grey,
    fontFamily: FontFamily.REGULAR,
  },
  dateText: {
    fontSize: sp(13),
    fontFamily: FontFamily.REGULAR,
    color: Colors.blackText,
    fontWeight: '500',
  },
  amount: {
    fontSize: sp(14),
    fontWeight: '700',
    fontFamily: FontFamily.REGULAR,
  },
  amountNegative: {
    color: Colors.danger,
  },
  amountPositive: {
    color: Colors.success,
  },
  tag: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.25),
    borderRadius: wp(1),
    marginTop: hp(0.5),
  },
  tagText: {
    fontSize: sp(11),
    color: '#fff',
    fontFamily: FontFamily.REGULAR,
  },
  expandIndicator: {
    fontSize: sp(12),
    color: Colors.grey,
    marginTop: hp(0.5),
    transform: [{rotate: '0deg'}],
  },
  expandIndicatorRotated: {
    transform: [{rotate: '180deg'}],
  },
});

export default TransactionSection;
