import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { imagePaths } from '../../utils/constants/imagePaths';
import Header from './Header';
import LottieView from 'lottie-react-native';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';

const AddressSuccessScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <>
      <Header goToAccountOnBack={true} goToPaymentOnBack={false} />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.orderContainer}>
                  <View style={{flex: 15, justifyContent: 'center',alignContent:"center"}}>
                  <LottieView
                      source={require('../../assets/Animation/Success-Animation.json')}
                      autoPlay
                      loop={false}
                      speed={0.8}
                      style={styles.centerImage}
                    />
                  </View>
                  <View style={{flex: 5, justifyContent: 'center'}}>

            <Text style={styles.noOrdersText}>Address Saved!</Text>
            <Text style={styles.subText}>Your address has been saved successfully.</Text>

            <TouchableOpacity style={styles.exploreButton}
                           onPress={() => {
                // Navigate to Main with Account screen and replace the current screen
                navigation.replace('Main', { screen: 'Account' });
              }} 
             >
              <Text style={styles.buttonText}>View My Addresses</Text>
            </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: wp(4),
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(5),
  },
  orderContainer: {
    alignItems: 'center',
  },
  logisticsIcon: {
    width: wp(32),
    height: wp(32),
    marginBottom: hp(2.5),
    tintColor: Colors.primary,
  },
  noOrdersText: {
    fontSize: sp(18),
    fontWeight: '600',
    color: '#000',
    marginBottom: hp(1),
    textAlign: 'center',
  },
  subText: {
    fontSize: sp(14),
    color: '#444',
    marginBottom: hp(3),
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(25),
    borderRadius: wp(2),
    marginBottom: hp(2),
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: sp(16),
    textAlign: 'center',
  },
  centerImage: {
    width: wp(44),
    height: wp(44),
    bottom: hp(1.2),
    resizeMode: 'contain',
  },
});



export default AddressSuccessScreen;