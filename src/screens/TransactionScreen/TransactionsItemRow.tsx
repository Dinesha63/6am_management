import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { FontFamily } from '../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';  

export interface TransactionItem {
      productSkuCode: string;
      productSkuName: string;
      productSkuImageUrl: string;
      quantity: number;
}

interface TransactionItemRowProps {
  item: TransactionItem;
}

const TransactionItemRow: React.FC<TransactionItemRowProps> = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imagePlaceholder} >
        <Image source={{uri: item.productSkuImageUrl}} style={styles.imagePlaceholder} />
        </View> 

      <View style={styles.detailsContainer}>
        <Text style={styles.productName}>{item.productSkuName}</Text>
        {/* <Text style={styles.storeName}>{item.storeName}</Text> */}
        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>

        {/* {item.productSkuCode && <Text style={styles.badge}>{item.badgeText}</Text>} */}
      </View>
    </View>  
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: wp(3),
    borderRadius: wp(2.5),
    borderColor: Colors.lineLight,
    borderWidth: 1,
    marginTop: hp(1.2),
  },
  imagePlaceholder: {
    width: wp(16),
    height: wp(16),
    backgroundColor: Colors.lineLight,
    borderRadius: wp(2),
    marginRight: wp(3),
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: sp(15),
    fontWeight: '700',
    fontFamily: FontFamily.REGULAR,
    color: Colors.blackText,
  },
  storeName: {
    fontSize: sp(13),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
    marginTop: hp(0.5),
  },
  quantity: {
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
    marginTop: hp(0.5),
  },
  badge: {
    marginTop: hp(0.8),
    backgroundColor: Colors.badgeText,
    color: Colors.white,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.5),
    fontSize: sp(12),
    borderRadius: wp(1.5),
    alignSelf: 'flex-start',
    fontWeight: '600',
  },
});


export default TransactionItemRow;
