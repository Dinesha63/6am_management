import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
  SafeAreaView,
  ToastAndroid,
} from 'react-native';
import Header from './Header';
import PhotoUploadComponent from './PhotoUpload'; 
import Colors from '../../utils/constants/colors';
import SuccessPopup from './SuccessAlert'; 
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';

const orderData = {
  orderId: "#2105ABS",
  date: "15/02/2025",
  subscription: true,
  product: {
    name: "Product Name",
    deliveryTime: "6:33:56 am",
    quantity: "2 Litre",
    image: null 
  },
  availableProducts: [
    { id: 1, name: "Product Name - 2 Litre", quantity: "2 Litre" },
    { id: 2, name: "Product Name - 1 Litre", quantity: "1 Litre" },
    { id: 3, name: "Product Name - 500ml", quantity: "500ml" }
  ],
  damageReasons: [
    { id: 1, reason: "Milk - Spoiled" },
    { id: 2, reason: "Package - Damaged" },
    { id: 3, reason: "Quantity - Incorrect" },
    { id: 4, reason: "Quality - Poor" }
  ],
  returnOptions: [
    { id: 1, option: "Return" },
    { id: 2, option: "Replacement" },
    { id: 3, option: "Refund" }
  ]
};

interface ReportDamageScreenProps {
  navigation?: any;
}

