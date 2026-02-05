import React from 'react';
import { History } from 'lucide-react';

const VersioningStrategies = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <History className="w-5 h-5 text-slate-400" /> Versioning Strategies
      </h2>
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg text-sm text-slate-300 space-y-4">
        <p>
            We recommend a semantic versioning approach for velocity models:
        </p>
        <ul className="list-disc list-inside pl-4 space-y-2">
            <li><strong>v1.0.0</strong> - First regional trend established.</li>
            <li><strong>v1.1.0</strong> - Added new wells from Phase 2 campaign.</li>
            <li><strong>v2.0.0</strong> - Major methodology change (e.g., switching from Linear to Anisotropic).</li>
        </ul>
        <p className="text-slate-500 italic mt-4">
            Tip: Lock versions once they have been used for a major milestone (e.g., FDP submission) to ensure reproducibility.
        </p>
      </div>
    </div>
  );
};

export default VersioningStrategies;