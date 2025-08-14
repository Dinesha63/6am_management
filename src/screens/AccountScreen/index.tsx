import React from 'react';
import {View} from 'react-native';
import AccountHeader from './AccountHeader';
import AccountSummaryCards from './AccountSummaryCards';
import UserProfileCard from './UserProfileCard';
import AccountMenuList from './AccountMenuList';

interface AccountScreenProps {}

const AccountScreen: React.FC<AccountScreenProps> = () => {
  return (
    <View>
      <AccountHeader />
      <AccountSummaryCards />
      <UserProfileCard />
      <AccountMenuList />
    </View>
  );
};

export default AccountScreen;
