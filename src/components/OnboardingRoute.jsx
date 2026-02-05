import React from 'react';
    import { Navigate, useLocation } from 'react-router-dom';
    import { useAuth } from '@/contexts/SupabaseAuthContext';

    const OnboardingRoute = ({ children }) => {
      const { user, loading, profileSetupComplete } = useAuth();
      const location = useLocation();

      if (loading) {
        return null; // The AuthGuard will handle the loading state
      }

      if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
      }

      const needsOnboarding = user.invited_at && !profileSetupComplete;

      if (needsOnboarding) {
        return <Navigate to="/profile" state={{ from: location, onboarding: true }} replace />;
      }

      return children;
    };

    export default OnboardingRoute;