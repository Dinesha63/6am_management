import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { Colors } from '../../constants/colors';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rs,
} from '../../constants/ResponsiveScreen';


interface PhoneNumberBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  phoneNumbers: string[];
  onSelectNumber: (number: string) => void;
}

const PhoneNumberBottomSheet: React.FC<PhoneNumberBottomSheetProps> = ({
  visible,
  onClose,
  phoneNumbers,
  onSelectNumber,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.bottomSheet}>
          <View style={styles.header}>
            <View style={styles.googleContainer}>
              <Text style={styles.googleIcon}>6AM</Text>
            </View>
            <Text style={styles.title}>Choose a phone number</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.description}>
            Select a phone number to use with SixAm Delivery App. This number will be used for delivery notifications.
          </Text>
          
          <Text style={styles.subDescription}>
            Your phone number will only be used for delivery-related communications.
          </Text>
          
          {phoneNumbers.map((number, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.numberItem}
              onPress={() => onSelectNumber(number)}
            >
              <View style={styles.phoneIconContainer}>
                <Text style={styles.phoneIcon}>📱</Text>
              </View>
              <Text style={styles.phoneNumber}>{number}</Text>
            </TouchableOpacity>
          ))}
          
          <Text style={styles.footer}>
            You can update your delivery preferences in your <Text style={styles.link}>account settings</Text>.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: rs(16),
    borderTopRightRadius: rs(16),
    padding: rs(16),
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rs(16),
  },
  googleContainer: {
    width: rs(35),
    height: rs(35),
    borderRadius: rs(20),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rs(12),
  },
  googleIcon: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: sp(12),
  },
  title: {
    flex: 1,
    fontSize: sp(16),
    fontWeight: 'bold',
    color: '#202124',
  },
  closeButton: {
    padding: rs(4),
  },
  closeIcon: {
    fontSize: sp(18),
    color: '#5f6368',
  },
  description: {
    fontSize: sp(14),
    color: '#202124',
    marginBottom: rs(12),
    lineHeight: sp(20),
  },
  subDescription: {
    fontSize: sp(14),
    color: '#5f6368',
    marginBottom: rs(16),
    lineHeight: sp(20),
  },
  numberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: rs(12),
    borderRadius: rs(8),
    marginBottom: rs(8),
  },
  phoneIconContainer: {
    width: rs(36),
    height: rs(36),
    borderRadius: rs(18),
    backgroundColor: '#f1f3f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: rs(16),
  },
  phoneIcon: {
    fontSize: sp(16),
  },
  phoneNumber: {
    fontSize: sp(16),
    color: '#202124',
  },
  footer: {
    fontSize: sp(14),
    color: '#5f6368',
    marginTop: rs(16),
    lineHeight: sp(20),
  },
  link: {
    color: '#1a73e8',
  },
});
export default PhoneNumberBottomSheet;
