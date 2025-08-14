/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import Colors from '../../utils/constants/colors';
import NavigationHeader from './ManageProducts/Header';
import RadioOptions from './Components/RadioButtons';
import ActionButtons from './Components/SubscriptionButtons';
import { RadioOption, RootStackParamList } from '../../types/index';
import { FontFamily } from '../../utils/constant';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
  getResponsiveSpacing as rsp,
} from '../../utils/constants/responsiveScreen';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppDispatch, RootState } from '../../redux/store';
import { cancelAllSubscriptions, fetchCancelReasons } from '../../redux/Features/Customer/customerSubscriptionThunk';
import { getStoredPhoneNumber } from '../../config/storage';
import { Routes } from '../../navigation/routes';


const CancelSubscription: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [otherText, setOtherText] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  // const navigation = useNavigation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { reasons, loading, error } = useSelector((state: RootState) => state.customerSubscription.cancelReason);
  console.log(reasons, ": reasons")

  useEffect(() => {
    console.log('🔄 Calling fetchCancelReasons...');
    dispatch(fetchCancelReasons());
  }, [dispatch]);


  const options: RadioOption[] = reasons?.map((reason, index) => ({
    id: `reason_${index}`,
    label: reason,
    hasInput: reason === 'Other, Please Specify'
  })) || [];

  const handleSelect = (id: string) => {
    setSelectedOption(id === selectedOption ? null : id);
  };

  const isProceedEnabled = () => {
    if (!selectedOption) return false;

    // Check if selected option has input field
    const selectedOptionData = options.find(option => option.id === selectedOption);
    if (selectedOptionData?.hasInput) {
      // For "Other, Please Specify", require trimmed text
      return otherText.trim().length > 0;
    }

    // For other options, just having selectedOption is enough
    return true;
  };


  const handleCancelSubscriptions = async () => {
    setCancelLoading(true);
    try {
      const phoneNumber = await getStoredPhoneNumber();

      if (!phoneNumber) {
        console.log('Error', 'Phone number not found.');
        return;
      }


      const selectedOptionData = options.find(option => option.id === selectedOption);
      const cancelReason = selectedOptionData?.hasInput ? otherText.trim() : selectedOptionData?.label || '';
      console.log(cancelReason, ": cancelReason");

console.log("phoneNumber and cancelReason : ", phoneNumber , cancelReason )




      const result = await dispatch(cancelAllSubscriptions({ phoneNumber, cancelReason: cancelReason }));
      console.log('📦 [CANCEL] Dispatch result:', result);
      if(result){
        
        navigation.replace('Main', { screen: 'Account' });
      }
      
    } catch (err) {
      console.error('💥 [CANCEL] Exception caught:', err);
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <ScrollView style={{ marginBottom: 15 }}>
      <View style={styles.container}>
        <NavigationHeader title="Cancel Subscription" />
        <View style={styles.TextContainer1}>
          <Text style={styles.text1}>We're sorry to see you go!</Text>
        </View>
        <View style={styles.subText1}>
          <Text style={{ fontWeight: '500' }}>
            Before you cancel, please let us know how we can
          </Text>
          <Text style={styles.subText2}>improve your experience.</Text>
        </View>
        <View>
          <RadioOptions
            options={options}
            selectedOption={selectedOption}
            onSelect={handleSelect}
            otherText={otherText}
            setOtherText={setOtherText}
          />
        </View>
        <View>
          <Text style={styles.text3}>Are you sure you want to Leave?</Text>
          <Text style={styles.lastText}>
            We're bringing you more fresh products directly from framers to
            serve you better!
          </Text>
        </View>
        <ActionButtons
          selectedOption={isProceedEnabled() ? selectedOption : null}
          onCancel={() => {
            console.log(
              selectedOption === 'break'
                ? 'Pause Subscription button clicked'
                : selectedOption === 'moving'
                  ? 'Explore our other Store Areas button clicked'
                  : 'Keep My Subscription button clicked',
            );
          }}
          onProceed={handleCancelSubscriptions}
          button2Disabled={cancelLoading}
          button2TextDisabled={cancelLoading}
        />
        {cancelLoading && <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 20 }} />}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: hp(2),
  },
  container1: {
    marginTop: hp(4.5),
    borderWidth: 1,
    borderColor: Colors.lineLight,
    borderRadius: wp(5),        
    width: wp(83),
    alignSelf: 'center',
  },
  text1: {
    fontSize: sp(16),
    fontFamily: 'System',
    fontWeight: '600',
  },
  subText1: {
    marginTop: hp(1),
    width: wp(81),
    alignSelf: 'center',
  },
  subText2: {
    textAlign: 'center',
    fontWeight: '500',
  },
  TextContainer1: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(0.2),
  },
  line: {
    height: 1,
    backgroundColor: Colors.lineLight,
    width: '100%',
  },
  text3: {
    marginTop: hp(3),
    marginLeft: wp(10),
    fontWeight: '700',
  },
  lastText: {
    width: wp(70),
    alignSelf: 'center',
    marginTop: hp(1.5),
    fontWeight: '500',
  },
  button2Disabled: {
    backgroundColor: Colors.lightGrey,
  },
  button2TextDisabled: {
    color: Colors.grey,
  },
});

export default CancelSubscription;
