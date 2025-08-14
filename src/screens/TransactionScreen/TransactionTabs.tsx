import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { FontFamily, TransactionTabType } from '../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

interface TransactionTabsProps {
  activeTab: TransactionTabType;
  setActiveTab: (tab: TransactionTabType) => void;
  filter: 'This Month' | 'Last 7 Days';
  setFilter: (filter: 'This Month' | 'Last 7 Days') => void;
}

const TransactionTabs: React.FC<TransactionTabsProps> = ({
  activeTab,
  setActiveTab,
  filter,
  setFilter,
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleFilterSelect = (option: 'This Month' | 'Last 7 Days') => {
    setFilter(option);
    setDropdownVisible(false);
  };

  return (
    <View style={styles.tabRow}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {(['All', 'Credits Added', 'Purchases'] as TransactionTabType[]).map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tab, activeTab === tab && styles.activeTab]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom Dropdown */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
          <Text style={styles.dropdownText}>{filter} ▼</Text>
        </TouchableOpacity>
        {isDropdownVisible && (
          <View style={styles.dropdownOptions}>
            {['This Month', 'Last 7 Days'].map((option) => (
              <TouchableOpacity key={option} onPress={() => handleFilterSelect(option as 'This Month' | 'Last 7 Days')} style={styles.dropdownOption}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    marginRight: wp(4),
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
  },
  activeTab: {
    color: Colors.blackText,
    borderBottomWidth: 2,
    borderColor: Colors.danger,
    paddingBottom: hp(0.25),
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: Colors.lineLight,
    borderRadius: wp(2),
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2.5),
    backgroundColor: Colors.white,
  },
  dropdownText: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
  },
  dropdownOptions: {
    position: 'absolute',
    top: hp(5),
    right: 0,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lineLight,
    borderRadius: wp(2),
    zIndex: 10,
  },
  dropdownOption: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
  },
  optionText: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
  },
});


export default TransactionTabs;
