import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';  

interface InternetLostScreenProps {
  visible: boolean;
  onCancel?: () => void;
  onTryAgain?: () => void;
}

const InternetLostScreen: React.FC<InternetLostScreenProps> = ({ 
  visible, 
  onCancel, 
  onTryAgain 
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Replace the problematic Image with a simple icon or remove it */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📶</Text>
          </View>
          <Text style={styles.text}>No Internet Connection</Text>
          <Text style={styles.subText}>Please check your connection and try again.</Text>
          
          {/* Button Container */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.tryAgainButton]} 
              onPress={onTryAgain}
            >
              <Text style={styles.tryAgainButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
    padding: wp(5),
  },
  content: {
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    padding: wp(8),
    alignItems: 'center',
    minWidth: wp(75),
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: hp(0.3),
    },
    shadowOpacity: 0.25,
    shadowRadius: wp(1),
    elevation: 5,
  },
  iconContainer: {
    marginBottom: hp(2.5),
  },
  icon: {
    fontSize: sp(48),
    opacity: 0.5,
  },
  text: {
    fontSize: sp(20),
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: hp(1),
    textAlign: 'center',
  },
  subText: {
    fontSize: sp(14),
    color: Colors.lightGrey,
    textAlign: 'center',
    lineHeight: sp(20),
    marginBottom: hp(3),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: wp(4),
  },
  button: {
    flex: 1,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.greyBackground,
    borderWidth: 1,
    borderColor: Colors.greyBackground,
  },
  tryAgainButton: {
    backgroundColor: Colors.primary,
  },
  cancelButtonText: {
    fontSize: sp(16),
    fontWeight: '600',
    color: Colors.lightGrey,
  },
  tryAgainButtonText: {
    fontSize: sp(16),
    fontWeight: '600',
    color: Colors.white,
  },
});



export default InternetLostScreen;