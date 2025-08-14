import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types';
import {imagePaths} from '../../utils/constants/imagePaths';
import {hp, wp} from '../../utils/constants/responsive';
import SimpleIcon from '../../components/SimpleIcon';

const LegalScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{...styles.backButton}}>
            <SimpleIcon
           source={imagePaths.back_icon} 
           style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Legal</Text>
      </View>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('AboutScreen', undefined)}>
          <Text style={styles.cardTitle}>About Us</Text>
          <Text style={styles.cardSubtitle}>Fresh-ah Direct-ah</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('PrivacyPolicyScreen', undefined)}>
          <Text style={styles.cardTitle}>Privacy Policy</Text>
          <Text style={styles.cardSubtitle}>Your privacy is our priority.</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            navigation.navigate('TermsAndConditionsScreen', undefined)
          }>
          <Text style={styles.cardTitle}>Terms & Conditions</Text>
          <Text style={styles.cardSubtitle}>
            The rules for using our services.
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(1),
    paddingHorizontal: wp(1),
    backgroundColor: '#fff',
    position: 'relative',
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
  content: {
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#B39DDB',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#666',
  },
});

export default LegalScreen;
