import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { checkWellRLSPolicies } from '@/utils/wellSecurityFix';

const WellSecurityGuard = ({ children }) => {
  const [status, setStatus] = useState('checking');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const check = async () => {
      const result = await checkWellRLSPolicies();
      if (result.status === 'error' && result.message.includes('row-level security')) {
        setStatus('error');
        setErrorMsg("Database RLS policies are preventing access to wells.");
      } else {
        setStatus('ok');
      }
    };
    check();
  }, []);

  if (status === 'error') {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Security Policy Restriction</AlertTitle>
          <AlertDescription>
            {errorMsg}. Please contact an administrator to verify your project ownership.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};

export default WellSecurityGuard;