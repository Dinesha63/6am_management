import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, StatusBar, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import Header from './header';
import ProductList from './productList';
import DiscountCard from './DiscountCard';
import OrderSummary from './OrderSummary';
import ContinueButton from './ContinueButton';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';  

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

const OrderDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderItems } = route.params;
  console.log("orderItems :", orderItems);

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 108.00;
  const total = subtotal - discount;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <Header />
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ProductList items={orderItems} />
          <DiscountCard />
          <OrderSummary 
            subtotal={subtotal} 
            discount={discount} 
            itemCount={orderItems.reduce((sum, item) => sum + item.quantity, 0)} 
          />
        </ScrollView>
          <View style={{backgroundColor: '#FAF3A0', padding: hp(1),marginVertical: hp(1), marginHorizontal: wp(4),borderRadius: wp(2), }}>
            <Text>You can also subscribe to 'Milk (1 Litre)' for daily free home delivery.</Text>
          </View>
        <ContinueButton
          totalAmount={total}
          onPress={() =>  console.log('Continue to Payment')}   
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGreyScreen,
  },
  content: {
    flex: 1,
    padding: wp(4), 
  },
});

export default OrderDetailScreen;






