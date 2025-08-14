import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import Colors from '../../../utils/constants/colors';
import { FontFamily } from '../../../utils/constant';
// import { RadioOptionsProps } from '../../../types';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../../utils/constants/responsiveScreen';
interface RadioOptionsProps {
  options: RadioOption[];
  selectedOption: string | null;
  onSelect: (id: string) => void;
  otherText: string;
  setOtherText: (text: string) => void;
}

interface RadioOption {
  id: string;
  label: string;
  hasInput?: boolean;
}

const RadioOptions: React.FC<RadioOptionsProps> = ({
  options,
  selectedOption,
  onSelect,
  otherText,
  setOtherText,
}) => {
  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <View key={option.id}>
          <TouchableOpacity activeOpacity={0.8}
            style={styles.optionContainer}
            onPress={() => onSelect(option.id)}>
            <View
              style={[
                styles.radioOuter,
                selectedOption === option.id && styles.radioOuterSelected,
              ]}>
              {selectedOption === option.id && (
                <View style={styles.radioInner} />
              )}
            </View>
            <Text style={styles.optionLabel}>{option.label}</Text>
          </TouchableOpacity>
          {index !== options.length - 1 && <View style={styles.line} />}
          {option.hasInput && selectedOption === option.id && (
            <TextInput
              placeholderTextColor={Colors.secondary}
              multiline
              editable
              numberOfLines={5}
              style={styles.input}
              placeholder="Specify your reason"
              value={otherText}
              onChangeText={setOtherText}
            />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: hp(4.3), 
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    borderRadius: wp(5.3), 
    width: wp(83),
    alignSelf: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.7), 
    paddingHorizontal: wp(5.3), 
  },
  radioOuter: {
    height: wp(5.3), 
    width: wp(5.3),
    borderRadius: wp(2.7), 
    borderWidth: 2,
    borderColor: Colors.lightBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(2.7), 
  },
  radioOuterSelected: {
    borderColor: Colors.lightGreen,
  },
  radioInner: {
    height: wp(2.7), 
    width: wp(2.7),
    borderRadius: wp(1.3), 
    backgroundColor: Colors.lightGreen,
  },
  optionLabel: {
    fontSize: sp(16),
    fontFamily: FontFamily.REGULAR,
    flex: 1,
  },
  input: {
    height: hp(15), 
    borderWidth: 1,
    borderColor: Colors.lightBorder,
    borderRadius: wp(1.3), 
    paddingLeft: wp(4), 
    marginHorizontal: wp(5.3), 
    marginBottom: hp(1.5), 
    textAlignVertical: 'top',
  },
  line: {
    height: 1,
    backgroundColor: Colors.lightBorder,
    width: '100%',
  },
});


export default RadioOptions;
