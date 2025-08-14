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
import SimpleIcon from '../../components/SimpleIcon';

const TermsAndConditionsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{...styles.backButton}}>
            <SimpleIcon
           source={imagePaths.back_icon}
             style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}>
          Welcome to 6 am, managed by Just Farm Fresh Private Limited,
          Coimbatore. By using our services, you agree to comply with the
          following terms and conditions. Please read them carefully.
        </Text>
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By accessing or using the 6 am website, mobile app, or services, you
          agree to be bound by these Terms & Conditions. If you do not agree,
          please refrain from using our services.
        </Text>
        <Text style={styles.sectionTitle}>2. Eligibility</Text>
        <Text style={styles.text}>
          - You must be at least 18 years old to use our services.{'\n'}- By
          creating an account, you affirm that the information provided is
          accurate and complete.
        </Text>
        <Text style={styles.sectionTitle}>3. Account Responsibilities</Text>
        <Text style={styles.text}>
          - You are responsible for maintaining the confidentiality of your
          account credentials.{'\n'}- Liability is not claimed for any
          unauthorized use of your account.
        </Text>
        <Text style={styles.sectionTitle}>4. Orders and Payments</Text>
        <Text style={styles.text}>
          - All orders are subject to availability and confirmation of payment.
          {'\n'}- Prices are subject to change without notice.{'\n'}- Payments
          can be made through the available methods on our platform (UPI,
          credit/debit cards, wallets).
        </Text>
        <Text style={styles.sectionTitle}>5. Delivery Policy</Text>
        <Text style={styles.text}>
          - We strive to deliver your orders on time, however delays may occur due
          to unforeseen circumstances.{'\n'}- Ensure your delivery address is
          accurate and accessible. We are not responsible for failed deliveries
          due to incorrect or incomplete addresses.
        </Text>
        <Text style={styles.sectionTitle}>6. Returns and Refunds</Text>
        <Text style={styles.text}>
          - Products can be returned or refunded only if they are damaged,
          defective, or incorrect.{'\n'}- Refunds will be processed within 5-7
          business days after approval.
        </Text>
        <Text style={styles.sectionTitle}>7. Subscription Services</Text>
        <Text style={styles.text}>
          - Subscriptions can be managed or canceled through the app.{'\n'}-
          Changes to subscriptions must be made before the cut-off time to avoid
          charges for the next delivery.
        </Text>
        <Text style={styles.sectionTitle}>8. Prohibited Activities</Text>
        <Text style={styles.text}>
          - You agree not to:{'\n'}- Use our platform for illegal or
          unauthorized purposes.{'\n'}- Interfere with or disrupt the
          functionality of our services.{'\n'}- Misuse promotional offers or
          referral programs.
        </Text>
        <Text style={styles.sectionTitle}>9. Intellectual Property</Text>
        <Text style={styles.text}>
          - All content on the 6 am platform, including text, images, logos, and
          software, is the property of Just Farm Fresh Private Limited and
          protected by intellectual property laws. Unauthorized use is strictly
          prohibited.
        </Text>
        <Text style={styles.sectionTitle}>10. Limitation of Liability</Text>
        <Text style={styles.text}>
          - 6 am is not liable for any indirect, incidental, or consequential
          damages arising from the use of our services.{'\n'}- Our liability is
          limited to the amount paid for the specific order in question.
        </Text>
        <Text style={styles.sectionTitle}>11. Modifications to Terms</Text>
        <Text style={styles.text}>
          - We reserve the right to update or modify these Terms & Conditions at
          any time. Changes will be communicated through our platform, and
          continued use of our services constitutes acceptance of the updated
          terms.
        </Text>
        <Text style={styles.sectionTitle}>12. Governing Law</Text>
        <Text style={styles.text}>
          - These Terms & Conditions are governed by the laws of India. Any
          disputes will be resolved in the courts of Coimbatore, Tamil Nadu,
          India.
        </Text>
        <Text style={styles.sectionTitle}>13. Contact Us</Text>
        <Text style={styles.text}>
  - For questions or concerns regarding these Terms & Conditions, contact us at{' '}
  <Text
    style={[styles.text, { color: '#007AFF', textDecorationLine: 'underline' }]}
    onPress={() => Linking.openURL('mailto:support@6am.co.in')}>
    support@6am.co.in
  </Text>
  .
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
    flex: 1,
    textAlign: 'center',
    marginRight: 32, 
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
});

export default TermsAndConditionsScreen;
