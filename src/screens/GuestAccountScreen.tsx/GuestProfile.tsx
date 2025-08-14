import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import { imagePaths } from '../../utils/constants/imagePaths';
import SimpleIcon from '../../components/SimpleIcon';

const GuestProfile = () => {
  return (
    <View style={styles.userCard}>
      <View style={styles.avatarPlaceholder}>
        <SimpleIcon source={imagePaths.Person_icon} style={ {width: wp(8), height: wp(8)}} />
      </View>
      <View>
        <Text style={styles.userName}>Welcome, Guest</Text>
        {/* <Text style={styles.userPhone}>Continue with your phone number</Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: wp(3),
    padding: wp(2.5),
    marginTop: hp(1),
    marginBottom: hp(2),
    alignItems: 'center',
    // shadowColor: Colors.blackText,
    // shadowOpacity: 0.05,
    // shadowRadius: 4,
    // elevation: 2,
    marginLeft: wp(5),
    marginRight: wp(5),
    
  },
  avatarPlaceholder: {
    width: wp(13),
    height: wp(13),
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(6.5),
    marginRight: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: sp(24),
  },
  userName: {
    fontSize: sp(20),
    fontWeight: '600',
    color: Colors.darkGreen,
    marginLeft: hp(5),
  },
  userPhone: {
    fontSize: sp(14),
    color: Colors.grey,
  },
});


export default GuestProfile;
