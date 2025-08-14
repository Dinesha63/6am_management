import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import SimpleIcon from './SimpleIcon';
import Colors from '../utils/constants/colors';
import { FontFamily } from '../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../utils/constants/responsiveScreen';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ visible, onClose, message }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {/* Success Icon Circle */}
              <View style={styles.iconCircle}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
              
              <Text style={styles.title}>Success</Text>
              <Text style={styles.message}>{message}</Text>
              
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: wp(85),
    borderRadius: wp(4.2),
    padding: wp(6.4),
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(0.26) },
    shadowOpacity: 0.25,
    shadowRadius: wp(1),
  },
  iconCircle: {
    width: wp(21.3),
    height: wp(21.3),
    borderRadius: wp(10.7),
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(2),
  },
  checkmark: {
    color: '#fff',
    fontSize: sp(40),
    fontWeight: 'bold',
    fontFamily: FontFamily.REGULAR,
  },
  title: {
    fontSize: sp(22),
    fontWeight: 'bold',
    fontFamily: FontFamily.REGULAR,
    marginBottom: hp(1.5),
    color: '#333',
  },
  message: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    color: '#666',
    textAlign: 'center',
    marginBottom: hp(3),
  },
  button: {
    backgroundColor: Colors.success,
    paddingVertical: hp(1.6),
    paddingHorizontal: wp(10.6),
    borderRadius: wp(2.1),
    marginTop: hp(1),
  },
  buttonText: {
    color: '#fff',
    fontSize: sp(16),
    fontWeight: '600',
    fontFamily: FontFamily.REGULAR,
  },
});


export default SuccessModal;
