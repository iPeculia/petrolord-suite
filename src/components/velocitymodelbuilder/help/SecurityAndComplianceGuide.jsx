import React from 'react';
import { ShieldCheck, Lock, FileCheck, Globe } from 'lucide-react';

const SecurityAndComplianceGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-emerald-400" /> Security & Compliance
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-white font-medium">
                <Lock className="w-4 h-4 text-blue-400" /> Data Encryption
            </div>
            <p className="text-xs text-slate-400">
                All velocity data (wells, checkshots, models) is encrypted at rest (AES-256) and in transit (TLS 1.3). 
                Proprietary models are isolated in tenant-specific buckets.
            </p>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-white font-medium">
                <FileCheck className="w-4 h-4 text-blue-400" /> Audit Trails
            </div>
            <p className="text-xs text-slate-400">
                Every modification to a velocity model is logged. You can view the full history of who changed what parameter and when in the "Model History" tab, supporting SOX compliance.
            </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-white font-medium">
                <Globe className="w-4 h-4 text-blue-400" /> Data Residency
            </div>
            <p className="text-xs text-slate-400">
                Choose your data storage region (US, EU, APAC) to comply with GDPR and local data sovereignty laws regarding subsurface data.
            </p>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-dashed border-slate-700 p-6 rounded-lg text-center">
        <p className="text-slate-300 text-sm">
            Petrolord is SOC2 Type II compliant. For the full security whitepaper or to request a penetration test report, please contact your account manager.
        </p>
      </div>
    </div>
  );
};

export default SecurityAndComplianceGuide;