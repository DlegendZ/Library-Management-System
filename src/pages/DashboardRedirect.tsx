import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const DashboardRedirect: React.FC = () => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  switch (user?.role_id) {
    case 1:
      return <Navigate to="/admin" replace />;
    case 2:
      return <Navigate to="/librarian" replace />;
    case 3:
      return <Navigate to="/member" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default DashboardRedirect;
