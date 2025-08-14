import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
  ToastAndroid,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchNotificationSetting,
  updateNotificationSetting,
} from '../../redux/Features/NotificationSetting/notificationSettingThunk';
import { clearNotificationSetting } from '../../redux/Features/NotificationSetting/notificationSettingSlice';
import Header from './Header';
import SimpleIcon from '../../components/SimpleIcon';
import { imagePaths } from '../../utils/constants/imagePaths';
import Colors from '../../utils/constants/colors';
import {
  getResponsiveWidth as wp,
  getResponsiveHeight as hp,
  getResponsiveFontSize as sp,
} from '../../utils/constants/responsiveScreen';
import { getStoredPhoneNumber } from '../../config/storage';

type RootStackParamList = {
  ManageNotifications: { phoneNumber: string };
  // ... other screens
};

const ManageNotifications: React.FC = () => {
  // 1) grab params safely
  const route = useRoute<RouteProp<RootStackParamList, 'ManageNotifications'>>();
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  useEffect(() => {
    getStoredPhoneNumber().then((phone) => {
      if (phone) setPhoneNumber(phone);
    });
  }, []);

  console.log('ManageNotifications phoneNumber:', phoneNumber);

  const dispatch = useAppDispatch();

  // pull in loading / data / errors
  const {
    setting,
    loading,
    error,
    updating,
    updateError,
    updateSuccess,
  } = useAppSelector((s) => s.notificationSetting);

  // local toggles
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);

  // 1️⃣ fetch on mount
  useEffect(() => {
    if (phoneNumber) {
      dispatch(fetchNotificationSetting(phoneNumber));
    }
  }, [dispatch, phoneNumber]);

  // 2️⃣ sync local state when we get setting back
  useEffect(() => {
    if (setting) {
      setSmsEnabled(setting.sms);
      setEmailEnabled(setting.email);
    }
  }, [setting]);

  // 3️⃣ handle save success / error
  useEffect(() => {
    if (updateSuccess) {
      Alert.alert('Success', 'Notification settings saved.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
      dispatch(clearNotificationSetting());
    } else if (updateError) {
     ToastAndroid.show(`Error: ${updateError}`, ToastAndroid.SHORT);
    }
  }, [updateSuccess, updateError, dispatch, navigation]);

  const onSave = () => {
    if (phoneNumber) {
      dispatch(updateNotificationSetting({ phoneNumber, sms: smsEnabled, email: emailEnabled }));
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: wp(4) }}>
        <Text style={{ textAlign: 'center', color: 'red' }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <Header />

      <View style={{ flex: 1, backgroundColor: Colors.white, paddingVertical: hp(1) }}>
        {/* SMS toggle */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: wp(5),
            paddingVertical: hp(2),
            borderBottomWidth: 1,
            borderBottomColor: Colors.greyBackground,
          }}
        >
          <SimpleIcon source={imagePaths.Sms_icon} style={{ width: wp(6.4), height: wp(6.4) }} />
          <Text style={{ flex: 1, fontSize: sp(18), marginLeft: wp(4), paddingLeft: wp(8) }}>
            SMS Notifications
          </Text>
          <Switch
            value={smsEnabled}
            onValueChange={setSmsEnabled}
            trackColor={{ false: Colors.greyBackground, true: Colors.primary }}
            thumbColor={Colors.white}
            ios_backgroundColor={Colors.greyBackground}
          />
        </View>

        {/* Email toggle */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: wp(5),
            paddingVertical: hp(2),
            borderBottomWidth: 1,
            borderBottomColor: Colors.greyBackground,
          }}
        >
          <SimpleIcon source={imagePaths.Email_icon} style={{ width: wp(6.4), height: wp(6.4) }} />
          <Text style={{ flex: 1, fontSize: sp(18), marginLeft: wp(4), paddingLeft: wp(8) }}>
            Email Notifications
          </Text>
          <Switch
            value={emailEnabled}
            onValueChange={setEmailEnabled}
            trackColor={{ false: Colors.greyBackground, true: Colors.primary }}
            thumbColor={Colors.white}
            ios_backgroundColor={Colors.greyBackground}
          />
        </View>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: Colors.primary,
          marginHorizontal: wp(4),
          marginBottom: hp(2),
          paddingVertical: hp(2),
          borderRadius: wp(2),
          alignItems: 'center',
        }}
        onPress={onSave}
        disabled={updating}
      >
        {updating ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={{ color: Colors.white, fontSize: sp(16), fontWeight: '600' }}>
            SAVE
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ManageNotifications;