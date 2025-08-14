import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, Animated, StyleSheet, TextInputProps } from 'react-native';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../../utils/constants/responsiveScreen';
import Colors from '../../../utils/constants/colors';

interface FloatingLabelInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  onChangeText,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedVal = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedVal, {
      toValue: isFocused || !!value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute' as const,
    left: wp(4),
    top: animatedVal.interpolate({ inputRange: [0, 1], outputRange: [hp(2), -hp(1)] }),
    fontSize: animatedVal.interpolate({ inputRange: [0, 1], outputRange: [sp(14), sp(12)] }),
    color: animatedVal.interpolate({ inputRange: [0, 1], outputRange: [Colors.lightGrey, Colors.primary] }) as any,
    backgroundColor: Colors.white,
    paddingHorizontal: wp(1),
    zIndex: 1,
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={e => {
          setIsFocused(true);
          onFocus && onFocus(e as any);
        }}
        onBlur={e => {
          setIsFocused(false);
          onBlur && onBlur(e as any);
        }}
        style={styles.input}
        placeholder=""
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: hp(1),
    marginBottom: hp(1),
    borderWidth: 1,
    borderColor: Colors.backgroundGrey,
    borderRadius: wp(2),
    paddingHorizontal: wp(4),
    backgroundColor: Colors.white,
  },
  input: {
    height: hp(6),
    fontSize: sp(14),
    color: Colors.dark,
    padding: 0,
    margin: 0,
  },
});

export default FloatingLabelInput;
