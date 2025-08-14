import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {FontFamily} from '../../utils/constant';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import { useDispatch } from 'react-redux';
import { logAddressEvent } from '../../utils/eventLogger';
import { AppDispatch } from '../../redux/store';

interface AddressButtonProps {
  amount: number;
  onPress: () => void;
  addressSelected: boolean;
  AddCreditsToWallet?: boolean;
    onOpenAddressSheet?: () => void;

}

const AddressButton: React.FC<AddressButtonProps> = ({
  amount,
  onPress,
  addressSelected,
  AddCreditsToWallet,
  onOpenAddressSheet,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();

  const handleButtonPress = async () => {
    try {
      if (AddCreditsToWallet || addressSelected) {
        // Log the action when proceeding to payment/subscription
        onPress(); // Continue to payment or Confirm Subscription
      } else {
        // Log when user needs to add address
        onOpenAddressSheet?.(); // Show bottom sheet if no address
      }
    } catch (error) {
      console.log('Event logging failed:', error);
      // Don't block the main flow if logging fails
    }
  };

  const getButtonText = () => {
    if (AddCreditsToWallet) return 'Continue to Payment';
    if (!addressSelected) return 'Add Address to Proceed';
    return 'Confirm Subscription';
  };
  return (
    // <View style={styles.container}>
    //   {addressSelected ? (
    //     <TouchableOpacity onPress={onPress}>
    //       <LinearGradient
    //         colors={['#7CC456', '#5BA146']}
    //         start={{x: 0, y: 0}}
    //         end={{x: 1, y: 0}}
    //         style={styles.button}>
    //         <Text style={styles.buttonText}>Confirm Subscription</Text>
    //       </LinearGradient>
    //     </TouchableOpacity>
    //   ) : (
    //     <TouchableOpacity
    //       onPress={() => navigation.navigate('LocationAddressScreen', {
    //       addressData: undefined,
    //       formData: { goToPaymentOnBack: true }
    //     })}>
    //       <LinearGradient
    //         colors={['#7CC456', '#5BA146']}
    //         start={{x: 0, y: 0}}
    //         end={{x: 1, y: 0}}
    //         style={styles.button}>
    //         <Text style={styles.buttonText}>Add Address To Proceed</Text>
    //       </LinearGradient>
    //     </TouchableOpacity>
    //   )
    //   }
    // </View>
     <View style={styles.container}>
      <TouchableOpacity onPress={handleButtonPress}>
        <LinearGradient
          colors={['#7CC456', '#5BA146']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{getButtonText()}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: wp(4),
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  amountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '100%',
    padding: hp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  label: {
    color: '#4F4F4F',
    fontSize: sp(14),
    fontWeight: '500',
  },
  amount: {
    color: '#1DBF73',
    fontSize: sp(16),
    fontWeight: '700',
  },
  supportText: {
    fontSize: sp(12),
    color: '#4F4F4F',
    marginBottom: hp(2),
  },
  supportLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#1DBF73',
    paddingVertical: hp(1.8),
    paddingHorizontal: wp(22),
    borderRadius: wp(2),
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: sp(16),
    fontWeight: '600',
  },
});

export default AddressButton;
