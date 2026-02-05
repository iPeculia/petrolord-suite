import React from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ModuleRoute = ({ children, moduleName }) => {
  const { userModules, loading, isSuperAdmin, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-lime-400"></div>
      </div>
    );
  }

  // Super Admins and the specific support account have universal access
  if (isSuperAdmin || user?.email === 'support@petrolord.com') {
    return children;
  }

  const hasAccess = userModules && userModules.includes(moduleName);

  if (!hasAccess) {
    return (
      <div className="p-8 text-white">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have access to the '{moduleName}' module. Please contact your organization's administrator if you believe this is an error.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return children;
};

export default ModuleRoute;