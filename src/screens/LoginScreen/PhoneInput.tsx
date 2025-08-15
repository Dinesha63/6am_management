import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import SimCardsManager from 'react-native-sim-cards-manager';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rs,
} from '../../constants/ResponsiveScreen';


interface SimCard {
phoneNumber: string;
  carrierName?: string;
  countryIso?: string;
  displayName?: string;
  iccId?: string;
  mcc?: string;
  mnc?: string;
  slotIndex?: number;
  subscriptionId?: number;
}

const getPhoneNumber = async (): Promise<string> => {
  console.log('[PhoneNumber] Starting phone number retrieval...');

  try {
    if (Platform.OS === 'android') {
      console.log('[PhoneNumber] Android platform detected');

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
      );

      console.log(`[PhoneNumber] Permission status: ${granted}`);

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('[PhoneNumber] Permission granted, fetching SIM cards...');
        const simCards: SimCard[] = await SimCardsManager.getSimCards();

        console.log('[PhoneNumber] Retrieved SIM cards:', JSON.stringify(simCards, null, 2));

        if (simCards.length > 0) {
          const firstSim = simCards[1] || simCards[0]; // Fallback to simCards[0] if [1] is undefined
          const secondSim = simCards[0];

          console.log(`[PhoneNumber] First SIM details: ${JSON.stringify(firstSim)}`);

          if (firstSim.phoneNumber) {
            console.log(`[PhoneNumber] Retrieved phone number: ${firstSim.phoneNumber}`);
            console.log(`[PhoneNumber] Retrieved 2 phone number: ${secondSim.phoneNumber}`);
            return firstSim.phoneNumber;
          } else {
            console.warn('[PhoneNumber] SIM exists but phone number is empty');
            throw new Error('Phone number not available on SIM');
          }
        } else {
          console.log('[PhoneNumber] No SIM cards found');
          throw new Error('No SIM card detected');
        }
      } else {
        console.warn('[PhoneNumber] Permission denied by user');
        throw new Error('Permission denied');
      }
    } else {
      console.log('[PhoneNumber] iOS platform detected - not supported');
      throw new Error('Phone number access not supported on iOS');
    }
  } catch (error) {
    console.error('[PhoneNumber] Error:', error);
    throw error;
  }
};

const SplashScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
console.log(phoneNumber,error,isLoading, "loadidnfdfn")
  useEffect(() => {
    let isMounted = true;

    const fetchPhoneNumber = async () => {
      try {
        const number = await getPhoneNumber();
        if (isMounted) {
          setPhoneNumber(number);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message);
          setPhoneNumber(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPhoneNumber();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Fetching phone number...</Text>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          {phoneNumber ? (
            <Text style={styles.successText}>
              Detected Phone Number: {phoneNumber}
            </Text>
          ) : (
            <Text style={styles.errorText}>
              {error || 'Unable to detect phone number'}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: rs(20),
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: rs(10),
    fontSize: sp(16),
  },
  resultContainer: {
    alignItems: 'center',
  },
  successText: {
    fontSize: sp(18),
    color: 'green',
    textAlign: 'center',
  },
  errorText: {
    fontSize: sp(16),
    color: 'red',
    textAlign: 'center',
  },
});

export default SplashScreen;
