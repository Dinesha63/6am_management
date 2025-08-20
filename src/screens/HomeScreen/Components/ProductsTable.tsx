// ProductsTable.tsx
import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";

interface ProductItem {
  storeName?: string;
  productName?: string;
  quantity: string | number;
  productSkuName?: string;
  sku?: string;
  location?: string;
  date?: string; // Expected format: YYYY-MM-DD
  deliveryDate?: string;
}

interface ProductsTableProps {
  data: ProductItem[];
  role: "superAdmin" | "admin";
  onStoreChange?: (store: string) => void;
  onExport?: () => void;
  selectedStore?: string;
  todayItems?: number;
  tomorrowItems?: number;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ 
  data, 
  role, 
  onStoreChange, 
  onExport, 
  selectedStore = "Vedapatti",
  todayItems = 824,
  tomorrowItems = 997
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow'>('today');

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Helper function to get tomorrow's date in YYYY-MM-DD format
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Filter products based on selected tab
  const getFilteredData = () => {
    if (!data || data.length === 0) return [];
    
    const todayDate = getTodayDate();
    const tomorrowDate = getTomorrowDate();
    
    return data.filter(item => {
       const itemDate = item.date || item.deliveryDate;
       if (!itemDate) return activeTab === 'today'; // Default to today if no date
       
       // Handle string dates
       const dateStr = itemDate.includes('T') ? itemDate.split('T')[0] : itemDate;
       
       if (activeTab === 'today') {
         return dateStr === todayDate;
       } else {
         return dateStr === tomorrowDate;
       }
     });
  };

  const filteredData = getFilteredData();

  // Calculate dynamic item counts
  const getTodayItemsCount = () => {
    if (!data || data.length === 0) return 0;
    const todayDate = getTodayDate();
    return data.filter(item => {
       const itemDate = item.date || item.deliveryDate;
       if (!itemDate) return true; // Default to today if no date
       const dateStr = itemDate.includes('T') ? itemDate.split('T')[0] : itemDate;
       return dateStr === todayDate;
     }).length;
  };

  const getTomorrowItemsCount = () => {
    if (!data || data.length === 0) return 0;
    const tomorrowDate = getTomorrowDate();
    return data.filter(item => {
       const itemDate = item.date || item.deliveryDate;
       if (!itemDate) return false;
       const dateStr = itemDate.includes('T') ? itemDate.split('T')[0] : itemDate;
       return dateStr === tomorrowDate;
     }).length;
  };

  const dynamicTodayItems = getTodayItemsCount();
  const dynamicTomorrowItems = getTomorrowItemsCount();

  if (!data || data.length === 0) {
    return <Text style={styles.emptyText}>No products available</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar - Only for SuperAdmin */}
      {role === "superAdmin" && (
        <View style={styles.topNavContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.productIcon}>📦</Text>
            <Text style={styles.titleText}>Product Requirement</Text>
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
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerIcon}>📦</Text>
          <Text style={styles.headerTitle}>Total Product Requirements</Text>
        </View>
      </View>
      
      {/* Tab Section */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'today' && styles.activeTab]}
          onPress={() => setActiveTab('today')}
        >
          <Text style={[styles.tabText, activeTab === 'today' && styles.activeTabText]}>
            Today ({dynamicTodayItems} items)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'tomorrow' && styles.activeTab]}
          onPress={() => setActiveTab('tomorrow')}
        >
          <Text style={[styles.tabText, activeTab === 'tomorrow' && styles.activeTabText]}>
            Tomorrow ({dynamicTomorrowItems} items)
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Products List */}
      <FlatList
        data={filteredData}
        keyExtractor={(_, i) => i.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>
                {item.productSkuName || item.productName}
              </Text>
              <Text style={styles.productSku}>
                SKU: {item.sku || 'MILK-250'}
              </Text>
              <Text style={styles.productLocation}>
                {item.location || item.storeName || selectedStore}
              </Text>
            </View>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityNumber}>{item.quantity}</Text>
              <Text style={styles.quantityLabel}>Quantity</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  // Top Navigation Bar Styles
  topNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  storeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  storeSelectorIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  storeSelectorText: {
    fontSize: 14,
    color: '#495057',
    marginRight: 6,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#6c757d',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  exportIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  exportText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  // Header Section Styles
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  // Tab Section Styles
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: '#74b1f2',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  // Product Card Styles
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  productSku: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 2,
  },
  productLocation: {
    fontSize: 12,
    color: '#6c757d',
  },
  quantityContainer: {
    alignItems: 'flex-end',
  },
  quantityNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
  },
  quantityLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6c757d',
    marginTop: 40,
  },
});

export default ProductsTable;
