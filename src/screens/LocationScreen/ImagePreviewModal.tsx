import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { FontFamily} from '../../utils/constant';
import { imagePaths } from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';  

const {width} = Dimensions.get('window');

interface ImagePreviewModalProps {
  visible: boolean;
  image: string | null;
  onClose: () => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  visible,
  image,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Image
            source={image ? {uri: image} : imagePaths.Placeholder_Image}
            style={styles.image}
            resizeMode="stretch"
          />
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    position: 'relative',
    width: wp(90),
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    padding: wp(2),
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: hp(40), 
    borderRadius: wp(2),
  },
  closeBtn: {
    backgroundColor: Colors.black,
    paddingVertical: hp(0.75),
    position: 'absolute',
    left: wp(79.2), 
    width: wp(12), 
    height: wp(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: wp(6.5),
    borderTopRightRadius: wp(2.7),
  },
  closeBtnText: {
    color: Colors.white,
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
  },
});
export default ImagePreviewModal;
