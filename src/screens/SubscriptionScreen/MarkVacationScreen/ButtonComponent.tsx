import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { FontFamily } from '../../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../../utils/constants/responsiveScreen';

type Props = {
  title: string;
  onPress: () => void;
  backgroundColor: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export const ButtonComponent: React.FC<Props> = ({
  title,
  onPress,
  backgroundColor,
  style,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={!disabled ? onPress : undefined}
      style={[
        styles.container,
        {
          backgroundColor: disabled
            ? addOpacityToColor(backgroundColor, 0.5)
            : backgroundColor,
        },
        style,
      ]}
      activeOpacity={0.6}
      disabled={disabled}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const addOpacityToColor = (color: string, opacity: number): string => {
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    let r = 0,
      g = 0,
      b = 0;

    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    }

    return `rgba(${r},${g},${b},${opacity})`;
  }
  return color;
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: hp(1),       
    paddingHorizontal: wp(4),     
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(1.1),        
  },
  text: {
    color: 'white',
    fontSize: sp(13),
    fontFamily: FontFamily.REGULAR,
    fontWeight: '600',
  },
});

export default ButtonComponent;
