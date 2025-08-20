import React, {useState, useEffect, use} from 'react';
import {View, StyleSheet, Alert, ScrollView, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import DashboardHeader from './DashboardHeader';
import SummaryCards from './SummaryCards';
import DashboardTabs from './DashboardTabs';
import FilterBar from './FilterBar';
import CustomerList from './CustomerList';
import SearchBar from './SearchBar';
import DeliveriesCard from './DeliveriesCard';
import DashboardDataService, {Customer} from './DashboardDataService';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import {FontFamily} from '../../utils/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from '../../redux/hooks';
import ProductsTable from './Components/ProductsTable';
import DeliveriesTable from './Components/DeliveriesTable';
import {
  fetchTodayDeliveryList,
  fetchTodayDeliverySummaryByProduct,
  fetchTodayDeliverySummaryByProductSKU,
} from '../../redux/Features/Delivery/deliveryThunk';
import {selectDelivery} from '../../redux/Features/Delivery/deliverySlice';
import {fetchStoreList} from '../../redux/Features/6amStore/storeThunk';
import {selectStoreState} from '../../redux/Features/6amStore/storeSlice';
import { StoreItem } from '../../redux/Features/6amStore/store.types';

interface UnifiedDashboardProps {
  userRole: 'admin' | 'superAdmin';
}

const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({userRole}) => {
  console.log('userRole:', userRole);
  const [selectedLocation, setSelectedLocation] = useState<string>('Vedapatti');
  const [activeTab, setActiveTab] = useState(
    userRole === 'admin' ? 'products' : 'products',
  );
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardData, setDashboardData] = useState(
    DashboardDataService.getInstance().getDashboardData(),
  );
  const dispatch = useAppDispatch();
  const dataService = DashboardDataService.getInstance();
  const {
    deliverySummaryByProduct,
    deliverySummaryByProductSku,
    todayDeliveryList,
  } = useSelector(selectDelivery);
  console.log(
    deliverySummaryByProduct,
    deliverySummaryByProductSku,
    todayDeliveryList,
    'deliverySummaryByProduct, deliverySummaryByProductSku, todayDeliveryList',
  );
  const {stores} = useSelector(selectStoreState);
const storesWithAll: StoreItem[] = [
  {
    storeId: "all",
    storeCode: "ALL",
    storeName: "All",
    latitude: "",
    longitude: "",
    imageUrl: "",
    address: "",
  },
  ...stores,
];

  console.log(stores, '4567890njm');
  useEffect(() => {
    loadDashboardData();
  }, []);
  const loadDashboardData = async () => {
    try {
      const data = await dataService.refreshData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadDashboardData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleLocationChange = async (location: string) => {
    setSelectedLocation(location);
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCardPress = (cardType: string) => {
    Alert.alert('Card Pressed', `${cardType} card was pressed`);
  };

  const handleActionPress = async (dispatch: AppDispatch) => {
    // Alert.alert('Action', 'Action button pressed');
    await AsyncStorage.removeItem('user');
    dispatch({type: 'auth/logout'});
  };

  const handleDownloadPress = () => {
    Alert.alert('Download', 'Download button pressed');
  };

  const handleCustomerPress = (customer: Customer) => {
    Alert.alert('Customer', `${customer.name} selected`);
  };

  const filteredCustomers = dataService.getFilteredCustomers(selectedLocation);
  const totalDue = dataService.getTotalDueByLocation(selectedLocation);

  // Define tabs based on user role
  const getTabs = () => {
    if (userRole === 'admin') {
      return [
        {id: 'products', label: 'Products'},
        // {id: 'customers', label: 'Customers'},
        {id: 'deliveries', label: 'Deliveries'},
        // {id: 'history', label: 'History'},
      ];
    } else {
      return [
        {id: 'products', label: 'Products'},
        // {id: 'customers', label: 'Customers'},
        // {id: 'wallet', label: 'Wallet'},
        {id: 'deliveries', label: 'Deliveries'},
      ];
    }
  };

  const tabs = getTabs();
  useEffect(() => {
    const fetchData = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      console.log(storedUser, '<-- storedUser');

      if (storedUser) {
        const {storeCode} = JSON.parse(storedUser);

        await dispatch(fetchTodayDeliverySummaryByProduct(storeCode || ''));
        await dispatch(fetchTodayDeliverySummaryByProductSKU(storeCode || ''));
        await dispatch(fetchStoreList());
        await dispatch(fetchTodayDeliveryList(storeCode || ''));
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const setStoreFromUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const {storeCode} = JSON.parse(storedUser);
        const selectedStore = stores.find(
          store => store.storeCode === storeCode,
        );
        console.log(selectedStore, '<-- selectedStore');
        setSelectedLocation(selectedStore?.storeName || '');
      }
    };

    if (stores.length > 0) {
      setStoreFromUser();
    }
  }, [stores]);

  return (
    <View style={styles.container}>
      <DashboardHeader
        locationData={stores}
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
        onActionPress={() => handleActionPress(dispatch)}
        userRole={userRole}
      />

      <SummaryCards onCardPress={handleCardPress} userRole={userRole} />

      {/* SuperAdmin specific: Deliveries Today Card */}
      {userRole === 'superAdmin' && <DeliveriesCard />}

      <DashboardTabs
        activeTab={activeTab}
        onTabPress={handleTabPress}
        tabs={tabs}
      />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={undefined}>
        {/* Admin: Customers Tab Content */}
        {userRole === 'admin' && activeTab === 'customers' && (
          <>
            <FilterBar
              totalDue={totalDue}
              selectedLocation={selectedLocation}
              onLocationChange={handleLocationChange}
              onDownloadPress={handleDownloadPress}
              filterType="prepaid"
            />

            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="Search customers..."
            />

            <CustomerList
              customers={filteredCustomers}
              onCustomerPress={handleCustomerPress}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          </>
        )}

        {/* SuperAdmin: Postpaid Tab Content */}
        {userRole === 'superAdmin' && activeTab === 'postpaid' && (
          <>
            <FilterBar
              totalDue={totalDue}
              selectedLocation={selectedLocation}
              onLocationChange={handleLocationChange}
              onDownloadPress={handleDownloadPress}
              filterType="postpaid"
            />

            <CustomerList
              customers={filteredCustomers}
              onCustomerPress={handleCustomerPress}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          </>
        )}

        {/* Placeholder content for other tabs */}
        {activeTab === 'products' && (
          // <View style={styles.tabContent}>
          //   <View style={styles.placeholderContainer}>
          //     <Text style={styles.placeholderText}>Products Tab Content</Text>
          //     <Text style={styles.placeholderSubtext}>
          //       {userRole === 'admin'
          //         ? 'Product management and catalog will be displayed here'
          //         : 'Product catalog and inventory management will be displayed here'
          //       }
          //     </Text>
          //   </View>
          // </View>
          <ProductsTable
            role={userRole}
            todayData={
              userRole === 'admin'
                ? deliverySummaryByProductSku
                : deliverySummaryByProductSku
            }
            tomorrowData={
              userRole === 'admin'
                ? deliverySummaryByProduct
                : deliverySummaryByProductSku
            }
            locationData={storesWithAll}
            selectedLocation={selectedLocation}
            onStoreChange={handleLocationChange}
          />
        )}
        {activeTab === 'deliveries' && (
          <DeliveriesTable
            role={userRole}
            data={todayDeliveryList.length > 0 ? todayDeliveryList : []}
            onUpdateStatus={(orderId, status) => {
              console.log('Update order', orderId, 'to', status);
              // call API here to update delivery status
            }}
          />
        )}
        {/* {userRole === 'admin' && activeTab === 'deliveries' && (
          <View style={styles.tabContent}>
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>Deliveries Tab Content</Text>
              <Text style={styles.placeholderSubtext}>
                Delivery tracking and management will be displayed here
              </Text>
            </View>
          </View>
        )} */}

        {userRole === 'admin' && activeTab === 'history' && (
          <View style={styles.tabContent}>
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>History Tab Content</Text>
              <Text style={styles.placeholderSubtext}>
                Transaction history and logs will be displayed here
              </Text>
            </View>
          </View>
        )}

        {userRole === 'superAdmin' && activeTab === 'customers' && (
          <View style={styles.tabContent}>
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>Customers Tab Content</Text>
              <Text style={styles.placeholderSubtext}>
                Customer management and analytics will be displayed here
              </Text>
            </View>
          </View>
        )}

        {userRole === 'superAdmin' && activeTab === 'wallet' && (
          <View style={styles.tabContent}>
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>Wallet Tab Content</Text>
              <Text style={styles.placeholderSubtext}>
                Wallet management and prepaid balance tracking will be displayed
                here
              </Text>
            </View>
          </View>
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
  scrollContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(2),
    padding: wp(4),
    minHeight: hp(40),
  },
  placeholderText: {
    fontSize: sp(18),
    fontFamily: FontFamily.BOLD,
    color: Colors.black,
    marginBottom: hp(1),
  },
  placeholderSubtext: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
    textAlign: 'center',
  },
});

export default UnifiedDashboard;
