import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import DashboardHeader from './DashboardHeader';
import SummaryCards from './SummaryCards';
import DeliveriesCard from './DeliveriesCard';
import DashboardTabs from './DashboardTabs';
import FilterBar from './FilterBar';
import CustomerList from './CustomerList';
import DashboardDataService, {Customer} from './DashboardDataService';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

const DashboardScreen: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState('Vedapatti');
  const [activeTab, setActiveTab] = useState('postpaid');
  const [refreshing, setRefreshing] = useState(false);
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

  const handleDeliveriesPress = () => {
    Alert.alert('Deliveries', 'Deliveries card pressed');
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
      />

      <SummaryCards onCardPress={handleCardPress} />

      <DeliveriesCard
        completed={dashboardData.deliveries.completed}
        total={dashboardData.deliveries.total}
        pending={dashboardData.deliveries.pending}
        skipped={dashboardData.deliveries.skipped}
        onPress={handleDeliveriesPress}
      />

      <DashboardTabs activeTab={activeTab} onTabPress={handleTabPress} />

      {activeTab === 'postpaid' && (
        <>
          <FilterBar
            totalDue={totalDue}
            selectedLocation={selectedLocation}
            onLocationChange={handleLocationChange}
            onDownloadPress={handleDownloadPress}
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
        <View style={styles.placeholderContainer}>
        </View>
      )}

      {activeTab === 'customers' && (
        <View style={styles.placeholderContainer}>
        </View>
      )}

      {activeTab === 'wallet' && (
        <View style={styles.placeholderContainer}>
        </View>
      )}

      {activeTab === 'deliveries' && (
        <View style={styles.placeholderContainer}>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.greyBackground,
  },
});

export default DashboardScreen;
