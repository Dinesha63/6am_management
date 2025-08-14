// src/screens/components/FormField.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Animated,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { useController, Control, FieldError } from 'react-hook-form';
import InfoTooltip from './InfoTooltip';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../../utils/constants/responsiveScreen';
import Colors from '../../../utils/constants/colors';

interface FormFieldProps extends TextInputProps {
  control: Control<any>;
  name: string;
  placeholder: string;
}

const FormField: React.FC<FormFieldProps> = ({
  control,
  name,
  placeholder,
  ...rest
}) => {
  const { field, fieldState } = useController({ name, control });
  const { value, onChange, onBlur } = field;
  const { error } = fieldState;

  const animatedVal = useRef(new Animated.Value(value ? 1 : 0)).current;
  const [isFocused, setIsFocused] = useState(false);

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
      outputRange: [hp(3), -hp(1)],
    }),
    fontSize: animatedVal.interpolate({
      inputRange: [0, 1],
      outputRange: [sp(14), sp(12)],
    }),
    color: animatedVal.interpolate({
      inputRange: [0, 1],
      outputRange: [Colors.lightGrey, Colors.primary],
    }) as any,
    backgroundColor: Colors.white,
    paddingHorizontal: wp(1),
    zIndex: 1,
  };

  const borderColor = error
    ? Colors.danger
    : isFocused
    ? Colors.primary
    : Colors.backgroundGrey;

  return (
    <View style={[styles.container, { borderColor }]}>
      <Animated.Text style={labelStyle}>{placeholder}</Animated.Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        onBlur={() => {
          setIsFocused(false);
          onBlur();
        }}
        onFocus={() => setIsFocused(true)}
        style={styles.input}
        {...rest}
      />
      {error && <InfoTooltip message={(error as FieldError).message} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(2.5),
    borderWidth: 1,
    borderRadius: wp(2),
    paddingHorizontal: wp(4),
    paddingTop: hp(4),
    paddingBottom: hp(1),
    backgroundColor: Colors.white,
  },
  input: {
    height: hp(5),
    fontSize: sp(14),
    color: Colors.dark,
    padding: 0,
    margin: 0,
  },
});

export default FormField;
