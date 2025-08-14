/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Switch,
  Modal,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  FlatList,
  ToastAndroid,
} from 'react-native';
import Colors from '../../../utils/constants/colors';
import { FontFamily} from '../../../utils/constant';
import { imagePaths } from '../../../utils/constants/imagePaths';
import Buttons from './CardButtons';
import SimpleIcon from '../../../components/SimpleIcon';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../types';
import {useNavigation} from '@react-navigation/native';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../../utils/constants/responsiveScreen';

interface ProductCardProps {
  product: {
    id: number;
    Quantity: string;
    Type_of_Milk: string;
    Basics: string;
    Wallet: number;
    nextDelivery: string;
    pricePerDay: number;
    // status: string;
  };
  isEnabled: boolean;
  toggleSwitch: (productId: number) => void;
  onUpdateProduct?: (updatedProduct: Product) => void;
}
interface Product {
  id: string | number;
  name: string;
  description?: string;
  image?: string;
  price?: number;
  today_price: number;
  category?: string;
  rating?: number;
  reviews?: number;
  is_favorite?: boolean;
  quantity?: number;
  unit?: string;
  Basics: string;
}
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  // isEnabled,
  toggleSwitch,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [showReSubscribe, setShowReSubscribe] = useState<boolean>(false);
  const [startDate, setStartDate] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [selectedFrequency, setSelectedFrequency] = useState<string>(
    product.Basics,
  );
  const [quantityDropdownVisible, setQuantityDropdownVisible] =
    useState<boolean>(false);
  const [selectedQuantity, setSelectedQuantity] = useState<string>(
    product.Quantity,
  );
  const [nextDelivery, setNextDelivery] = useState<string>(
    product.nextDelivery,
  );
  const [isSwitchEnabled, setIsSwitchEnabled] = useState<boolean>(false);

  const handleReSubscribe = () => {
    setShowReSubscribe(true);
  };
  const handleSubscribe = () => {
    if (startDate) {
      setNextDelivery(startDate);
      setIsSwitchEnabled(false);
      setShowReSubscribe(false);
    } else {
      ToastAndroid.show('Please select a start date', ToastAndroid.SHORT);
    }
  };

  const handleSwitchToggle = () => {
    if (!isSwitchEnabled) {
      setModalVisible(true);
    } else {
      toggleSwitch(product.id);
      setIsSwitchEnabled(!isSwitchEnabled);
    }
  };

  const handleConfirmDisable = () => {
    toggleSwitch(product.id);
    setIsSwitchEnabled(!isSwitchEnabled);
    setModalVisible(false);
  };

  const handleCancelDisable = () => {
    setModalVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
    setQuantityDropdownVisible(false);
  };

  const toggleQuantityDropdown = () => {
    setQuantityDropdownVisible(!quantityDropdownVisible);
    setDropdownVisible(false);
  };

  const selectFrequency = (frequency: string) => {
    setSelectedFrequency(frequency);
    setDropdownVisible(false);
  };

  const selectQuantity = (quantity: string) => {
    setSelectedQuantity(quantity);
    setQuantityDropdownVisible(false);
  };

  return (
    // ...existing code...
<View style={styles.productCard1}>
  {!showReSubscribe ? (
    <>
      <View>
        <View style={styles.row}>
          <View>
            <Image style={styles.cardImage} source={imagePaths.milk_img} />
          </View>
          <View style={styles.productText}>
            <Text style={styles.productTextBold}>
              {isSwitchEnabled ? null : selectedQuantity}
              {product.Type_of_Milk} ({product.Basics})
            </Text>
            <Text style={styles.productDeliveryDate}>
              {isSwitchEnabled ? null : `Next Delivery ${nextDelivery}`}
            </Text>
          </View>
          <View style={styles.switchContainer}>
            <Switch
              trackColor={{
                false: Colors.grey,
                true: Colors.greenColour,
              }}
              thumbColor={
                isSwitchEnabled ? Colors.greenColour : Colors.white
              }
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleSwitchToggle}
              value={isSwitchEnabled}
            />
          </View>
        </View>
        <View style={styles.column}>
          <Text style={styles.productPriceText}>
            {isSwitchEnabled ? 'Paused' : `₹ ${product.pricePerDay} / Day`}
          </Text>
          <View style={styles.line} />
        </View>
      </View>
      <Buttons
        isEnabled={isSwitchEnabled}
        onReSubscribe={handleReSubscribe}
      />
    </>
  ) : (
    <View style={styles.reSubscribeContainer}>
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Image
            source={imagePaths.milk_img}
            style={styles.smallProductImage}
          />
          <Text style={styles.productTitle}>Cow Milk</Text>
          <View style={styles.reSubscribeDropdowns}>
            <View style={styles.quantityContainer}>
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
            <View style={styles.quantityContainer}>
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
        <View style={styles.walletRow}>
          <Text style={styles.walletTitle}>Wallet Balance</Text>
          <Text style={styles.walletAmount}>{`₹ ${product.Wallet}`}</Text>
        </View>
        <Text style={styles.walletMessage}>
          You can extend your subscription by 5 more days.
        </Text>
        <Text style={styles.walletMessage}>
          Add funds to your wallet to continue deliveries.
        </Text>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Set Starting date</Text>
        <TextInput
          style={styles.dateInput}
          value={startDate}
          onChangeText={text => setStartDate(text)}
          placeholder="DD/MM/YYYY"
          placeholderTextColor={Colors.grey}
        />
      </View>
      <View style={styles.subscribeButtons}>
        <TouchableOpacity
          style={styles.goBackButton}
          onPress={() => setShowReSubscribe(false)}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={handleSubscribe}>
          <Text style={styles.buttonText}>Subscribe</Text>
        </TouchableOpacity>
      </View>
    </View>
  )}

  {/* confirmation modal */}
  <Modal
    transparent={true}
    visible={isModalVisible}
    animationType="slide"
    onRequestClose={handleCancelDisable}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Pause Delivery</Text>
        <Text style={styles.modalMessage}>
          Are you sure you want to really pause this product?
        </Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={styles.modalButtonCancel}
            onPress={handleCancelDisable}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalButtonConfirm}
            onPress={handleConfirmDisable}>
            <Text style={styles.modalButtonText}>Yes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
