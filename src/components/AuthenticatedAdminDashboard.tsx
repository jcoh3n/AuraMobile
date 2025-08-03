import React from 'react';
import AuthWrapper from './AuthWrapper';
import ModernAdminDashboard from './ModernAdminDashboard';

interface AuthenticatedAdminDashboardProps {
  onClose?: () => void;
}

const AuthenticatedAdminDashboard: React.FC<AuthenticatedAdminDashboardProps> = ({ onClose }) => {
  return (
    <AuthWrapper onBack={onClose}>
      <ModernAdminDashboard onClose={onClose} />
    </AuthWrapper>
  );
};

export default AuthenticatedAdminDashboard;