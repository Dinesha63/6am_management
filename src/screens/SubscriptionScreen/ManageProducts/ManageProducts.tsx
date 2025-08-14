/* eslint-disable react-native/no-inline-styles */
import products from './Products.json';
import {useState} from 'react';
import NavigationHeader from './Header';
import ProductCard from './Card';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {ScrollView, View} from 'react-native';
import {Text} from 'react-native-gesture-handler';
import SimpleIcon from '../../../components/SimpleIcon';
import {FontFamily} from '../../../utils/constant';
import {imagePaths} from '../../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../../utils/constants/responsiveScreen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types';
import Admin from '../../Admin/Index';

const ManageProducts: React.FC = () => {
  const [enabledProductIds, setEnabledProductIds] = useState<number[]>([]);

  const toggleSwitch = (productId: number) => {
    const isCurrentlyEnabled = enabledProductIds.includes(productId);

    if (isCurrentlyEnabled) {
      setEnabledProductIds(prevIds => prevIds.filter(id => id !== productId));
    } else {
      setEnabledProductIds(prevIds => [...prevIds, productId]);
    }
  };
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      <NavigationHeader title="Manage Products" />
      <ScrollView style={styles.scrollView}>
        <View>
          <View style={styles.infoRow}>
            <SimpleIcon style={styles.infoIcon} source={imagePaths.Info_icon} />
            <Text style={styles.infoText}>
              Manage your deliveries; Edit or upcoming subscribe orders.
            </Text>
            
          </View>

          {products.map(product => {
            const isEnabled = enabledProductIds.includes(product.id);

            return (
              <ProductCard
                key={product.id}
                product={product}
                isEnabled={isEnabled}
                toggleSwitch={toggleSwitch}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: hp(2.1),
  },
  scrollView: {
    marginBottom: 70,
  },
  infoRow: {
    flexDirection: 'row',
    width: '70%',
    height: 40,
    alignSelf: 'center',
  },
  infoIcon: {
    marginTop: 5,
  },
  infoText: {
    color: '#6B7280',
    fontSize: sp(11),
    marginLeft: wp(2),
    fontFamily: FontFamily.REGULAR,
  },
});

export default ManageProducts;
