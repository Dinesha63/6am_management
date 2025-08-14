import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import SimpleIcon from '../../../components/SimpleIcon';
import {useNavigation} from '@react-navigation/native';
import { FontFamily} from '../../../utils/constant';
import { imagePaths } from '../../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,

  getResponsiveSpacing as rsp,
} from '../../../utils/constants/responsiveScreen';

interface NavigationHeaderProps {
  title: string;
}
const NavigationHeader: React.FC<NavigationHeaderProps> = ({title}) => {
  const navigation = useNavigation();

  return (
         <View style={styles.navigationHeader}>
      <View style={styles.backIconContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <SimpleIcon
            source={imagePaths.back_icon}
            style={styles.backIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerText}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: hp(2),
    position: 'static',
  },
  backIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: wp(3),
  },
  leftSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: wp(3),
  },
  backIcon: {
    width: wp(6),
    height: wp(6),
    resizeMode: 'contain',
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: sp(21),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
    color: 'black',
  },
});

export default NavigationHeader;
