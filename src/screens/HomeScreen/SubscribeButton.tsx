import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import {FontFamily} from '../../utils/constant';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {imagePaths} from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

interface SubscribeButtonProps {
  onPress?: () => void;
  selected: string;
}
type ProductCardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SingleProduct'
>;

const SubscribeButton: React.FC<SubscribeButtonProps> = ({
  onPress,
  selected,
}) => {
  const navigation = useNavigation<ProductCardNavigationProp>();

  const isGuestUser = true;

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() =>
        navigation.navigate('List', {
          category: selected,
          showSubscribeButton: true,
          headerTitle: 'Subscribe For Morning Delivery',
        })
      }>
      {isGuestUser ? (
        <Text style={styles.text}>Subscribe for Daily Delivery</Text>
      ) : (
        <>
          <Text style={styles.text}>Are you ordering for someone else?</Text>
          <Image source={imagePaths.delivery_icon} style={styles.icon} />
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(0.75),
    paddingHorizontal: wp(3.5),
    borderRadius: wp(2),
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    alignSelf: 'center',
    marginTop: hp(0.6),
    marginBottom: hp(0.1),
  },
  text: {
    fontWeight: '600',
    fontSize: sp(14),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
    marginRight: wp(1.5),
  },
  icon: {
    width: wp(3.7),
    height: wp(3.7),
    tintColor: Colors.black,
    resizeMode: 'contain',
  },
});
export default SubscribeButton;
