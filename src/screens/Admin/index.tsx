import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, ScrollView, Text } from 'react-native';
import Header from './Header';
import AdminTabBar from './Components/AdminTabBar';
import Colors from '../../utils/constants/colors';

// Dummy tab content components
const ProductsTab = () => <View style={styles.tabContent}><Text>Products Content</Text></View>;
const CustomersTab = () => <View style={styles.tabContent}><Text>Customers Content</Text></View>;
const WalletTab = () => <View style={styles.tabContent}><Text>Wallet Content</Text></View>;
const PostpaidTab = () => <View style={styles.tabContent}><Text>Postpaid Content</Text></View>;
const DeliveriesTab = () => <View style={styles.tabContent}><Text>Deliveries Content</Text></View>;

const AdminScreen: React.FC = () => {
  const tabs = [
    { label: 'Products', key: 'products' },
    { label: 'Customers', key: 'customers' },
    { label: 'Wallet', key: 'wallet' },
    { label: 'Postpaid', key: 'postpaid' },
    { label: 'Deliveries', key: 'deliveries' },
  ];

  const [activeTab, setActiveTab] = useState('products');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'products':
        return <ProductsTab />;
      case 'customers':
        return <CustomersTab />;
      case 'wallet':
        return <WalletTab />;
      case 'postpaid':
        return <PostpaidTab />;
      case 'deliveries':
        return <DeliveriesTab />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header goToPaymentOnBack={false} goToAccountOnBack={false} />
      <AdminTabBar tabs={tabs} activeTab={activeTab} onTabPress={setActiveTab} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderActiveTab()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollContent: {
    padding: 16,
  },
  tabContent: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 12,
  },
});

export default AdminScreen;
