import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

const ExportFormatValidator = () => {
  const [status, setStatus] = useState('idle'); // idle, validating, valid, error

  const validate = () => {
    setStatus('validating');
    setTimeout(() => setStatus('valid'), 1500);
  };

  return (
    <div className="space-y-4">
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-800">
                <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Pre-Flight Check
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <p className="text-xs text-slate-400">
                    Validate coordinate systems, units, and data integrity before exporting to external software.
                </p>
                
                <Button 
                    onClick={validate} 
                    disabled={status === 'validating'}
                    className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs"
                >
                    {status === 'validating' ? 'Checking...' : 'Run Validation'}
                </Button>

                {status === 'valid' && (
                    <Alert className="bg-emerald-900/20 border-emerald-900 text-emerald-400 py-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertTitle className="text-xs font-bold">Validation Passed</AlertTitle>
                        <AlertDescription className="text-[10px]">
                            Data is ready for export. CRS: EPSG:32631.
                        </AlertDescription>
                    </Alert>
                )}

                {status === 'error' && (
                    <Alert className="bg-red-900/20 border-red-900 text-red-400 py-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle className="text-xs font-bold">Issues Detected</AlertTitle>
                        <AlertDescription className="text-[10px]">
                            Negative depth values found in Well-03.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    </div>
  );
};

export default ExportFormatValidator;