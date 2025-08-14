import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import LottieView from 'lottie-react-native';
import {FontFamily} from '../../utils/constant';
import Colors from '../../utils/constants/colors';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../utils/constants/responsiveScreen';

interface SuccessModalProps {
  isVisible: boolean;
  onClose: () => void;
  onDonePress: () => void;
  title?: string;
  subtitle?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isVisible,
  onClose,
  onDonePress,
  title = 'Address Saved!',
  subtitle = 'Your address has been saved successfully.',
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      style={styles.modal}>
      <View style={styles.container}>
        <View style={styles.dragIndicator} />

        <View style={styles.animationContainer}>
          <LottieView
            source={require('../../assets/Animation/Success-Animation.json')}
            autoPlay
            loop={false}
            speed={0.8}
            style={styles.animation}
            colorFilters={[
              {
                keypath: 'Shape Layer 1',
                color: Colors.primary,
              },
            ]}
          />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => {
            onClose();
            onDonePress();
          }}>
          <Text style={styles.doneButtonText}>Done!</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    padding: wp(5.3),
    borderTopLeftRadius: wp(5.3),
    borderTopRightRadius: wp(5.3),
    alignItems: 'center',
  },
  dragIndicator: {
    alignSelf: 'center',
    width: wp(10.6),
    height: hp(0.6),
    backgroundColor: '#DEDEDE',
    borderRadius: wp(2.6),
    marginBottom: hp(2),
  },
  animationContainer: {
    width: wp(44),
    height: wp(44),
    marginBottom: hp(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    fontSize: sp(18),
    fontWeight: '600',
    fontFamily: FontFamily.REGULAR,
    marginBottom: hp(1),
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    marginBottom: hp(3),
    textAlign: 'center',
    color: '#444',
  },
  doneButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(25),
    borderRadius: wp(2),
    marginBottom: hp(2),
    width: '100%',
    alignItems: 'center',
  },
  doneButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: sp(16),
    textAlign: 'center',
  },
});

export default SuccessModal;
