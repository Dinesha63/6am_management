import React from 'react';
import {View, Text, TouchableOpacity, Linking} from 'react-native';
import SimpleIcon from '../../../../components/SimpleIcon';
import CheckBox from '@react-native-community/checkbox';
import Colors from '../../../../utils/constants/colors';

interface DeliveryCardProps {
  isCancelled: boolean;
  isExpanded: boolean;
  isEditing: boolean;
  delivery: any;
  formattedDate: string;
  selectedItems: string[];
  handleEditPress: () => void;
  handleCancelPress: () => void;
  handleItemPress: (item: string) => void;
  handleCancelDelivery: () => void;
  navigation: any;
  setIsCancelled: (v: boolean) => void;
  handleRestoreDelivery: () => void;
  styles: any;
  imagePaths: any;
  Routes: any;
  setIsEditing: (v: boolean) => void;
  setIsExpanded: (v: boolean) => void;
  partialCancel?: boolean;
}

const DeliveryCard: React.FC<DeliveryCardProps> = ({
  isCancelled,
  isExpanded,
  isEditing,
  delivery,
  formattedDate,
  selectedItems,
  handleEditPress,
  handleCancelPress,
  handleItemPress,
  handleCancelDelivery,
  navigation,
  setIsCancelled,
  handleRestoreDelivery,
  styles,
  imagePaths,
  Routes,
  setIsEditing,
  setIsExpanded,
  partialCancel,
}) => {
  console.log("selectedItems selectedItems :: ::",selectedItems)
  console.log("delivery delivery :: ::",delivery)
  return (
    <View style={styles.card}>
      {!isCancelled ? (
        <>
          {!isExpanded ? (
            <View style={styles.topRow}>
              <View style={styles.radioButton}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
              <View style={styles.detailsContainer}>
                {/* NextDeliveryInfo should be rendered here if needed */}
                {delivery && (
                  <>
                    <Text style={styles.dateDelivery}>
                      Next Delivery {formattedDate}
                    </Text>
                    <Text style={styles.timeDelivery}>
                      {delivery.deliverySlotDescription || 'Time not available'}
                    </Text>
                    <Text style={styles.itemsDelivery}>
                      {delivery.products
                        ?.map((p: any) => p.productSkuName)
                        .join(', ')}
                    </Text>
                  </>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.expandedSection}>
              <View style={styles.basketHeaderRow}>
                <Text style={styles.basketTitle}>Your Basket</Text>
                <Text style={styles.basketDate}>{formattedDate}</Text>
              </View>
              {delivery?.products.map((item: any, index: number) => (
                <TouchableOpacity
                  key={item.productSkuCode || index}
                  onPress={() => handleItemPress(item.productSkuCode)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 24,
                  }}>
                  <CheckBox
                    value={selectedItems.includes(item.productSkuCode)}
                    onValueChange={() => handleItemPress(item.productSkuCode)}
                    tintColors={{ true: Colors.primary, false: '#ccc' }}
                    style={{ marginRight: 12 }}
                  />
                  <Text style={styles.basketItem}>{item.productSkuName}</Text>
                </TouchableOpacity>
              ))}
             
            </View>
          )}
          <View style={styles.footer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                justifyContent: 'space-between',
              }}>
              {!isEditing && (
                <>
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => Linking.openURL('tel:8111 075 075')}>
                    <SimpleIcon
                      source={imagePaths.Phone_icon}
                      style={styles.contactIcon}
                    />
                    <Text style={styles.contactTxt}>Contact</Text>
                  </TouchableOpacity>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity
                      style={[styles.addProductsButton, {marginLeft: 10}]}
                      onPress={() => navigation.navigate(Routes.List as never)}>
                      <Text style={styles.addProductsTxt}>Add Products</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.cancelButton,
                        selectedItems.length === 0 && isEditing
                          ? {opacity: 0.5}
                          : null,
                        {marginLeft: 10},
                      ]}
                      onPress={isEditing ? handleCancelPress : handleEditPress}
                      disabled={isEditing && selectedItems.length === 0}>
                      <Text style={styles.cancelTxt}>
                        {isEditing ? 'Cancel Selected' : 'Cancel'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              {isExpanded && (
                <TouchableOpacity
                  style={[
                    styles.cancelButton,
                    {marginLeft: 10, marginRight: 10},
                  ]}
                  onPress={() => {
                    setIsEditing(false);
                    setIsExpanded(false);
                  }}>
                  <Text style={styles.cancelTxt}>Go Back</Text>
                </TouchableOpacity>
              )}
             { isExpanded && <TouchableOpacity
                style={[
                  styles.cancelButton,
                  selectedItems.length === 0 && isEditing
                    ? {opacity: 0.5}
                    : null,
                  {marginLeft: 10},
                ]}
                onPress={isEditing ? handleCancelPress : handleEditPress}
                disabled={isEditing && selectedItems.length === 0}>
                <Text style={styles.cancelTxt}>
                  {isEditing ? 'Cancel Selected' : 'Cancel'}
                </Text>
              </TouchableOpacity>}
            </View>
          </View>
        </>
      ) : (
        <View style={styles.cancelledCard}>
          {partialCancel ? (
            <>
              <Text style={styles.cancelledTitle}>
                The product{selectedItems.length > 1 ? 's' : ''} has been
                removed from your delivery.
              </Text>
              <Text style={styles.cancelledSubtitle}>
                The remaining items will be delivered on {formattedDate},
                between 5 AM and 7 AM.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.cancelledTitle}>
                Your delivery for {formattedDate} has been cancelled.
              </Text>
              <Text style={styles.cancelledSubtitle}>
                You can reschedule or add products anytime before 11.00 pm
              </Text>
            </>
          )}
          <View style={styles.cancelledButtonsRow}>
            <TouchableOpacity
              style={styles.addProductsButton}
              onPress={() => navigation.navigate(Routes.List as never)}>
              <Text style={styles.addProductsTxt}>Add Products</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.restoreDeliveryButton}
              onPress={handleRestoreDelivery}>
              <Text style={styles.restoreDeliveryTxt}>Restore Delivery</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default DeliveryCard;
