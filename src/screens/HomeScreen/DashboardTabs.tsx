import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import {FontFamily} from '../../utils/constant';

interface DashboardTabsProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
  tabs?: Array<{id: string; label: string}>;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({activeTab, onTabPress, tabs}) => {
  const defaultTabs = [
    {id: 'products', label: 'Products'},
    {id: 'customers', label: 'Customers'},
    {id: 'wallet', label: 'Wallet'},
    {id: 'postpaid', label: 'Postpaid'},
    {id: 'deliveries', label: 'Deliveries'},
  ];

  const tabList = tabs || defaultTabs;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {tabList.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab,
            ]}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  scrollContent: {
    paddingHorizontal: wp(4),
  },
  tab: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    marginRight: wp(2),
    borderRadius: wp(2),
    backgroundColor: Colors.greyBackground,
  },
  activeTab: {
    backgroundColor: Colors.black,
  },
  tabText: {
    fontSize: sp(14),
    fontFamily: FontFamily.MEDIUM,
    color: Colors.grey,
  },
  activeTabText: {
    color: Colors.white,
    fontFamily: FontFamily.BOLD,
  },
});

export default DashboardTabs;
