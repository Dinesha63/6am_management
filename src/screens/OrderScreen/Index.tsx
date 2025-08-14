import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Header from './Header';
import OrderTabs from './OrderTabs';
import OrderSection from './OrderSectionList';
import ordersDataRaw from '../../utils/mock-data/Order_Page_Mo.json';
import { OrderTabType } from '../../utils/constants/OrderTabType';
import NewOrderScreen from './NewOrderScreen';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
export interface OrderItem {
  productName: string;
  storeName: string;
  quantity: string;
  price: number;
}

export interface Order {
  orderId: string;
  date: string;
  status: OrderTabType;
  items: OrderItem[];
}

export interface OrdersByStatus {
  processing: Order[];
  shipped: Order[];
  completed: Order[];
  canceled: Order[];
}

const OrderScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrderTabType>(OrderTabType.COMPLETED);
  const orders: OrdersByStatus = ordersDataRaw.orders;

  const getOrdersForTab = () => {
    switch (activeTab) {
      case 'Processing': return orders.processing;
      case 'Shipped': return orders.shipped;
      case 'Completed': return orders.completed;
      case 'Canceled': return orders.canceled;
      default: return [];
    }
  };
  const currentOrders = getOrdersForTab();
  const EmptyState = false; //TRUE OR FALSE
  return (
    <View style={styles.container}>
      <Header />

      {!EmptyState && (
        <OrderTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* {(!currentOrders || currentOrders.length === 0) ? (
          <EmptyOrderState />
        ) : (
          <OrderSection orders={currentOrders} />
        )} */}

        {EmptyState ? ( 
          <NewOrderScreen />
        ) : (
          <OrderSection orders={currentOrders} />
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


export default OrderScreen;