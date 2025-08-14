import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import {imagePaths} from '../../utils/constants/imagePaths';
import {hp, wp} from '../../utils/constants/responsive';
import {useNavigation} from '@react-navigation/native';
import SimpleIcon from '../../components/SimpleIcon';

const HelpAndFAQScreen = () => {
  const navigation = useNavigation();
  const [activeSection, setActiveSection] = useState<string | null>('');

  const handleSectionToggle = (section: string | null) => {
    setActiveSection(prev => (prev === section ? null : section));
  };

  return (
    <View style={{flex: 1}}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
            <SimpleIcon
           source={imagePaths.back_icon} style={{width: wp(6), height: wp(6), resizeMode: 'contain'}} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & FAQ</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: '100%'}}
        keyboardShouldPersistTaps="handled">
        {/* Section: About 6am Store */}

        {activeSection !== 'About6AM' ? (
          // Show card when section is not active
          <TouchableOpacity
            onPress={() => handleSectionToggle('About6AM')}
            style={styles.card}>
            <Text style={styles.title}>About 6 am Store</Text>
            <Text style={styles.description}>
              What is 6 am Store, sourcing, and Our Products.
            </Text>
          </TouchableOpacity>
        ) : (
          // Show detailed content when section is active
          <View style={styles.aboutContainer}>
            {/* Tappable header to go back */}
            <TouchableOpacity onPress={() => handleSectionToggle(null)}>
              <Text style={styles.sectionTitle}>What is 6 am?</Text>
            </TouchableOpacity>

            <Image source={imagePaths.Help_About} style={{width: '100%', height: '20%', resizeMode: 'stretch'}} />

            <Text style={styles.normalText}>
              6 am is a platform dedicated to delivering fresh, high-quality
              milk and dairy products directly to your doorstep. We partner with
              local farmers to source fresh milk daily, ensuring it reaches your
              nearest store and is delivered to you within hours.
            </Text>

            <Text style={styles.sectionTitle}>
              What other products do you offer?
            </Text>
            <Text style={styles.normalText}>
              We offer a variety of fresh dairy products, all made from fresh
              milk, not leftovers:
            </Text>

            <View style={{marginTop: 8}}>
              <Text style={styles.bulletText}>• Butter: Rich and creamy.</Text>
              <Text style={styles.bulletText}>• Ghee: Pure and natural.</Text>
              <Text style={styles.bulletText}>
                • Paneer: Soft and fresh, prepared daily.
              </Text>
              <Text style={styles.bulletText}>
                • Curd: Thick and creamy, made with care.
              </Text>
            </View>
          </View>
        )}

        {/* Section: About Subscription */}
        {activeSection !== 'Subscription' ? (
          // Show card when section is NOT active
          <TouchableOpacity
            onPress={() => handleSectionToggle('Subscription')}
            style={styles.card}>
            <Text style={styles.title}>About Subscription</Text>
            <Text style={styles.description}>
              How to subscribe, routine selection, delivery process and mark
              vacation.
            </Text>
          </TouchableOpacity>
        ) : (
          // Show content when section IS active
          <View style={styles.aboutContainer}>
            {/* Tappable heading to collapse */}
            <TouchableOpacity onPress={() => handleSectionToggle(null)}>
              <Text style={styles.sectionTitle}>About Subscription</Text>
            </TouchableOpacity>

            <Image
              source={imagePaths.Help_Subscribtion}
              style={{width: '100%', height: '12%', resizeMode: 'contain'}}
            />

            <Text style={styles.normalText}>
              Choose your desired product and quantity and set a delivery
              routine that fits your choice: daily, alternate days, or custom
              schedule. We'll handle the rest, ensuring fresh and timely
              deliveries straight to your doorstep. Enjoy the convenience of a
              plan tailored just for you!
            </Text>

            <Text
              style={[styles.normalText, {fontWeight: 'bold', marginTop: 15}]}>
              When will my order be delivered?
            </Text>
            <Text style={styles.normalText}>
              We start deliveries from the store nearest to you at{' '}
              <Text style={{fontWeight: 'bold'}}>
                5:45 AM and complete them by 7:30 AM.
              </Text>
            </Text>

            <Text
              style={[styles.normalText, {fontWeight: 'bold', marginTop: 15}]}>
              Can I track my delivery?
            </Text>
            <Text style={styles.normalText}>
              Currently, our app does not offer live delivery tracking. However,
              we are committed to ensuring your orders are delivered on time. If
              you have any concerns about your delivery, feel free to contact
              our customer support team for updates and assistance.
            </Text>

            <Text
              style={[styles.normalText, {fontWeight: 'bold', marginTop: 15}]}>
              What if I need to pause delivery during my vacation?
            </Text>
            <Text style={styles.normalText}>
              You can use the{' '}
              <Text style={{fontWeight: 'bold'}}>Mark Vacation</Text> option in
              the app to specify the days you'll be away. Deliveries will
              automatically resume after the selected dates.
            </Text>
          </View>
        )}

        {/* Section: Payments */}
        {activeSection !== 'Payments' ? (
          // Card view when inactive
          <TouchableOpacity
            onPress={() => handleSectionToggle('Payments')}
            style={styles.card}>
            <Text style={styles.title}>Payments</Text>
            <Text style={styles.description}>
              Wallet usage, payment deductions, and refund policies.
            </Text>
          </TouchableOpacity>
        ) : (
          // Content view when active
          <View style={styles.aboutContainer}>
            {/* Tap on header to collapse */}
            <TouchableOpacity onPress={() => handleSectionToggle(null)}>
              <Text style={styles.sectionTitle}>Payments</Text>
            </TouchableOpacity>

            <Image
              source={imagePaths.Help_payment}
              style={{width: '100%', height: '12%', resizeMode: 'contain'}}
            />

            <Text style={styles.normalText}>
              To get started, load your desired amount into the 6 am Wallet.
              Once funded, select your products, set your delivery routine
              (daily, alternate days, or custom), and leave the rest to us.
              Payments are only deducted after your order is successfully
              delivered, ensuring a seamless and transparent experience.
            </Text>

            <Text
              style={[styles.normalText, {fontWeight: 'bold', marginTop: 15}]}>
              Can I choose products first and then load my wallet?
            </Text>
            <Text style={styles.normalText}>
              Absolutely! The app is designed to work both ways for your
              convenience. You can either select your products and set your
              delivery routine first, then load the required amount into your
              wallet, or you can load your wallet in advance and choose the
              desired products and quantities later. Either way, we'll ensure that
              your orders are processed and delivered seamlessly.
            </Text>

            <Text
              style={[styles.normalText, {fontWeight: 'bold', marginTop: 15}]}>
              What happens if I need a replacement or refund for an item?
            </Text>
            <Text style={styles.normalText}>
              If you're not satisfied with a delivered item, you can request a
              replacement or refund. Refunds will be credited directly to your 6
              AM Wallet, allowing you to use the amount for future purchases.
              Our goal is to ensure your satisfaction with every order.
            </Text>

            <Text
              style={[styles.normalText, {fontWeight: 'bold', marginTop: 15}]}>
              Can I get a refund for the amount loaded in my wallet?
            </Text>
            <Text style={styles.normalText}>
              The amount loaded into your 6 am Wallet is non-refundable. For
              more details, please refer to our refund policy. However, your
              wallet balance remains secure and can be used for future
              purchases.
            </Text>
          </View>
        )}

        {/* Section: Customer Care */}

        {activeSection !== 'CustomerCare' ? (
          // Show card when not active
          <TouchableOpacity
            onPress={() => handleSectionToggle('CustomerCare')}
            style={styles.card}>
            <Text style={styles.title}>Customer Care</Text>
            <Text style={styles.description}>
              How to contact support, report issues, and resolve concerns.
            </Text>
          </TouchableOpacity>
        ) : (
          // Show expanded content when active
          <View style={styles.aboutContainer}>
            {/* Tappable title to go back */}
            <TouchableOpacity onPress={() => handleSectionToggle(null)}>
              <Text style={styles.sectionTitle}>Customer Care</Text>
            </TouchableOpacity>

            <Image
              source={imagePaths.Help_CustomerCare}
              style={{width: '100%', height: '30%', resizeMode: 'stretch'}}
            />

            <Text
              style={[styles.normalText, {fontWeight: 'bold', marginTop: 10}]}>
              How can I contact customer support?
            </Text>
            <Text style={styles.normalText}>You can reach us via:</Text>

            {/* Phone 1 */}
            <Text
              style={styles.linkText}
              onPress={() => Linking.openURL('tel:+918111075075')}>
              📞 +91 81110 75075 (5.45AM to 9PM)
            </Text>

            {/* Phone 2 */}
            <Text
              style={styles.linkText}
              onPress={() => Linking.openURL('tel:+918111074074')}>
              📞 +91 81110 74074
            </Text>

            {/* Email */}
            <Text
              style={styles.linkText}
              onPress={() => Linking.openURL('mailto:support@6am.co.in')}>
              📧{' '}
              <Text style={{textDecorationLine: 'underline'}}>
                support@6am.co.in
              </Text>
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(1),
    // backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
 backIcon: {
    width: wp(3),
    height: wp(3),
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 32,
  },
  card: {
    borderWidth: 1,
    borderColor: '#734CC9',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#888',
    fontWeight: '400',
  },
  aboutContainer: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    marginBottom: 16,
  },
  greenBox: {
    flexDirection: 'row',
    backgroundColor: '#C7F5C4',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  greenTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  greenSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  greenTagline: {
    fontSize: 12,
    color: '#2E7D32',
    marginTop: 4,
  },
  cowImage: {
    width: '100%',
    height: '25%',
    resizeMode: 'stretch',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  normalText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 20,
    marginBottom: 10,
  },
  bulletText: {
    fontSize: 13,
    color: '#444',
    paddingLeft: 8,
    marginBottom: 4,
  },
  linkText: {
    fontSize: 13,
    color: '#007AFF', // iOS blue link color
    marginTop: 5,
    // textDecorationLine: 'underline',
  },
});

export default HelpAndFAQScreen;
