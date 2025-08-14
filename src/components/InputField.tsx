import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Controller,
  Control,
  FieldValues,
  Path,
  FieldErrors,
} from 'react-hook-form';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../utils/constants/responsiveScreen';
import Colors from '../utils/constants/colors';
import { FontFamily } from '../utils/constant';

interface InputFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  errors: FieldErrors<T>;
  placeholder: string;
  keyboardType?: TextInputProps['keyboardType'];
  multiline?: boolean;
}

const InputField = <T extends FieldValues>({
  control,
  name,
  errors,
  placeholder,
  keyboardType = 'default',
  multiline = false,
}: InputFieldProps<T>) => {
  const [showError, setShowError] = useState(false);
  const error = errors[name]?.message as string | undefined;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.input,
              multiline && { textAlignVertical: 'top' },
              error && { borderColor: Colors.danger, borderWidth: 1 },
            ]}
            placeholder={placeholder}
            placeholderTextColor={Colors.grey}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
          />

          {error && (
            <TouchableOpacity
              style={styles.errorIndicator}
              onPress={() => setShowError(prev => !prev)}>
              <Text style={styles.errorIcon}>!</Text>
            </TouchableOpacity>
          )}

          {error && showError && (
            <Text style={styles.errorMessage}>{error}</Text>
          )}
        </View>
      )}
    />
  );
};

export default InputField;
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    fontSize: sp(12),
    fontFamily: FontFamily.REGULAR,
    color: Colors.black,
    marginBottom: hp(1.5),
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: hp(2),
  },
  errorIndicator: {
    position: 'absolute',
    right: wp(2),
    top: hp(1.7),
    width: wp(5),
    height: wp(5),
    borderRadius: wp(3),
    backgroundColor: Colors.danger,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    color: Colors.white,
    fontSize: sp(14),
    fontWeight: 'bold',
  },
  errorMessage: {
    color: Colors.danger,
    fontSize: sp(12),
    marginTop: hp(0.5),
    marginLeft: wp(1),
  },
});
