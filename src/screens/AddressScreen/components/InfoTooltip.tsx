import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontFamily } from '../../../utils/constant';
import { imagePaths } from '../../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../../utils/constants/responsiveScreen';

type Props = {
  message?: string;
};

const InfoTooltip: React.FC<Props> = ({ message }) => {
  const [show, setShow] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShow(!show)} style={styles.iconWrapper}>
        <Image
          source={imagePaths.ERROR_INFO}
          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {show && message && (
        <Text style={styles.tooltipText}>{message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'flex-start',
    width: '100%',
  },
  iconWrapper: {
    position: 'absolute',
    top: -hp(4.5),
    right: wp(2.5),
    zIndex: 10,
  },
  icon: {
    width: wp(6),
    height: wp(6),
  },
  tooltipText: {
    marginTop: hp(0.75),
    fontSize: sp(13),
    color: 'red',
    textAlign: 'left',
    paddingHorizontal: wp(1),
  },
});

export default InfoTooltip;
