import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert, ScrollView, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import DashboardHeader from './DashboardHeader';
import SummaryCards from './SummaryCards';
import DashboardTabs from './DashboardTabs';
import FilterBar from './FilterBar';
import CustomerList from './CustomerList';
import SearchBar from './SearchBar';
import DashboardDataService, {Customer} from './DashboardDataService';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import {FontFamily} from '../../utils/constant';

const AdminDashboard: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState('Vedapatti');
  const [activeTab, setActiveTab] = useState('customers');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardData, setDashboardData] = useState(
    DashboardDataService.getInstance().getDashboardData()
  );

  const userRole = useSelector((state: RootState) => state.user.userRole);
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
    Alert.alert('Customer', `${customer.name} selected`);
  };

  const filteredCustomers = dataService.getFilteredCustomers(selectedLocation);
  const totalDue = dataService.getTotalDueByLocation(selectedLocation);

  return (
    <View style={styles.container}>
      <DashboardHeader
        selectedLocation={selectedLocation}
        onLocationChange={handleLocationChange}
        onActionPress={handleActionPress}
        userRole="admin"
      />

      <SummaryCards onCardPress={handleCardPress} userRole="admin" />

      <DashboardTabs activeTab={activeTab} onTabPress={handleTabPress} />

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={undefined}
      >
        {activeTab === 'customers' && (
          <>
            <FilterBar
              totalDue={totalDue}
              selectedLocation={selectedLocation}
              onLocationChange={handleLocationChange}
              onDownloadPress={handleDownloadPress}
            />
            
            <SearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            
            <CustomerList
              customers={filteredCustomers}
              onCustomerPress={handleCustomerPress}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          </>
        )}

        {activeTab === 'products' && (
          <View style={styles.tabContent}>
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>Products Tab Content</Text>
              <Text style={styles.placeholderSubtext}>Product management and catalog will be displayed here</Text>
            </View>
          </View>
        )}

        {activeTab === 'deliveries' && (
          <View style={styles.tabContent}>
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>Deliveries Tab Content</Text>
              <Text style={styles.placeholderSubtext}>Delivery tracking and management will be displayed here</Text>
            </View>
          </View>
        )}

        {activeTab === 'history' && (
          <View style={styles.tabContent}>
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>History Tab Content</Text>
              <Text style={styles.placeholderSubtext}>Transaction history and logs will be displayed here</Text>
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

export default AdminDashboard;
