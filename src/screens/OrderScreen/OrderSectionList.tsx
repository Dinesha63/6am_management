import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import OrderItemRow from './OrderItemRow';
import { Order } from './Index';
import Colors from '../../utils/constants/colors';
import { FontFamily } from '../../utils/constant';  
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';


interface OrderSectionProps {
  orders: Order[] ;
}

const OrderSection: React.FC<OrderSectionProps> = ({ orders }) => {
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId) // collapse
        : [...prev, orderId]                 // expand
    );
  };

  const getStatusChipStyle = (status: string) => {
    switch (status) {
      case 'Processing':
        return styles.processingChip;
      case 'Shipped':
        return styles.shippedChip;
      case 'Completed':
        return styles.completedChip;
      case 'Canceled':
        return styles.canceledChip;
      default:
        return styles.defaultChip;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {orders.map((order) => {
        const total = order.items.reduce((sum, item) => sum + item.price, 0);
        const isExpanded = expandedOrderIds.includes(order.orderId);

        return (
          <TouchableOpacity
            key={order.orderId}
            style={styles.orderCard}
            onPress={() => toggleExpand(order.orderId)}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Order #{order.orderId}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
            </View>

            {isExpanded && (
              <FlatList
                data={order.items}
                keyExtractor={(item, index) => item.productName + index}
                renderItem={({ item }) => <OrderItemRow item={item} />}
                scrollEnabled={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}

            <View style={styles.footer}>
              <Text style={[styles.statusChip, getStatusChipStyle(order.status)]}>
                {order.status}
              </Text>
              <Text style={styles.total}>Total: ₹{total.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: hp(2.5),
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2.5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginTop: hp(0.6),
    borderWidth: 1,
    borderColor: Colors.purpleBorder,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.2),
  },
  orderId: {
    fontWeight: '600',
    fontSize: sp(15),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
  },
  orderDate: {
    fontSize: sp(13),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusChip: {
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.5),
    borderRadius: wp(1.5),
    color: Colors.white,
    fontWeight: '600',
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
  },
  processingChip: {
    backgroundColor: Colors.warning,
    color: Colors.black,
  },
  shippedChip: {
    backgroundColor: Colors.darkinfo,
  },
  completedChip: {
    backgroundColor: Colors.success,
  },
  canceledChip: {
    backgroundColor: Colors.danger,
  },
  defaultChip: {
    backgroundColor: Colors.primary,
  },
  total: {
    fontWeight: 'bold',
    fontSize: sp(15),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
  },
});
export default OrderSection;