import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import { imagePaths } from '../../utils/constants/imagePaths';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';  

const HorizontalScroll = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLearnMore = () => {
    navigation.navigate('HelpAndFAQScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Image 
          source={imagePaths.promotion_icon} 
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <View style={styles.textContainer}>
            <Text style={styles.bannerTitle}>6 am Credits</Text>
            <Text style={styles.bannerSubtitle}>Add credits for more benefits</Text>
            <Pressable
              android_ripple={{color: 'rgba(255, 255, 255, 0.3)'}}
              style={({pressed}) => [
                styles.learnMoreButton,
                pressed && Platform.OS === 'ios' && styles.iosPressed,
              ]}
              onPress={handleLearnMore}>
              <Text style={styles.learnMoreText}>Learn More</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    marginVertical: hp(2),
  },
  banner: {
    width: '100%',
    height: hp(20),
    borderRadius: wp(3),
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    paddingHorizontal: wp(4),
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: sp(18),
    color: Colors.blackText,
    fontWeight: 'bold',
    marginBottom: hp(0.5),
  },
  bannerSubtitle: {
    fontSize: sp(14),
    color: Colors.blackText,
    marginBottom: hp(1.5),
  },
  learnMoreButton: {
    backgroundColor: '#7CC467',
    alignSelf: 'flex-start',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: wp(2),
  },
  iosPressed: {
    opacity: 0.7,
  },
  learnMoreText: {
    fontSize: sp(14),
    fontWeight: '600',
    color: Colors.blackText,
  },
});

export default HorizontalScroll;
