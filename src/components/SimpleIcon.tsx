import React from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';
import Colors from '../utils/constants/colors';

interface SimpleIconProps {
  source: ImageSourcePropType;
  size?: number;
  color?: string;
  style?: StyleProp<ImageStyle>;
}

const SimpleIcon: React.FC<SimpleIconProps> = ({ 
  source, 
  size = 24, 
  color, 
  style 
}) => (
  <Image
    source={source}
    style={[
      {
        width: size,
        height: size,
        resizeMode: 'contain',
        tintColor: color || Colors.listSeconary, // default tint if no color
      },
      style, // style comes after so you can still override size etc., but not tintColor
    ]}
  />
);

export default SimpleIcon;