const ReportDamageScreen: React.FC<ReportDamageScreenProps> = ({ navigation }) => {
  const [selectedProduct, setSelectedProduct] = useState<string>('Product Name - 2 Litre');
  const [selectedReason, setSelectedReason] = useState<string>('Milk - Spoiled');
  const [selectedReturn, setSelectedReturn] = useState<string>('Return');
  const [feedback, setFeedback] = useState<string>('');
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]); 
  const [modalVisible, setModalVisible] = useState(false);

  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState<boolean>(false);
  const [isReasonDropdownOpen, setIsReasonDropdownOpen] = useState<boolean>(false);
  const [isReturnDropdownOpen, setIsReturnDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    loadOrderData();
  }, []);

  const loadOrderData = () => {
    setOrderInfo(orderData);
  };

  const toggleProductDropdown = () => {
    setIsProductDropdownOpen(!isProductDropdownOpen);
    setIsReasonDropdownOpen(false);
    setIsReturnDropdownOpen(false);
  };

  const toggleReasonDropdown = () => {
    setIsReasonDropdownOpen(!isReasonDropdownOpen);
    setIsProductDropdownOpen(false);
    setIsReturnDropdownOpen(false);
  };

  const toggleReturnDropdown = () => {
    setIsReturnDropdownOpen(!isReturnDropdownOpen);
    setIsProductDropdownOpen(false);
    setIsReasonDropdownOpen(false);
  };

  const selectProduct = (product: string) => {
    setSelectedProduct(product);
    setIsProductDropdownOpen(false);
  };

  const selectReason = (reason: string) => {
    setSelectedReason(reason);
    setIsReasonDropdownOpen(false);
  };

  const selectReturnOption = (option: string) => {
    setSelectedReturn(option);
    setIsReturnDropdownOpen(false);
  };

  const handleGoBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  const handlePhotoSelected = (photoUri: string) => {
    setUploadedPhotos(prev => [...prev, photoUri]);
    console.log('Photo selected:', photoUri);
  };

 const handleSubmit = () => {
  if (!selectedProduct || !selectedReason || !selectedReturn) {
    ToastAndroid.show('Error, Please fill in all required fields',ToastAndroid.SHORT);
    return;
  }

  const reportData = {
    orderId: orderInfo.orderId,
    product: selectedProduct,
    reason: selectedReason,
    returnOption: selectedReturn,
    feedback: feedback,
    photos: uploadedPhotos, 
    timestamp: new Date().toISOString(),
  };

  console.log('Report Data:', reportData);
  setModalVisible(true);

   };

  if (!orderInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <Header />

        {/* Help Text */}
        <View style={styles.helpContainer}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoText}>i</Text>
          </View>
          <Text style={styles.helpText}>
            Help us make it right; Report issues with notes & photos.
          </Text>
        </View>

        {/* Order Info Card */}
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderText}>Order {orderInfo.orderId}</Text>
            {orderInfo.subscription && (
              <View style={styles.subscriptionBadge}>
                <Text style={styles.subscriptionText}>Subscription</Text>
              </View>
            )}
            <Text style={styles.dateText}>{orderInfo.date}</Text>
          </View>

          <View style={styles.productContainer}>
            <View style={styles.productImageContainer}>
              {orderInfo.product.image ? (
                <Image source={{ uri: orderInfo.product.image }} style={styles.productImage} />
              ) : (
                <View style={styles.placeholderImage} />
              )}
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{orderInfo.product.name}</Text>
              <Text style={styles.deliveryText}>
                Delivered today at {orderInfo.product.deliveryTime}
              </Text>
              <Text style={styles.quantityText}>
                Quantity: {orderInfo.product.quantity}
              </Text>
            </View>
          </View>
        </View>

        {/* Select Product */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Select Product</Text>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity style={styles.dropdownButton} onPress={toggleProductDropdown}>
              <Text style={styles.dropdownButtonText}>{selectedProduct}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
            {isProductDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {orderInfo.availableProducts.map((product: any) => (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.dropdownItem}
                    onPress={() => selectProduct(product.name)}
                  >
                    <Text style={styles.dropdownItemText}>{product.name}</Text>
                    {selectedProduct === product.name && <Text style={styles.checkmark}>⦿</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Select Reason */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Select Reason</Text>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity style={styles.dropdownButton} onPress={toggleReasonDropdown}>
              <Text style={styles.dropdownButtonText}>{selectedReason}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
            {isReasonDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {orderInfo.damageReasons.map((reason: any) => (
                  <TouchableOpacity
                    key={reason.id}
                    style={styles.dropdownItem}
                    onPress={() => selectReason(reason.reason)}
                  >
                    <Text style={styles.dropdownItemText}>{reason.reason}</Text>
                    {selectedReason === reason.reason && <Text style={styles.checkmark}>⦿</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Return/Replacement */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Return / Replacement</Text>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity style={styles.dropdownButton} onPress={toggleReturnDropdown}>
              <Text style={styles.dropdownButtonText}>{selectedReturn}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
            {isReturnDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {orderInfo.returnOptions.map((option: any) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.dropdownItem}
                    onPress={() => selectReturnOption(option.option)}
                  >
                    <Text style={styles.dropdownItemText}>{option.option}</Text>
                    {selectedReturn === option.option && <Text style={styles.checkmark}>⦿</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Feedback */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>Submit Feedback</Text>
          <TextInput
            style={styles.feedbackInput}
            placeholder="Share your thoughts or suggestions here..."
            placeholderTextColor="#808080"    
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
            textAlignVertical="top"
          />
        </View>

        {/* Photo Upload Section */}
          <PhotoUploadComponent
            onPhotoSelected={handlePhotoSelected}
            buttonStyle={styles.uploadButton}
            buttonTextStyle={styles.uploadButtonText}
            maxPhotos={5}
          />
        

        {/* Policy Info */}
        <View style={styles.policyContainer}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoText}>i</Text>
          </View>
          <Text style={styles.policyText}>
            Learn more about our{' '}
            <Text style={styles.policyLink}>Replacement & Return Policy</Text>
          </Text>
        </View>

        {/* Submit Button */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </TouchableOpacity>
        </View>    
      </ScrollView>
    <SuccessPopup  visible={modalVisible} onOk={() => {setModalVisible(false); navigation.goBack();   }} 
                                          onCancel={() => {setModalVisible(false); }}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGreyScreen,
  },
  scrollView: {
    flex: 1,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
    backgroundColor: Colors.white,
    marginTop: hp(1),
    marginHorizontal: wp(4),
    borderRadius: wp(2),
  },
  infoIcon: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    backgroundColor: Colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: sp(12),
    fontWeight: '600',
  },
  helpText: {
    fontSize: sp(11),
    color: Colors.black,
    flex: 1,
  },
  orderCard: {
    backgroundColor: Colors.white,
    marginHorizontal: wp(4),
    marginTop: hp(2),
    borderRadius: wp(3),
    padding: wp(4),
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  orderText: {
    fontSize: sp(16),
    fontWeight: '600',
    color: '#111827',
  },
  subscriptionBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.3),
    borderRadius: wp(3),
    marginLeft: wp(3),
  },
  subscriptionText: {
    color: Colors.white,
    fontSize: sp(12),
    fontWeight: '600',
  },
  dateText: {
    fontSize: sp(14),
    color: Colors.black,
    marginLeft: 'auto',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  productImageContainer: {
    marginRight: wp(4),
  },
  productImage: {
    width: wp(21),
    height: wp(21),
    borderRadius: wp(2),
  },
  placeholderImage: {
    width: wp(21),
    height: wp(21),
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(2),
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: sp(16),
    fontWeight: '600',
    color: Colors.black,
    marginBottom: hp(0.5),
  },
  deliveryText: {
    fontSize: sp(14),
    color: Colors.black,
    marginBottom: hp(0.5),
  },
  quantityText: {
    fontSize: sp(14),
    color: Colors.black,
  },
  formSection: {
    marginHorizontal: wp(4),
    marginTop: hp(3),
    position: 'relative',
    borderColor: Colors.borderColor,
    borderWidth: 1,
    borderRadius: wp(2),
  },
  sectionLabel: {
    position: 'absolute',
    top: -hp(1),
    left: wp(3),
    backgroundColor: Colors.white,
    paddingHorizontal: wp(1),
    fontSize: sp(14),
    color: '#1976D2',
    fontWeight: '500',
    zIndex: 1,
  },
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: Colors.borderColor,
    padding: wp(3),
    height: hp(6),
  },
  dropdownButtonText: {
    fontSize: sp(16),
    color: '#111827',
  },
  dropdownArrow: {
    fontSize: sp(12),
    color: Colors.secondary,
  },
  dropdownMenu: {
    position: 'absolute',
    top: hp(6.5),
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: Colors.borderColor,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(3),
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyBackground,
  },
  dropdownItemText: {
    fontSize: sp(16),
    color: Colors.black,
  },
  checkmark: {
    fontSize: sp(16),
    color: Colors.primary,
    fontWeight: 'bold',
  },
  feedbackInput: {
    backgroundColor: Colors.white,
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: Colors.borderColor,
    padding: wp(3),
    minHeight: hp(8),
    fontSize: sp(14),
    color: Colors.black,
  },
  policyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(6),
    paddingVertical: hp(2),
    marginTop: -hp(2),
  },
  policyText: {
    fontSize: sp(12),
    color: Colors.black,
    flex: 1,
  },
  policyLink: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
    gap: wp(3),
  },
  uploadButton: {
    flex: 1,
    backgroundColor: Colors.grey,
    paddingVertical: hp(2),
    borderRadius: wp(2),
    alignItems: 'center',
    marginHorizontal: wp(4),
    marginTop: hp(1),
    position: 'relative',
  },
  uploadButtonText: {
    color: Colors.white,
    fontSize: sp(16),
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
        backgroundColor: Colors.primary,
    paddingVertical: hp(2),
    borderRadius: wp(2),
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: sp(16),
    fontWeight: '600',
  },
});


export default ReportDamageScreen;