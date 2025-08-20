// DeliveriesTable.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";

interface DeliveryDetail {
  productSkuCode: string;
  productSkuName: string;
  quantity: number;
}

interface DeliveryItem {
  customerId: string;
    customerName: string;
    phoneNumber: string;
    storeCode: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    pincode: string | null;
    deliveryDetail: DeliveryDetail[]; 
    orderId: string;
    orderNo: string;
    orderStatus: string;
    orderDate: string;     
    deliveredDate: string | null;  
    cancelledDate: string | null;
}

interface DeliveriesTableProps {
  data: DeliveryItem[];
  role: "admin" | "superAdmin";
  onUpdateStatus?: (orderId: string, status: string) => void;
  onStoreChange?: (store: string) => void;
  onExport?: () => void;
  selectedStore?: string;
}

const DeliveriesTable: React.FC<DeliveriesTableProps> = ({ 
  data, 
  role, 
  onUpdateStatus, 
  onStoreChange, 
  onExport, 
  selectedStore = "All Stores" 
}) => {
  if (!data || data.length === 0) {
    return <Text style={styles.emptyText}>No deliveries found</Text>;
  }
  console.log(data, 'Deliveries Data');

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { text: 'completed', color: '#4CAF50' };
      case 'pending':
      case 'inprogress':
        return { text: 'pending', color: '#FF9800' };
      case 'skipped':
        return { text: 'skipped', color: '#F44336' };
      default:
        return { text: status, color: '#757575' };
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Calculate status counts
  const getStatusCounts = () => {
    const completed = data.filter(item => item.orderStatus.toLowerCase() === 'completed').length;
    const pending = data.filter(item => 
      item.orderStatus.toLowerCase() === 'pending' || 
      item.orderStatus.toLowerCase() === 'inprogress'
    ).length;
    const skipped = data.filter(item => item.orderStatus.toLowerCase() === 'skipped').length;
    
    return { completed, pending, skipped };
  };

  const statusCounts = getStatusCounts();

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar - Only for SuperAdmin */}
      {role === "superAdmin" && (
        <View style={styles.topNavContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.deliveryIcon}>📦</Text>
            <Text style={styles.titleText}>Delivery Tracking</Text>
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.storeSelector}
              onPress={() => onStoreChange?.(selectedStore)}
            >
              <Text style={styles.storeSelectorIcon}>📍</Text>
              <Text style={styles.storeSelectorText}>{selectedStore}</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.exportButton}
              onPress={() => onExport?.()}
            >
              <Text style={styles.exportIcon}>📤</Text>
              <Text style={styles.exportText}>Export</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>{selectedStore}</Text>
        </View>
        <View style={styles.statusSummary}>
          <View style={styles.statusItem}>
            <Text style={[styles.statusCount, { color: '#4CAF50' }]}>{statusCounts.completed}</Text>
            <Text style={[styles.statusLabel, { color: '#4CAF50' }]}>Completed</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={[styles.statusCount, { color: '#FF9800' }]}>{statusCounts.pending}</Text>
            <Text style={[styles.statusLabel, { color: '#FF9800' }]}>Pending</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={[styles.statusCount, { color: '#F44336' }]}>{statusCounts.skipped}</Text>
            <Text style={[styles.statusLabel, { color: '#F44336' }]}>Skipped</Text>
          </View>
        </View>
      </View>
      
      <FlatList
        data={data}
        keyExtractor={(item) => item.orderId}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const statusBadge = getStatusBadge(item.orderStatus);
          
          return (
            <View style={styles.deliveryCard}>
              <View style={styles.cardHeader}>
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>{item.customerName}</Text>
                  <Text style={styles.customerAddress}>
                    {item.addressLine1 && <Text>{item.addressLine1}</Text>}
                    {item.addressLine2 && <Text>{item.addressLine2}</Text>}
                  </Text>
                </View>
                <View style={styles.timeAndStatus}>
                  <Text style={styles.timeText}>
                    {formatTime(item.orderDate)}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusBadge.color }]}>
                    <Text style={styles.statusText}>{statusBadge.text}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.productsList}>
                {item.deliveryDetail.map((product, index) => (
                  <Text key={index} style={styles.productItem}>
                    {product.productSkuName} {product.quantity}
                  </Text>
                ))}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topNavContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  storeSelectorIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  storeSelectorText: {
    fontSize: 14,
    color: '#495057',
    marginRight: 6,
  },
  dropdownIcon: {
    fontSize: 10,
    color: '#6c757d',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  exportIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  exportText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusSummary: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusItem: {
    alignItems: 'center',
    marginLeft: 16,
  },
  statusCount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  deliveryCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    padding: 16,
    borderColor: '#d5d9e0',
    borderWidth: 1,

  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  customerAddress: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  timeAndStatus: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
    textTransform: 'lowercase',
  },
  productsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  productItem: {
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
});

export default DeliveriesTable;
