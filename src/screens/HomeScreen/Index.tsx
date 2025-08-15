import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import UnifiedDashboard from './UnifiedDashboard';

const HomeScreen: React.FC = () => {
  const userRole = useSelector((state: RootState) => state.user.userRole);

  // Use UnifiedDashboard for both admin and superAdmin roles
  if (userRole === 'admin' || userRole === 'superAdmin') {
    return <UnifiedDashboard userRole={userRole} />;
  }

  // Fallback for any other role
  return <UnifiedDashboard userRole="admin" />;
};

export default HomeScreen;
