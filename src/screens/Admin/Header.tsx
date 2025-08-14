import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {FontFamily} from '../../utils/constant';
import {imagePaths} from '../../utils/constants/imagePaths';
import HeaderText from '../../components/HeaderText';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import {Routes, TabRoutes} from '../../navigation/routes';

const Header: React.FC<{
  goToAccountOnBack?: boolean;
  goToPaymentOnBack?: boolean;
}> = ({goToAccountOnBack, goToPaymentOnBack}) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  console.log("goToAccountOnBack ::", goToAccountOnBack)
  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        onPress={() => {
          if (goToPaymentOnBack) {
              navigation.navigate('Payment', { totalAmount: 0, paymentData: {} }); 
          }
          else if ( goToAccountOnBack){
            navigation.navigate('Main', { screen: 'Account' } as any);
          }
          else {
            navigation.goBack();
          }
        }}
        style={styles.backButton}>
        <Image source={imagePaths.back_icon} 
        style={styles.backButton}  />
      </TouchableOpacity> */}
      <HeaderText text="Admin Screen" style={styles.headerTitle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(1),
    backgroundColor: Colors.white,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: wp(3),
    padding: wp(1.5),
  },
  backIcon: {
    width: wp(6),
    height: wp(6),
    resizeMode: 'contain',
  },
  headerTitle: {
    // fontSize: sp(20),
    // fontWeight: 'bold',
    // textAlign: 'center',
    color: Colors.black,
  },
});

export default Header;
