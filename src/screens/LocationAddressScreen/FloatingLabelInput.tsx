import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, Animated, StyleSheet, TextInputProps, Text } from 'react-native';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
import { COLORS } from '../../utils/constant';

interface FloatingLabelInputProps extends TextInputProps {
  label: string;
  value: string|undefined;
  onChangeText: (text: string) => void;
  error?: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  onChangeText,
  onFocus,
  onBlur,
  error,
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
    top: animatedVal.interpolate({ 
      inputRange: [0, 1], 
      outputRange: [hp(2.2), -hp(0.8)] 
    }),
    fontSize: animatedVal.interpolate({ 
      inputRange: [0, 1], 
      outputRange: [sp(14), sp(12)] 
    }),
    color: animatedVal.interpolate({ 
      inputRange: [0, 1], 
      outputRange: [Colors.lightGrey, Colors.primary] 
    }) as any,
    backgroundColor: Colors.white,
    paddingHorizontal: wp(1),
    zIndex: 1,
  };

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorIndicator}>
          <Text style={styles.errorIcon}>!</Text>
        </View>
      )}
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
        style={[styles.input, error && styles.inputWithError]}
        placeholder=""
        placeholderTextColor={Colors.lightGrey}
        returnKeyType="next"
        blurOnSubmit={false}
        {...rest}
      />
      {/* {error && <Text style={styles.errorText}>{error}</Text>} */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: hp(1),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: Colors.backgroundGrey,
    borderRadius: wp(2),
    paddingHorizontal: wp(4),
    backgroundColor: Colors.white,
    position: 'relative',
  },
  input: {
    height: hp(5.5),
    fontSize: sp(14),
    color: Colors.dark,
    padding: 0,
    margin: 0,
  },
  inputWithError: {
    borderColor: COLORS.red ?? 'red',
  },
  errorIndicator: {
    position: 'absolute',
    right: wp(2),
    top: hp(2.5),
    width: wp(5),
    height: wp(5),
    borderRadius: wp(3),
    backgroundColor: COLORS.red ?? 'red',
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    color: Colors.white,
    fontSize: sp(14),
    fontWeight: 'bold',
  },
  errorText: {
    color: COLORS.red ?? 'red',
    fontSize: sp(12),
    marginTop: hp(0.5),
  },
});

export default FloatingLabelInput; 