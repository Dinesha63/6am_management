import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageStyle,
} from 'react-native';
import { imagePaths } from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';  

interface ImageSelectorProps {
  uri: string | null;
  onPress: () => void;
  style?: ImageStyle;
  onLongPress?: () => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ uri, onPress,onLongPress, style }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}
    onLongPress={onLongPress}
>
      <Image
        source={uri ? { uri } : imagePaths.Placeholder_Image}
        style={[styles.image, style]}
        resizeMode="stretch"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(22),     
    height: hp(10),  
    backgroundColor: Colors.greyBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(2), 
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImageSelector;
