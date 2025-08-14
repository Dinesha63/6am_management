import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { FontFamily } from '../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';  

const { width } = Dimensions.get('window');

interface ConfirmDeleteModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  message = 'Are you sure you want to delete this image?',
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onConfirm} style={styles.confirmBtn}>
                  <Text style={{ color: Colors.white }}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
              <Text style={{ color: Colors.black }}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
  },
  modalContent: {
    width: wp(80),
    backgroundColor: Colors.white,
    padding: wp(4),
    borderRadius: wp(2),
    alignItems: 'center',
  },
  message: {
    marginBottom: hp(2),
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
  },
  confirmBtn: {
    backgroundColor: Colors.danger,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(6.5),
    borderRadius: wp(1.5),
    marginRight: wp(2.5),
  },
  cancelBtn: {
    backgroundColor: Colors.greyBackground,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(6.5),
    borderRadius: wp(1.5),
  },
});

export default ConfirmDeleteModal;
