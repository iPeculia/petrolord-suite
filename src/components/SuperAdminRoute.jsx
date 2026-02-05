import React from 'react';
    import { Navigate, useLocation } from 'react-router-dom';
    import { useAuth } from '@/contexts/SupabaseAuthContext';

    const SuperAdminRoute = ({ children }) => {
      const { user, loading, isSuperAdmin } = useAuth();
      const location = useLocation();

      if (loading) {
        return null; // The AuthGuard will handle the loading state
      }

      if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
      }

      if (!isSuperAdmin) {
        return <Navigate to="/dashboard" replace />;
      }

      return children;
    };

    export default SuperAdminRoute;