import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

interface SuccessPopupProps {
  visible: boolean;
  onOk: () => void;
    onCancel: () => void;
}
 
const SuccessPopup: React.FC<SuccessPopupProps> = ({ visible, onCancel }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>Success</Text>
          <Text style={styles.message}>
            Your report has been submitted successfully!
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel} 
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.okButton} onPress={() => navigation.navigate('ReportSubmitScreen')}
>
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default SuccessPopup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.black,
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: Colors.white,
    borderRadius: wp(2.5),
    width: '80%',
    padding: wp(5),
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: sp(18),
    marginBottom: hp(1),
  },
  message: {
    fontSize: sp(15),
    textAlign: 'center',
    marginBottom: hp(2),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(16),
  },
  cancelButton: {
    backgroundColor: Colors.grey,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(5),
    borderRadius: wp(1.5),
  },
  okButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(6),
    borderRadius: wp(1.5),
  },
  cancelText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  okText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});

