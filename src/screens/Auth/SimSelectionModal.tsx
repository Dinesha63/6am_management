import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
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

interface SimSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (number: string | null) => void;
  firstNumber: string | null;
  secondNumber: string | null;
}

const SimSelectionModal: React.FC<SimSelectionModalProps> = ({
  visible,
  onClose,
  onSelect,
  firstNumber,
  secondNumber,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Continue with</Text>

            {firstNumber && (
              <TouchableOpacity
                style={styles.option}
                onPress={() => onSelect(firstNumber)}>
                <View style={styles.iconCircle}>
                  <Image
                    source={imagePaths.Call_icon}
                    style={styles.icon}
                    resizeMode="contain"
                  />
                </View>

                <Text style={styles.numberText}>{firstNumber}</Text>
              </TouchableOpacity>
            )}
            {secondNumber && (
              <TouchableOpacity
                style={styles.option}
                onPress={() => onSelect(secondNumber)}>
                <View style={styles.iconCircle}>
                  <Image
                    source={imagePaths.Call_icon}
                    style={styles.icon}
                    resizeMode="contain"
                  />
                </View>

                <Text style={styles.numberText}>{secondNumber}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => onSelect(null)}
              style={styles.noneOption}>
              <Text style={styles.noneText}>NONE OF THE ABOVE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SimSelectionModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    width: wp(85),
    borderRadius: wp(2.2),
    padding: wp(5.5),
    elevation: 10,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: hp(0.3) },
    shadowOpacity: 0.25,
    shadowRadius: wp(1),
  },
  title: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
    marginBottom: hp(1.2),
    color: Colors.black,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.6),
    borderBottomWidth: 0.5,
    borderColor: Colors.greyBackground,
  },
  icon: {
    width: wp(5.5),
    height: wp(5.5),
    tintColor: Colors.black,
  },
  numberText: {
    fontSize: sp(15),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
    marginLeft: wp(1.3),
  },
  noneOption: {
    marginTop: hp(1.2),
    alignSelf: 'flex-start',
  },
  noneText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
  },
  iconCircle: {
    width: wp(10.5),
    height: wp(10.5),
    borderRadius: wp(5.25),
    backgroundColor: Colors.greyBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
