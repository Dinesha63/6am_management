import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { imagePaths } from '../../utils/constants/imagePaths';
import Header from './Header';
import OrderTabs from './OrderTabs';
import SimpleIcon from '../../components/SimpleIcon';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

type RootStackParamList = {
  List: { category?: string };
};

const NewOrderScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <>
      {/* <Header /> */}
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.orderContainer}>
            <SimpleIcon source={imagePaths.logistics_icon}
                        size={120}
                        color="#43A047"
                        style={{ marginBottom: 20 }}
                      />

            <Text style={styles.noOrdersText}>No orders yet? Let's change that!</Text>
            <Text style={styles.subText}>Let's fill it with something amazing.</Text>

            <TouchableOpacity style={styles.exploreButton}
             onPress={() => navigation.navigate('List', { category: 'All' })} 
             >
              <Text style={styles.buttonText}>Explore Products</Text>
            </TouchableOpacity>

            <Text style={styles.deliveryText}>Free Door Delivery, Always!</Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: wp(4),
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(5),
  },
  orderContainer: {
    alignItems: 'center',
  },
  logisticsIcon: {
    width: wp(32),
    height: wp(32),
    marginBottom: hp(2.5),
    tintColor: '#43A047',
  },
  noOrdersText: {
    fontSize: sp(18),
    fontWeight: '600',
    color: Colors.black,
    marginBottom: hp(1),
    textAlign: 'center',
  },
  subText: {
    fontSize: sp(14),
    color: Colors.black,
    marginBottom: hp(3),
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(25),
    borderRadius: wp(2),
    marginBottom: hp(2),
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: sp(16),
    textAlign: 'center',
  },
  deliveryText: {
    fontSize: sp(15),
    fontWeight: '500',
    color: Colors.black,
    textAlign: 'center',
  },
});



export default NewOrderScreen;