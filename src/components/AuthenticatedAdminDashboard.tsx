import React from 'react';
import AuthWrapper from './AuthWrapper';
import AdminDashboard from './AdminDashboard';

interface AuthenticatedAdminDashboardProps {
  onClose?: () => void;
}

const AuthenticatedAdminDashboard: React.FC<AuthenticatedAdminDashboardProps> = ({ onClose }) => {
  return (
    <AuthWrapper>
      <AdminDashboard onClose={onClose} />
    </AuthWrapper>
  );
};

export default AuthenticatedAdminDashboard;