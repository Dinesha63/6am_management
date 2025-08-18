import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert, ScrollView, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {Routes} from '../../navigation/routes';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
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

interface UnifiedDashboardProps {
  userRole: 'admin' | 'superAdmin';
}

const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({userRole}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedLocation, setSelectedLocation] = useState('Vedapatti');
  const [activeTab, setActiveTab] = useState(userRole === 'admin' ? 'customers' : 'postpaid');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardData, setDashboardData] = useState(
    DashboardDataService.getInstance().getDashboardData()
  );

  const dataService = DashboardDataService.getInstance();

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

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCardPress = (cardType: string) => {
    Alert.alert('Card Pressed', `${cardType} card was pressed`);
  };

  const handleActionPress = () => {
    Alert.alert('Action', 'Action button pressed');
  };

  const handleDownloadPress = () => {
    Alert.alert('Download', 'Download button pressed');
  };

  const handleCustomerPress = (customer: Customer) => {
    navigation.navigate(Routes.CustomerInfo, {customerId: customer.id});
  };

  const filteredCustomers = dataService.getFilteredCustomers(selectedLocation);
  const totalDue = dataService.getTotalDueByLocation(selectedLocation);

  // Define tabs based on user role
  const getTabs = () => {
    if (userRole === 'admin') {
      return [
        {id: 'products', label: 'Products'},
        {id: 'customers', label: 'Customers'},
        {id: 'deliveries', label: 'Deliveries'},
        {id: 'history', label: 'History'},
      ];
    } else {
      return [
        {id: 'products', label: 'Products'},
        {id: 'customers', label: 'Customers'},
        {id: 'wallet', label: 'Wallet'},
        {id: 'postpaid', label: 'Postpaid'},
      ];
    }
  };

  const tabs = getTabs();

  return (
    <View style={styles.container}>
      <DashboardHeader
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
        onActionPress={handleActionPress}
        userRole={userRole}
      />

      <SummaryCards onCardPress={handleCardPress} userRole={userRole} />

      {/* SuperAdmin specific: Deliveries Today Card */}
      {userRole === 'superAdmin' && (
        <DeliveriesCard />
      )}

      <DashboardTabs 
        activeTab={activeTab} 
        onTabPress={handleTabPress}
        tabs={tabs}
      />

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={undefined}
      >
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
          <View style={styles.tabContent}>
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>Products Tab Content</Text>
              <Text style={styles.placeholderSubtext}>
                {userRole === 'admin' 
                  ? 'Product management and catalog will be displayed here'
                  : 'Product catalog and inventory management will be displayed here'
                }
              </Text>
            </View>
          </View>
        )}

        {userRole === 'admin' && activeTab === 'deliveries' && (
          <View style={styles.tabContent}>
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>Deliveries Tab Content</Text>
              <Text style={styles.placeholderSubtext}>Delivery tracking and management will be displayed here</Text>
            </View>
          </View>
        )}

        {userRole === 'admin' && activeTab === 'history' && (
          <View style={styles.tabContent}>
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>History Tab Content</Text>
              <Text style={styles.placeholderSubtext}>Transaction history and logs will be displayed here</Text>
            </View>
          </View>
        )}

        {userRole === 'superAdmin' && activeTab === 'customers' && (
          <View style={styles.tabContent}>
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>Customers Tab Content</Text>
              <Text style={styles.placeholderSubtext}>Customer management and analytics will be displayed here</Text>
            </View>
          </View>
        )}

        {userRole === 'superAdmin' && activeTab === 'wallet' && (
          <View style={styles.tabContent}>
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>Wallet Tab Content</Text>
              <Text style={styles.placeholderSubtext}>Wallet management and prepaid balance tracking will be displayed here</Text>
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
