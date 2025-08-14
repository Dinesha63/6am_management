import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { FontFamily } from '../../utils/constant';
import Colors from '../../utils/constants/colors';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import SimpleIcon from '../../components/SimpleIcon';
import { imagePaths } from '../../utils/constants/imagePaths';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const UserProfileCard = () => {
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const name = await AsyncStorage.getItem('customerName');
      const phone = await AsyncStorage.getItem('userPhoneNumber');
      setCustomerName(name);
      setPhoneNumber(phone);
    };
    fetchData();
  }, []);

  let displayName = '';
  if (customerName) {
    displayName = customerName;
  } else if (phoneNumber) {
    displayName = phoneNumber;
  } else {
    displayName = 'Welcome guest!';
  }
const isGuest = !customerName && !phoneNumber;
  return (
    <View style={styles.userCard}>
      <View style={styles.avatarPlaceholder}>
        <SimpleIcon source={imagePaths.Person_icon} style={ {width: wp(8), height: wp(8)}} />
      </View>
      <View>
        <Text style={styles.userName}>{displayName}</Text>
        {isGuest && <Text>Continue with your phone number</Text>}
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
    marginTop: hp(1.5),
    alignItems: 'center',
    borderColor: Colors.darkPurple,
    borderWidth: 1,
    marginLeft: wp(5),
    marginRight: wp(5),
  },
  avatarPlaceholder: {
    width: wp(13),
    height: wp(13),
    backgroundColor: Colors.greyBackground,
    borderRadius: wp(10),
    marginRight: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: sp(24),
  },
  userName: {
    fontSize: sp(16),
    fontWeight: '600',
    color: Colors.primary,
  },
  userPhone: {
    fontSize: sp(14),
    color: Colors.lightGrey,
  },
});

export default UserProfileCard;
