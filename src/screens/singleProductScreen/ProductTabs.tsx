import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ProductDetailData } from '../../redux/Features/Product/product.types';
import Colors from '../../utils/constants/colors';

interface ProductTabsProps {
  productDetail?: ProductDetailData;
}

const TABS = ['Description', 'Nutrition'/*, 'Review'*/];

const ProductTabs: React.FC<ProductTabsProps> = ({ productDetail }) => {
  const [activeTab, setActiveTab] = useState('Description');

  const renderContent = () => {
    switch (activeTab) {
      case 'Description':
        return (
          <Text style={[styles.contentText, styles.descriptionText]}>
            {productDetail?.description || 'No description available.'}
          </Text>
        );
      case 'Nutrition':
        return (
          <Text style={styles.contentText}>
            {productDetail?.nutrition || 'No nutrition information available.'}
          </Text>
        );
      // case 'Review':
      //   return (
      //     <Text style={styles.contentText}>
      //       {productDetail?.review !== undefined
      //         ? productDetail.review
      //         : 'No reviews yet.'}
      //     </Text>
      //   );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.activeLine} />}
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.contentContainer}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    flex: 1,
  },
  tabRow: {
    flexDirection: 'row',
    // borderBottomWidth: 1,
    // borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#000',
  },
  activeLine: {
    marginTop: 4,
    height: 2,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius:5,
    backgroundColor: Colors.primary,
    width: '70%',
  },
  contentContainer: {
    paddingTop: 12,
    paddingHorizontal: 4,
    minHeight: 0,
  },
  contentText: {
    fontSize: 15,
    color: '#222',
    lineHeight: 27,
    marginLeft: 10,
    flex: 1,
  },
  descriptionText: {
    lineHeight: 30,
    textAlign: 'justify',
    marginRight: 10,
  },
});

export default ProductTabs;
