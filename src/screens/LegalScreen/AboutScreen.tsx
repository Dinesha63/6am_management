import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {imagePaths} from '../../utils/constants/imagePaths';
import {hp, wp} from '../../utils/constants/responsive';

const AboutScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Image source={imagePaths.back_icon}
          style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}>
          At 6 am, we believe in starting your day with the best. Managed by Just
          Farm Fresh Private Limited, Coimbatore, we are committed to delivering
          farm-fresh milk, high-quality daily essentials, and unmatched
          convenience right to your doorstep.
        </Text>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.text}>
          Our mission is simple: to make your mornings easier and healthier by
          providing fresh, natural, and unadulterated products. We connect you
          directly with trusted farmers, ensuring that every product you receive
          is pure, fresh, and full of nutrition.
        </Text>
        <Text style={styles.sectionTitle}>What We Offer</Text>
        <Text style={styles.text}>
          • Farm-Fresh Milk: Delivered within hours of milking, ensuring maximum
          freshness.{'\n'}• Daily Essentials: From dairy to fresh fruits,
          vegetables, and groceries, we’ve got you covered.{'\n'}• Convenience
          at Your Fingertips: With our user-friendly app, you can browse, order,
          and manage subscriptions effortlessly.
        </Text>
        <Text style={styles.sectionTitle}>Why Choose 6 am?</Text>
        <Text style={styles.text}>
          • Uncompromised Quality: Every product undergoes rigorous quality
          checks.{'\n'}• Timely Deliveries: Wake up to Fresh Deliveries every
          morning.{'\n'}• Sustainability Focus: We prioritize eco-friendly
          practices and support local farmers.
        </Text>
        <Text style={styles.text}>
          Join the 6 am family and experience the joy of fresh, healthy living
          every day.
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
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    color: '#333',
    marginBottom: 10,
    lineHeight: 22,
  },
});

export default AboutScreen;
