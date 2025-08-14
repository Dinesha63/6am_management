import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { FontFamily } from '../../../utils/constant';
import SimpleIcon from '../../../components/SimpleIcon';
import { imagePaths } from '../../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../../utils/constants/responsiveScreen';
import Colors from '../../../utils/constants/colors';


interface LocationButtonProps {
  value: string;
  onPress: () => void;
  hasLocation?: boolean;
}

const LocationButton: React.FC<LocationButtonProps> = ({ value, onPress, hasLocation = false }) => {
  const getButtonText = () => {
    return hasLocation ? "Location Change" : "Choose Location";
  };

  const getTextStyle = () => {
    return [styles.text, styles.placeholder];
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={getTextStyle()}>
        {getButtonText()}
      </Text>
      <SimpleIcon 
        source={imagePaths.Location_Icon}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: wp(2),
    padding: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.backgroundGrey,
  },
  text: {
    fontSize: sp(16),
    color: Colors.blackText,
  },
  placeholder: {
    color: Colors.lightGrey,
  },
  icon: {
    width: wp(5),
    height: wp(5),
    tintColor: Colors.lightGrey,
  },
});
export default LocationButton;