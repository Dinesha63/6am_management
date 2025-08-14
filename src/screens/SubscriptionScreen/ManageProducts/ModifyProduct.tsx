/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  StyleSheet,
} from 'react-native';
import Colors from '../../../utils/constants/colors';
import { FontFamily} from '../../../utils/constant';
import SimpleIcon from '../../../components/SimpleIcon';
import Header from './Header';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types';
import { imagePaths } from '../../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../../utils/constants/responsiveScreen';

interface Product {
  Wallet: number;
  Quantity: string;
  Basics: string;
}

const ModifyProduct: React.FC = () => {
  const [selectedFrequency, setSelectedFrequency] = useState<string>('Daily');
  const [selectedQuantity, setSelectedQuantity] = useState<string>('1 Litre');
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [isModified, setIsModified] = useState<boolean>(false);
  const [initialValues] = useState({
    frequency: selectedFrequency,
    quantity: selectedQuantity,
  });
  const [quantityDropdownVisible, setQuantityDropdownVisible] =
    useState<boolean>(false);
  const [product, setProduct] = useState<Product>({
    Wallet: 780,
    Quantity: '1 Litre',
    Basics: 'Daily',
  });

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const toggleDropdown = (): void => {
    setDropdownVisible(!dropdownVisible);
    setQuantityDropdownVisible(false);
  };

  const toggleQuantityDropdown = (): void => {
    setQuantityDropdownVisible(!quantityDropdownVisible);
    setDropdownVisible(false);
  };

  const selectFrequency = (frequency: string): void => {
    setSelectedFrequency(frequency);
    setDropdownVisible(false);
    setProduct({...product, Basics: frequency});
    setIsModified(frequency !== initialValues.frequency);
  };

  const selectQuantity = (quantity: string): void => {
    setSelectedQuantity(quantity);
    setQuantityDropdownVisible(false);
    setProduct({...product, Quantity: quantity});
    setIsModified(quantity !== initialValues.quantity);
  };

  return (
    <View style={styles.container}>
      <Header title="Modify Quantity" />
      <View style={styles.productContainer}>
        <View style={styles.productInfo}>
         <View style={styles.productHeader}>
  <Image
    source={imagePaths.milk_img}
    style={styles.smallProductImage}
  />
  <Text style={styles.productTitle}>Cow Milk</Text>
  <View style={styles.dropdownColumn}>
    <View>
      {/* Frequency Dropdown */}
      <TouchableWithoutFeedback onPress={toggleDropdown}>
        <View style={styles.dropdown}>
          <Text style={styles.quantityText}>
            {selectedFrequency}
            <SimpleIcon
              style={styles.downArrowIcon}
              source={imagePaths.down_arrow_icon}
            />
          </Text>
        </View>
      </TouchableWithoutFeedback>
      {dropdownVisible && (
        <FlatList
          data={['Daily', 'Weekly', 'Monthly']}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                selectFrequency(item);
                setDropdownVisible(false);
              }}>
              <Text style={styles.dropdownItem}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item}
          style={styles.dropdownList}
        />
      )}
    </View>
    <View>
      {/* Quantity Dropdown */}
      <TouchableWithoutFeedback onPress={toggleQuantityDropdown}>
        <View style={styles.dropdown}>
          <Text style={styles.quantityText}>
            {selectedQuantity}
            <SimpleIcon
              style={styles.downArrowIcon}
              source={imagePaths.down_arrow_icon}
            />
          </Text>
        </View>
      </TouchableWithoutFeedback>
      {quantityDropdownVisible && (
        <FlatList
          data={[
            '1 Litre',
            '2 Litre',
            '3 Litre',
            '4 Litre',
            '5 Litre',
          ]}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                selectQuantity(item);
                setQuantityDropdownVisible(false);
              }}>
              <Text style={styles.dropdownItem}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item}
          style={styles.dropdownList}
        />
      )}
    </View>
  </View>
