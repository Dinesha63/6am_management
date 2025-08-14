import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import Colors from '../../utils/constants/colors';
interface ExploreButtonProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

const ExploreButton: React.FC<ExploreButtonProps> = ({
  navigation,
}) => {
  return (
    <View style={styles.container}> 
    <TouchableOpacity
                    style={[styles.button,]}
                    onPress={() => {
                      navigation.navigate('Main');
                    }}>
                    <Text style={styles.buttonText}>Explore Plans</Text>
                  </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    top: hp(1.85),             
    left: 0,
    right: 0,
    padding: wp(4.3),          
    borderTopColor: Colors.lineLight,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: wp(2.1),     
    padding: wp(4.3),          
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: sp(16),
    fontWeight: '600',
  },
});


export default ExploreButton;
