import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';
import Header from './Header';
import HorizontalScroll from './HorizontalScroll';
import Menubar from './Menubar';
import SignInButton from './SignInButton';
import GuestProfile from './GuestProfile';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';  

interface GuestScreenProps {
  navigation: any;
}

const GuestScreenComponent: React.FC<GuestScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Header />
        <HorizontalScroll />
        <GuestProfile />
        <Menubar />
        <SignInButton navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp(12.5),
  },
});

export default GuestScreenComponent; 