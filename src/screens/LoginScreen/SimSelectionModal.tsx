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
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rs,
} from '../../constants/ResponsiveScreen';


// Replace this with your actual image import
// import { imagePaths } from '../../constants/colors'; 
// Example: const callIcon = require('../../assets/call_icon.png');

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
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Continue with</Text>

              {firstNumber && (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => onSelect(firstNumber)}
                >
                  <View style={styles.iconCircle}>
                    <Image
                      source={require('../../assets/images/close.png')} // Replace with actual path
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
                  onPress={() => onSelect(secondNumber)}
                >
                  <View style={styles.iconCircle}>
                    <Image
                      source={require('../../assets/images/close.png')} // Replace with actual path
                      style={styles.icon}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.numberText}>{secondNumber}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => onSelect(null)}
                style={styles.noneOption}
              >
                <Text style={styles.noneText}>NONE OF THE ABOVE</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SimSelectionModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: wp(85),
    borderRadius: rs(12),
    padding: rs(20),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: rs(3) },
    shadowOpacity: 0.2,
    shadowRadius: rs(4),
  },
  title: {
    fontSize: sp(17),
    fontWeight: 'bold',
    marginBottom: rs(15),
    color: '#333',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: rs(12),
    borderBottomWidth: rs(0.6),
    borderColor: '#ddd',
  },
  iconCircle: {
    width: rs(40),
    height: rs(40),
    borderRadius: rs(20),
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: rs(10),
  },
  icon: {
    width: rs(20),
    height: rs(20),
    tintColor: '#555',
  },
  numberText: {
    fontSize: sp(15),
    color: '#333',
  },
  noneOption: {
    marginTop: rs(20),
  },
  noneText: {
    color: '#1976D2',
    fontWeight: 'bold',
    fontSize: sp(14),
  },
});
