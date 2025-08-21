import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rs,
} from '../../../utils/constants/responsiveScreen';

type Props = {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
};

const ConfirmationModal = ({
  visible,
  message,
  onConfirm,
  onCancel,
  isProcessing,
}: Props) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* <Text style={styles.title}>Confirm Action</Text> */}
          <Text style={styles.message}>{message}</Text>
          {/* <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View> */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.cancelButton, isProcessing && {opacity: 0.5}]}
              disabled={isProcessing}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              style={[styles.confirmButton, isProcessing && {opacity: 0.5}]}
              disabled={isProcessing}
            >
              <Text style={styles.confirmText}>
                {isProcessing ? 'Processing...' : 'Confirm'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: wp(85),
    backgroundColor: '#ffffff',
    borderRadius: rs(16),
    paddingVertical: rs(24),
    paddingHorizontal: rs(20),
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: rs(8),
    shadowOffset: {width: 0, height: rs(3)},
  },
  title: {
    fontSize: sp(18),
    fontWeight: '700',
    color: '#333',
    marginBottom: rs(10),
  },
  message: {
    fontSize: sp(15),
    color: '#666',
    textAlign: 'center',
    marginBottom: rs(24),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: rs(12),
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: rs(10),
    paddingHorizontal: rs(20),
    borderRadius: rs(10),
  },
  cancelText: {
    color: '#444',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#007B55',
    paddingVertical: rs(10),
    paddingHorizontal: rs(20),
    borderRadius: rs(10),
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
  },
});