</View>
// ...existing code...
  );
};

const styles = StyleSheet.create({
  row: {
  flexDirection: 'row',
},
column: {
  flexDirection: 'column',
},
productTextBold: {
  fontWeight: '600',
},
reSubscribeContainer: {
  padding: 15,
},
reSubscribeDropdowns: {
  flexDirection: 'column',
  marginLeft: '25%',
},
downArrowIcon: {
  height: 15,
  width: 20,
},
walletRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 10,
},
  productCard1: {
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: Colors.purpleBorder,
    marginTop: hp(2.5),
    width: wp(90),
    alignSelf: 'center',
  },
  cardImage: {
    width: wp(18),
    height: wp(18),
    marginLeft: wp(2.5),
    marginTop: hp(1.5),
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.lineLight,
    alignSelf: 'flex-start',
    marginBottom: hp(1),
  },
  productText: {
    marginTop: hp(1.3),
    marginLeft: wp(2.5),
    flex: 1,
  },
  productDeliveryDate: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
  },
  switchContainer: {
    right: wp(5),
    top: hp(1.5),
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  productPriceText: {
    bottom: hp(1.8),
    textAlign: 'right',
    marginRight: wp(7),
    color: Colors.brown,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: wp(80),
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(2.5),
    padding: wp(5),
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
    marginBottom: hp(1.2),
  },
  modalMessage: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    textAlign: 'center',
    marginBottom: hp(2),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: Colors.grey,
    padding: hp(1),
    borderRadius: wp(1.5),
    marginRight: wp(2.5),
    alignItems: 'center',
  },
  modalButtonConfirm: {
    flex: 1,
    backgroundColor: Colors.greenColour,
    padding: hp(1),
    borderRadius: wp(1.5),
    alignItems: 'center',
  },
  modalButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2.5),
    width: '100%',
  },
  smallProductImage: {
    width: wp(18),
    height: wp(18),
    marginRight: wp(2.5),
  },
  productInfo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  productTitle: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
    marginBottom: hp(2),
  },
  quantityContainer: {
    width: '100%',
    backgroundColor: Colors.greyBackground,
    padding: wp(1.5),
    borderRadius: wp(1.5),
  },
  quantityText: {
    color: Colors.lightBlack,
    fontWeight: '600',
  },
  walletContainer: {
    backgroundColor: Colors.creamWhite,
    padding: wp(4),
    borderRadius: wp(2.5),
    width: '100%',
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.25,
  },
  walletTitle: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    color: Colors.lightBlack,
  },
  walletAmount: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
    color: Colors.darkGreen,
  },
  walletMessage: {
    color: Colors.lightBlack,
    fontSize: sp(13),
    fontFamily: FontFamily.REGULAR,
    lineHeight: hp(3),
  },
  dateContainer: {
    width: '100%',
    marginBottom: hp(2.5),
  },
  dateLabel: {
    top: hp(1.2),
    left: wp(2.5),
    zIndex: 1,
    color: Colors.darkPurple,
    backgroundColor: Colors.creamWhite,
    width: '35%',
  },
  dateInput: {
    height: hp(6),
    borderWidth: 2,
    borderColor: Colors.purpleBorder,
    borderRadius: wp(1.5),
    paddingLeft: wp(2.5),
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
  },
  subscribeButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  goBackButton: {
    backgroundColor: Colors.grey,
    padding: hp(0.8),
    borderRadius: wp(1.5),
    marginRight: wp(2.5),
    alignItems: 'center',
  },
  subscribeButton: {
    backgroundColor: Colors.greenColour,
    borderRadius: wp(1.5),
    paddingHorizontal: wp(5),
    paddingVertical: hp(0.8),
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  dropdown: {
    padding: wp(2.5),
    backgroundColor: Colors.halfWhite,
    borderRadius: wp(2.5),
    height: hp(5),
  },
  dropdownItem: {
    padding: wp(2.5),
    backgroundColor: Colors.halfWhite,
  },
  dropdownList: {
    position: 'absolute',
    top: hp(5),
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: wp(1.5),
    zIndex: 1,
  },
});


export default ProductCard;
