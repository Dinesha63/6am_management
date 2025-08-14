import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Header from './Header';
import SimpleIcon from '../../components/SimpleIcon';
import { imagePaths } from '../../utils/constants/imagePaths';
import Colors from '../../utils/constants/colors';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';


interface ReportDamageSuccessProps {
  navigation?: any;
  onGoHome?: () => void;
}

const ReportSubmitScreen: React.FC<ReportDamageSuccessProps> = ({ 
  navigation, 
  onGoHome 
}) => {
  const handleGoHome = () => {
    // if (onGoHome) {
    //   onGoHome();
    // } else if (navigation) {
      navigation.navigate('Main'); 
    
  };

  const handleGoBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Header */}
      <Header />

      {/* Help Info */}
      <View style={styles.helpContainer}>
        <View style={styles.infoIcon}>
          <Text style={styles.infoText}>i</Text>
        </View>
        <Text style={styles.helpText}>
          Help us make it right; Report issues with notes and photos.
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>

        {/* Sorry Badge */}
        <View >
            <SimpleIcon source={imagePaths.sorry_icon} style={styles.icon} />
        </View>

        {/* Thank You Message */}
        <Text style={styles.thankYouTitle}>Thank you for your report!</Text>
        
        <Text style={styles.messageText}>
          We've received your damage report and are currently reviewing it. You can expect a response or resolution within the next 4 hours.
        </Text>
        
        <Text style={styles.appreciationText}>
          We appreciate your patience.
        </Text>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Policy Info */}
        <View style={styles.policyContainer}>
          <View style={styles.policyInfoIcon}>
            <Text style={styles.policyInfoText}>i</Text>
          </View>
          <Text style={styles.policyText}>
            Learn more about our{' '}
            <Text style={styles.policyLink}>Replacement & Return Policy</Text>
          </Text>
        </View>

        {/* Go to Home Button */}
        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Text style={styles.homeButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGreyScreen,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    backgroundColor: Colors.white,
    marginTop: hp(1),
    marginHorizontal: wp(4),
    borderRadius: wp(2),
  },
  infoIcon: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(2.5),
    backgroundColor: Colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  infoText: {
    color: Colors.white,
    fontSize: sp(12),
    fontWeight: '600',
  },
  helpText: {
    fontSize: sp(11),
    color: Colors.black,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(8),
  },
  icon: {
    width: wp(32),
    height: wp(32),
  },
  thankYouTitle: {
    fontSize: sp(20),
    fontWeight: '700',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: hp(2),
  },
  messageText: {
    fontSize: sp(14),
    color: Colors.black,
    textAlign: 'center',
    lineHeight: hp(2.5),
    marginBottom: hp(1),
  },
  appreciationText: {
    fontSize: sp(14),
    color: Colors.black,
    textAlign: 'center',
    fontWeight: '500',
  },
  bottomSection: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
  },
  policyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(2),
    paddingVertical: hp(2),
    marginBottom: hp(2),
  },
  policyInfoIcon: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(4),
    backgroundColor: Colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(2),
  },
  policyInfoText: {
    color: Colors.white,
    fontSize: sp(10),
    fontWeight: '600',
  },
  policyText: {
    fontSize: sp(12),
    color: Colors.black,
    flex: 1,
  },
  policyLink: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  homeButton: {
    backgroundColor: Colors.primary, 
    paddingVertical: hp(2),
    borderRadius: wp(2),
    alignItems: 'center',
  },
  homeButtonText: {
    color: Colors.white,
    fontSize: sp(16),
    fontWeight: '600',
  },
});

export default ReportSubmitScreen;