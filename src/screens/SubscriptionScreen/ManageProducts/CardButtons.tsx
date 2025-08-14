import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Colors from '../../../utils/constants/colors';
import {RootStackParamList} from '../../../types';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,    
  getResponsiveSpacing as rsp,
} from '../../../utils/constants/responsiveScreen';

interface ProductButtonsProps {
  isEnabled: boolean;
  onReSubscribe: () => void;
}

const ProductButtons: React.FC<ProductButtonsProps> = ({
  isEnabled,
  onReSubscribe,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        onPress={() => {
          if (!isEnabled) {
            navigation.navigate('MarkVacationScreen');
          }
        }}
        activeOpacity={0.7}
        style={
          isEnabled ? styles.button1BackGround2 : styles.button1Background
        }>
        <Text style={styles.buttonText}>
  {isEnabled ? 'Modify Before Subscribing' : 'Mark Vacation'}
</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={
          isEnabled
            ? () => onReSubscribe()
            : () => navigation.navigate('ModifyProduct')
        }
        activeOpacity={0.7}
        style={
          isEnabled ? styles.button2BackGround2 : styles.button2Background
        }>
  <Text style={styles.buttonText}>
              {isEnabled ? 'Re-Subscribe' : 'Modify Quantity'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: hp(1.2),
    paddingRight: wp(2.5),
  },
  button1Background: {
    backgroundColor: Colors.purpleBorder,
    padding: wp(1.5),
    marginRight: wp(1.2),
  },
  button2Background: {
    backgroundColor: Colors.lightSecondary,
    padding: wp(1.5),
  },
  button1BackGround2: {
    backgroundColor: Colors.lightSecondary,
    padding: wp(1.5),
    marginRight: wp(2.3),
  },
  button2BackGround2: {
    backgroundColor: Colors.greenColour,
    padding: wp(1.5),
  },
  buttonText: {
  color: Colors.white,
},

});


export default ProductButtons;