</View>
        </View>
        <View style={styles.walletContainer}>
          <View style={styles.walletText}>
            <Text style={styles.walletTitle}>Wallet Balance</Text>
            <Text style={styles.walletAmount}>{`₹ ${product.Wallet}`} </Text>
          </View>
          <Text style={styles.walletMessage}>
            You have 13 days remaining in your subscription
          </Text>
        </View>
       <View style={styles.infoContainer}>
  <SimpleIcon style={styles.infoIcon} source={imagePaths.Info_icon} />
  <Text style={styles.infoText}>
    Adjust the quantity of your subscription products or remove items as needed
  </Text>
</View>        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.addProductsButton}
            onPress={() => {
              if (isModified) {
                console.log('Updating subscription with:', {
                  frequency: selectedFrequency,
                  quantity: selectedQuantity,
                });
              } else {
                console.log('Adding products');
              }
            }}>
            <Text style={styles.buttonText}>
              {isModified ? 'Update Subscription' : 'Add Products'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (isModified) {
                setSelectedFrequency(initialValues.frequency);
                setSelectedQuantity(initialValues.quantity);
                setIsModified(false);
              } else {
                navigation.goBack();
              }
            }}
            style={styles.goBackButton}>
            <Text style={styles.buttonText}>
              {isModified ? 'Cancel Changes' : 'Go Back'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4), 
   
  },
  productContainer: {
    borderRadius: wp(2.1),        
    borderWidth: 1,
    paddingHorizontal: wp(3.7),   
    paddingVertical: hp(1.85),    
    borderColor: Colors.purpleBorder,
    marginTop: hp(2.5),           
    width: '98%',
    alignSelf: 'center',
  },
  dropdownColumn: {
  flexDirection: 'column',
  marginLeft: '25%',
},
downArrowIcon: {
  height: 15,
  width: 20,
},
infoIcon: {
  marginTop: 5,
},
infoText: {
  color: 'black',
  fontSize: 12,
  marginLeft: 10,
  fontFamily: FontFamily.REGULAR,
},
  quantityText: {
    color: Colors.lightBlack,
    fontWeight: '600',
  },
  productInfo: {
    marginBottom: hp(2.5),        
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallProductImage: {
    width: wp(18.4),              
    height: wp(18.4),
    borderRadius: wp(2.6),        
    marginRight: wp(2.6),         
  },
  productTitle: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
    marginBottom: hp(6),          
  },
  dropdown: {
    marginLeft: wp(4.8),          
    padding: wp(2.6),             
    backgroundColor: Colors.halfWhite,
    borderRadius: wp(2.6),        
    height: hp(5),                
    marginBottom: hp(1.2),        
  },
  dropdownItem: {
    padding: wp(2.6),             
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    backgroundColor: Colors.halfWhite,
  },
  dropdownList: {
    position: 'absolute',
    top: hp(5),                   
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: wp(1.3),        
    zIndex: 1,
  },
  walletContainer: {
    backgroundColor: Colors.creamWhite,
    padding: wp(4),               
    borderRadius: wp(2.6),        
    marginBottom: hp(2.5),        
    elevation: 5,
  },
  walletTitle: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    color: Colors.lightBlack,
    marginBottom: hp(0.6),        
  },
  walletAmount: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
    color: Colors.greenColour,
  },
  walletMessage: {
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
    width: '100%',
  },
  walletText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flexDirection: 'row',
    width: '85%',
    height: hp(5),                
    marginLeft: '2%',
    marginBottom: '2%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  goBackButton: {
    backgroundColor: Colors.grey,
    paddingHorizontal: wp(1.3),   
    paddingVertical: hp(0.65),    
    marginRight: wp(2.6),         
    alignItems: 'center',
  },
  addProductsButton: {
    backgroundColor: Colors.greenColour,
    paddingHorizontal: wp(1.3),   
    paddingVertical: hp(0.65),    
    alignItems: 'center',
    marginRight: wp(4),           
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default ModifyProduct;
