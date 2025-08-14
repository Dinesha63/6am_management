import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import {
  CameraOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';  

const { width } = Dimensions.get('window');

interface PhotoUploadComponentProps {
  onPhotoSelected?: (photoUri: string) => void;
  buttonStyle?: any;
  buttonTextStyle?: any;
  maxPhotos?: number;
}

const PhotoUploadComponent: React.FC<PhotoUploadComponentProps> = ({
  onPhotoSelected,
  buttonStyle,
  buttonTextStyle,
  maxPhotos = 3,
}) => {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const handleUploadPhoto = () => {
    if (selectedPhotos.length >= maxPhotos) {
      ToastAndroid.show(`Limit Reached, You can only upload up to ${maxPhotos} photos.`,ToastAndroid.SHORT);
      return;
    }
    setIsBottomSheetVisible(true);
  };

  const handleCamera = () => {
    const options: CameraOptions = {
      quality: 0.8,
      mediaType: 'photo',
      cameraType: 'back',
      saveToPhotos: true,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      setIsBottomSheetVisible(false);
      
      if (response.didCancel) {
        console.log('User cancelled camera picker');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
        ToastAndroid.show('Error, Failed to take photo. Please try again.',ToastAndroid.SHORT);
      } else if (response.assets && response.assets.length > 0) {
        const photoUri = response.assets[0]?.uri;
        if (photoUri) {
          setSelectedPhotos(prev => [...prev, photoUri]);
          onPhotoSelected?.(photoUri);
        }
      }
    });
  };

  const handleGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      },
      (response: ImagePickerResponse) => {
        setIsBottomSheetVisible(false);
        
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('Image Picker Error: ', response.errorMessage);
          ToastAndroid.show('Error, Failed to select image. Please try again.',ToastAndroid.SHORT);
        } else if (response.assets && response.assets.length > 0) {
          const photoUri = response.assets[0]?.uri;
          if (photoUri) {
            setSelectedPhotos(prev => [...prev, photoUri]);
            onPhotoSelected?.(photoUri);
          }
        }
      }
    );
  };

  const handleRemovePhoto = (index: number) => {
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
          },
        },
      ]
    );
  };

  const handlePreviewPhoto = (photoUri: string) => {
    setPreviewImage(photoUri);
    setIsPreviewVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Upload Button */}
      <TouchableOpacity
        style={[styles.uploadButton, buttonStyle]}
        onPress={handleUploadPhoto}
      >
        <Text style={[styles.uploadButtonText, buttonTextStyle]}>
          Upload Photo ({selectedPhotos.length}/{maxPhotos})
        </Text>
      </TouchableOpacity>

      {/* Selected Photos Display */}
      {selectedPhotos.length > 0 && (
        <View style={styles.photosContainer}>
          <Text style={styles.photosLabel}>Selected Photos:</Text>
          <View style={styles.photosGrid}>
            {selectedPhotos.map((photoUri, index) => (
              <View key={index} style={styles.photoItem}>
                <TouchableOpacity
                  onPress={() => handlePreviewPhoto(photoUri)}
                  style={styles.photoTouchable}
                >
                  <Image source={{ uri: photoUri }} style={styles.photoThumbnail} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleRemovePhoto(index)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Bottom Sheet for Camera/Gallery Selection */}
      <Modal
        visible={isBottomSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsBottomSheetVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setIsBottomSheetVisible(false)}
          />
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Select Photo</Text>
              <TouchableOpacity
                onPress={() => setIsBottomSheetVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={handleCamera}
              >
                <View style={styles.optionIcon}>
                  <Text style={styles.optionIconText}>📷</Text>
                </View>
                <Text style={styles.optionText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.optionButton}
                onPress={handleGallery}
              >
                <View style={styles.optionIcon}>
                  <Text style={styles.optionIconText}>🖼️</Text>
                </View>
                <Text style={styles.optionText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        visible={isPreviewVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsPreviewVisible(false)}
      >
        <View style={styles.previewModalBackground}>
          <View style={styles.previewModalContent}>
            <Image
              source={{ uri: previewImage || '' }}
              style={styles.previewImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={() => setIsPreviewVisible(false)}
              style={styles.previewCloseButton}
            >
              <Text style={styles.previewCloseButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(1),
  },
  uploadButton: {
    backgroundColor: Colors.grey,
    paddingVertical: hp(2),
    borderRadius: wp(2),
    alignItems: 'center',
    marginBottom: hp(2),
  },
  uploadButtonText: {
    color: Colors.white,
    fontSize: sp(16),
    fontWeight: '600',
  },
  photosContainer: {
    marginTop: hp(1),
    paddingHorizontal: wp(4),
  },
  photosLabel: {
    fontSize: sp(14),
    fontWeight: '600',
    color: Colors.black,
    marginBottom: hp(1),
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
  },
  photoItem: {
    position: 'relative',
    marginBottom: hp(1),
  },
  photoTouchable: {
    width: wp(21),
    height: wp(21),
    borderRadius: wp(2),
    overflow: 'hidden',
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: -hp(0.5),
    right: -hp(0.5),
    backgroundColor: Colors.danger,
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: Colors.white,
    fontSize: sp(14),
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  bottomSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    paddingBottom: hp(4),
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyBackground,
  },
  bottomSheetTitle: {
    fontSize: sp(18),
    fontWeight: '600',
    color: Colors.black,
  },
  closeButton: {
    width: wp(8),
    height: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: sp(24),
    color: Colors.black,
  },
  optionsContainer: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2.5),
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    marginBottom: hp(1.5),
    backgroundColor: Colors.backgroundGreyScreen,
    borderRadius: wp(3),
  },
  optionIcon: {
    width: wp(10),
    height: wp(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4),
  },
  optionIconText: {
    fontSize: sp(20),
  },
  optionText: {
    fontSize: sp(16),
    fontWeight: '500',
      color: Colors.black,
  },
  previewModalBackground: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewModalContent: {
    position: 'relative',
    width: width * 0.95,
    maxHeight: '80%',
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    padding: wp(2.5),
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: hp(50),
    borderRadius: wp(2),
  },
  previewCloseButton: {
    position: 'absolute',
    top: hp(1.2),
    right: hp(1.2),
    backgroundColor: Colors.black,
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewCloseButtonText: {
    color: Colors.white,
    fontSize: sp(18),
    fontWeight: 'bold',
  },
});

export default PhotoUploadComponent;