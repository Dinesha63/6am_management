import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { OrderTabType, TABS, } from '../../utils//constants/OrderTabType';
import { FontFamily } from '../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';    

interface OrderTabsProps {
  activeTab: OrderTabType;
  setActiveTab: (tab: OrderTabType) => void;
}

const OrderTabs: React.FC<OrderTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <View style={styles.tabBar}>
      {TABS.map(tab => (
        <TouchableOpacity 
          key={tab} 
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tab, activeTab === tab && styles.activeTab]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyBackground,
    paddingVertical: hp(1.2),
    backgroundColor: Colors.white,
  },
  tab: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
    paddingBottom: hp(0.5),
  },
  activeTab: {
    color: Colors.black,
    fontWeight: '600',
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
});

export default OrderTabs;