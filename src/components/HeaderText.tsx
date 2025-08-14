import React from 'react';
import { Text, TextStyle, TextProps } from 'react-native';
import Colors  from '../utils/constants/colors';
import { FontFamily, FontSize } from '../utils/constants/fonts';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../utils/constants/responsiveScreen';

interface HeaderTextProps extends TextProps {
  text: string;
  style?: TextStyle | TextStyle[];
  numberOfLines?: number;
}

const HeaderText: React.FC<HeaderTextProps> = ({
  text,
  style,
  numberOfLines = 1,
  ...rest
}) => {
  return (
    <Text
      style={[
  {
    fontSize: FontSize.LG,
    fontFamily: FontFamily.REGULAR,
    fontWeight: 'bold',
    color: Colors.black,
    marginVertical: hp(1.2),
  },
        style,
      ]}
      numberOfLines={numberOfLines}
      {...rest}
    >
      {text}
    </Text>
  );
};

export default HeaderText;
