import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { usePurchasedModules } from '@/hooks/usePurchasedModules';
import { useAppsFromDatabase } from '@/hooks/useAppsFromDatabase';
import { getAppById as getStaticAppById } from '@/data/applications';
import AccessDenied from '@/components/AccessDenied';
import ComingSoon from '@/components/ComingSoon';
import { Loader2 } from 'lucide-react';

const AppRoute = ({ children, appName }) => {
  console.group(`🚦 [AppRoute] Rendering Route Wrapper for: ${appName}`);
  
  const auth = useAuth();
  const { user, isSuperAdmin, loading: authLoading } = auth;
  const { isAllowed, loading: entitlementsLoading, debugData, accessible_app_ids } = usePurchasedModules();
  const { apps, loading: appsLoading } = useAppsFromDatabase();
  const location = useLocation();

  // Task 3: Check database status first
  // We assume appName passed to AppRoute corresponds to either a module ID (slug) or an App ID (slug)
  
  // Helper to find app definition from DB or Static fallback
  const getAppDefinition = (id) => {
      if (!id) return undefined;
      // Try DB first
      if (apps && apps.length > 0) {
          const dbApp = apps.find(a => a.id === id || a.slug === id);
          if (dbApp) return dbApp;
      }
      // Fallback to static
      return getStaticAppById(id);
  };

  const appDefinition = getAppDefinition(appName);
  
  // Is this a Module Hub (e.g. 'geoscience') or a specific App?
  // We infer it's a module hub if appDefinition matches a module category or if it's found but is_built check is irrelevant for Hubs usually?
  // Actually, usually Hubs are containers. If 'appName' is 'geoscience', it might not be in master_apps if master_apps is strictly leaf nodes.
  // However, the prompt implies "AppRoute" logic should apply coming soon check.
  
  const isAppDefinitionLoaded = !appsLoading;
  const isBuilt = appDefinition ? appDefinition.is_built : true; // Default true if not found (might be a Hub not in apps table)
  const isComingSoon = appDefinition ? (appDefinition.status === 'coming_soon' || appDefinition.status === 'Coming Soon') : false;

  console.log('📦 [AppRoute] App Definition:', { 
      appName, 
      found: !!appDefinition, 
      isBuilt, 
      isComingSoon 
  });

  // Task 4: SUPER ADMIN BYPASS CHECK
  if (isSuperAdmin) {
      console.log('🛡️ [AppRoute] SUPER ADMIN BYPASS ACTIVE.');
      console.groupEnd();
      // Even Super Admins might want to see the Coming Soon page if they are testing?
      // Usually Super Admin wants to see the work in progress.
      // So we ALLOW access even if is_built=false for Super Admin.
      return children;
  }

  if (authLoading || entitlementsLoading || appsLoading) {
      console.log('⏳ [AppRoute] Loading dependencies...');
      console.groupEnd();
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950">
            <Loader2 className="w-8 h-8 animate-spin text-lime-500" />
        </div>
      );
  }

  if (!user) {
    console.log('🚫 [AppRoute] No user found. Redirecting.');
    console.groupEnd();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Task 3 Implementation: Check Build Status
  // If we found the app definition and it says it's not ready
  if (appDefinition && (!isBuilt || isComingSoon)) {
      console.warn('🚧 [AppRoute] App is not built or Coming Soon.');
      console.groupEnd();
      return <ComingSoon appName={appDefinition.app_name || appName} />;
  }

  // Permission Check
  let canAccess = isAllowed(appName);
  
  // Specific Seat Check Logic
  const isModuleHub = debugData?.purchasedItems?.modules?.has(appName?.toLowerCase());
  
  if (!isModuleHub && appName !== 'hse' && appDefinition) {
      const hasSeat = accessible_app_ids?.includes(appName?.toLowerCase()) || accessible_app_ids?.includes(appDefinition.id);
      if (!hasSeat) {
          canAccess = false;
      }
  }

  console.log('📝 [AppRoute] Decision:', { canAccess });
  console.groupEnd();

  if (!canAccess) {
      return (
        <AccessDenied 
            moduleId={appName} 
            appName={appDefinition?.app_name || appName} 
            debugInfo={{
                checkedId: appName,
                userModules: Array.from(debugData?.purchasedItems?.modules || []),
                isSuperAdmin: isSuperAdmin
            }}
        />
      );
  }

  return children;
};

export default AppRoute;