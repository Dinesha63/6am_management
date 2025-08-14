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
import { FontFamily } from '../../../utils/constant';
import { imagePaths } from '../../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../../utils/constants/responsiveScreen';
import Colors from '../../../utils/constants/colors';

interface AlertModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const OrderListModel: React.FC<AlertModalProps> = ({open, setOpen}) => {
  return (
    <Modal
      visible={open}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setOpen(false)}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Order List</Text>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => setOpen(false)}>
              <Image style={styles.icons} source={imagePaths.CLOSE_ICON} />
            </TouchableOpacity>
          </View>
          <View style={styles.centerContainer}>
            <Text style={styles.centerText}>Currently no orders available</Text>
          </View>
          <View style={styles.buttonContainer}>
            <ButtonComponent
              backgroundColor={Colors.danger}
              title="Cancel"
              onPress={() => setOpen(false)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    height: hp(25),                 
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    fontSize: sp(18),
    fontFamily: FontFamily.REGULAR,
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: Colors.blackText,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: Colors.white,
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
  buttonContainer: {
    paddingTop: hp(2.5),            
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: wp(4),               
  },
  icons: {
    width: wp(7.5),                 
    height: wp(7.5),
  },
});

export default OrderListModel;
