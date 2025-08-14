import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import SimpleIcon from './SimpleIcon';
import { FontFamily} from '../utils/constant';
import Colors from '../utils/constants/colors';
import { imagePaths } from '../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../utils/constants/responsiveScreen';

interface ImageSelectionBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onCameraPress: () => void;
  onGalleryPress: () => void;
}

const ImageSelectionBottomSheet: React.FC<ImageSelectionBottomSheetProps> = ({
  isVisible,
  onClose,
  onCameraPress,
  onGalleryPress,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      style={styles.modal}>
      <View style={styles.container}>
        <View style={styles.dragIndicator} />

        <Text style={styles.title}>Upload Photo</Text>

        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            onClose();
            onCameraPress();
          }}>
          <View
             style={styles.iconContainer}>
            <SimpleIcon source={imagePaths.camera_icon} style={styles.icon} />
          </View>

          <Text style={styles.optionText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => {
            onClose();
            onGalleryPress();
          }}>
          <View
          style={styles.iconContainer}>
            <SimpleIcon
              source={imagePaths.photo_library_icon}
              style={styles.icon}
            />
          </View>

          <Text style={styles.optionText}>Choose from Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, styles.cancelButton]}
          onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    padding: wp(5.3),
    borderTopLeftRadius: wp(5.3),
    borderTopRightRadius: wp(5.3),
  },
  dragIndicator: {
    alignSelf: 'center',
    width: wp(10.6),
    height: hp(0.6),
    backgroundColor: '#DEDEDE',
    borderRadius: wp(2.6),
    marginBottom: hp(2),
  },
  title: {
    fontSize: sp(18),
    fontWeight: '600',
    fontFamily: FontFamily.REGULAR,
    marginBottom: hp(2),
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.9),
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  optionText: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    color: '#333',
  },
  cancelButton: {
    marginTop: hp(1.2),
    borderBottomWidth: 0,
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    color: '#FF3B30',
    textAlign: 'center',
  },
  iconContainer: {
    width: wp(10.6),
    height: wp(10.6),
    borderRadius: wp(5.3),
    backgroundColor: Colors.greyBackground,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: wp(2.6),
  },
  icon: {
    width: wp(5.8),
    height: wp(5.8),
  },
});

export default ImageSelectionBottomSheet;
