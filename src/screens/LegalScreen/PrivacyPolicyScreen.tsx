import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {imagePaths} from '../../utils/constants/imagePaths';
import {hp, wp} from '../../utils/constants/responsive';

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Image source={imagePaths.back_icon} 
          style={styles.backIcon}  />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}>
          At 6 am, managed by Just Farm Fresh Private Limited, Coimbatore, your
          privacy is our priority. This Privacy Policy outlines how we collect,
          use, and protect your personal information.
        </Text>
        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.text}>
          - Personal Information: Name, contact details, delivery address, and
          payment information.{'\n'}- Usage Data: Information about how you use
          our app or website.{'\n'}- Device Information: Details about your
          device, such as IP address and browser type.
        </Text>
        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.text}>
          We do not sell your personal information. However, we may share it
          with:
          {'\n'}• Service Providers: For payment processing, delivery, and
          customer support.
          {'\n'}• Legal Authorities: If required by law or to protect our
          rights.
        </Text>
        <Text style={styles.sectionTitle}>3. Sharing Your Information</Text>
        <Text style={styles.text}>
          - Uncompromised Quality: Every product undergoes rigorous quality
          checks.{'\n'}- Timely Deliveries: Wake up to Fresh Deliveries every
          morning.{'\n'}- Sustainability Focus: We prioritize eco-friendly
          practices and support local farmers.
        </Text>
        <Text style={styles.sectionTitle}>4. Data Security</Text>
        <Text style={styles.text}>
          We implement robust security measures to protect your data. However,
          no system is entirely foolproof, and we encourage you to safeguard
          your account credentials.
        </Text>
        <Text style={styles.sectionTitle}>5. Your Rights</Text>
        <Text style={styles.text}>
          - Access and update your personal information.{'\n'}- Opt-out of
          marketing communications.{'\n'}- Request deletion of your data,
          subject to legal requirements.
        </Text>
        <Text style={styles.sectionTitle}>6. Changes to This Policy</Text>
        <Text style={styles.text}>
          We may update this Privacy Policy periodically. Changes will be
          communicated through our app or website.
        </Text>
        <Text style={styles.text}>
          For questions or concerns, contact us at{' '}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('mailto:privacy@6am.co.in')}>
            privacy@6am.co.in
          </Text>
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(1),
    backgroundColor: '#fff',
    position: 'relative',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backIcon: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    lineHeight: 21,
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});

export default PrivacyPolicyScreen;
