import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import ButtonComponent from './ButtonComponent';
import {FontFamily} from '../../../utils/constant';
import { imagePaths } from '../../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../../utils/constants/responsiveScreen';
import Colors from '../../../utils/constants/colors';

interface AlertModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  onConfirm: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
  open,
  setOpen,
  title,
  description,
  confirmText = 'Save',
  onConfirm,
}) => {
  return (
    <Modal
      visible={open}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setOpen(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setOpen(false)}>
              {/* <Image style={styles.icons} source={imagePaths.CLOSE_ICON} /> */}
            </TouchableOpacity>
          </View>
          {description && <Text style={styles.description}>{description}</Text>}
          <View style={styles.buttonContainer}>
            <ButtonComponent
              backgroundColor={Colors.danger}
              title="Cancel"
              onPress={() => setOpen(false)}
            />
            <ButtonComponent
              backgroundColor={Colors.primary}
              title={confirmText}
              onPress={onConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: wp(2.6),        
    padding: wp(4),               
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: hp(0.6),       
  },
  title: {
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
  },
  description: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    color: Colors.grey,
  },
  buttonContainer: {
    paddingTop: hp(6.2),          
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: wp(4),             
  },
  icons: {
    width: wp(7.5),               
    height: wp(7.5),
  },
});

export default AlertModal;
