import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageStyle,
  View,
  Text,
} from 'react-native';
import { imagePaths } from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';  

interface ImageSelectorProps {
  uri: string | null;
  onPress: () => void;
  style?: ImageStyle;
  onLongPress?: () => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ 
  uri, 
  onPress,
  onLongPress, 
  style 
}) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, style]}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholder}>
          <View style={styles.uploadIcon}>
            <Text style={styles.uploadIconText}>📷</Text>
          </View>
          <Text style={styles.uploadText}>Upload</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(44),     
    height: hp(18),  
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(3), 
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.backgroundGrey,
    borderStyle: 'dashed',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    backgroundColor: Colors.SelectedCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  uploadIconText: {
    fontSize: sp(20),
  },
  uploadText: {
    fontSize: sp(14),
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default ImageSelector; 