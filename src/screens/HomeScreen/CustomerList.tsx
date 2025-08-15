import React from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import CustomerListItem from './CustomerListItem';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

interface Customer {
  id: string;
  name: string;
  location: string;
  products: string[];
  amountDue: number;
}

interface CustomerListProps {
  customers: Customer[];
  onCustomerPress: (customer: Customer) => void;
  refreshing: boolean;
  onRefresh: () => void;
}

const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  onCustomerPress,
  refreshing,
  onRefresh,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}>
        {customers.map((customer) => (
          <CustomerListItem
            key={customer.id}
            customerName={customer.name}
            location={customer.location}
            products={customer.products}
            amountDue={customer.amountDue}
            onPress={() => onCustomerPress(customer)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.greyBackground,
  },
  scrollContent: {
    paddingVertical: hp(2),
  },
});

export default CustomerList;
