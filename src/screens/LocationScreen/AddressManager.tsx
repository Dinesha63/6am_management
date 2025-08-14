import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { FontFamily } from '../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';  

interface SavedAddress {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  images: (string | null)[];
  timestamp: Date;
}

interface AddressManagerProps {
  addresses: SavedAddress[];
  onAddressSelect?: (address: SavedAddress) => void;
  onAddressDelete?: (addressId: string) => void;
}

const AddressManager: React.FC<AddressManagerProps> = ({
  addresses,
  onAddressSelect,
  onAddressDelete,
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderAddressItem = ({ item }: { item: SavedAddress }) => (
    <TouchableOpacity
      style={styles.addressItem}
      onPress={() => onAddressSelect?.(item)}
    >
      <View style={styles.addressContent}>
        <View style={styles.addressInfo}>
          <Text style={styles.addressText} numberOfLines={2}>
            {item.address}
          </Text>
          <Text style={styles.timestampText}>
            Saved on {formatDate(item.timestamp)}
          </Text>
          <Text style={styles.coordinatesText}>
            {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
          </Text>
        </View>
        
        <View style={styles.imagesContainer}>
          {item.images.map((imageUri, index) => (
            <View key={index} style={styles.imagePreview}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.thumbnailImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
      
      {onAddressDelete && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onAddressDelete(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Saved Addresses ({addresses.length})</Text>
      {addresses.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No addresses saved yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Save locations to access them later
          </Text>
        </View>
      ) : (
        <FlatList
          data={addresses}
          renderItem={renderAddressItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
    backgroundColor: Colors.white,
  },
  headerText: {
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    marginBottom: hp(2),
    color: Colors.black,
  },
  list: {
    flex: 1,
  },
  addressItem: {
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(1.5),
    borderLeftWidth: wp(1),
    borderLeftColor: Colors.primary,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.22,
    shadowRadius: wp(2),
  },
  addressContent: {
    flexDirection: 'row',
    flex: 1,
  },
  addressInfo: {
    flex: 1,
    marginRight: wp(3),
  },
  addressText: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
    marginBottom: hp(1),
    lineHeight: sp(22),
  },
  timestampText: {
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
    color: Colors.lightGrey,
    marginBottom: hp(0.5),
  },
  coordinatesText: {
    fontSize: sp(11),
    fontFamily: FontFamily.REGULAR,
    color: Colors.lightGrey,
  },
  imagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagePreview: {
    width: wp(13),
    height: wp(13),
    marginLeft: wp(2),
    borderRadius: wp(2),
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.greyBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: sp(8),
    color: Colors.lightGrey,
    textAlign: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: hp(1),
    right: wp(2),
    backgroundColor: Colors.greyBackground,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: wp(1),
  },
  deleteButtonText: {
    color: Colors.primary,
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(5),
  },
  emptyStateText: {
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
    color: Colors.lightGrey,
    marginBottom: hp(1),
  },
  emptyStateSubtext: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.lightGrey,
    textAlign: 'center',
  },
});
export default AddressManager;