import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

type TabItem = {
  label: string;
  key: string;
};

interface AdminTabBarProps {
  tabs: TabItem[];
  onTabPress?: (tabKey: string) => void;
}

const AdminTabBar: React.FC<AdminTabBarProps> = ({ tabs, onTabPress }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key);

  const handlePress = (key: string) => {
    setActiveTab(key);
    onTabPress?.(key);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => handlePress(tab.key)}
        >
          <Text style={[styles.tabText, activeTab === tab.key && styles.activeText]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default AdminTabBar;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#1a1a1a', // black/dark background for active
  },
  tabText: {
    fontSize: 14,
    color: '#000',
  },
  activeText: {
    color: '#fff',
    fontWeight: '600',
  },
});
