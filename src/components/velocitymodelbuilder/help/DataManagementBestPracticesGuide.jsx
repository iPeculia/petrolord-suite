import React from 'react';
import { FolderTree } from 'lucide-react';

const DataManagementBestPracticesGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <FolderTree className="w-6 h-6 text-blue-400"/> Data Management Best Practices
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 p-4 rounded border border-slate-800">
            <h3 className="text-white font-bold mb-2">Naming Conventions</h3>
            <p className="text-xs text-slate-400">
                Standardize! e.g., `WellName_RunID_Date_Version`. <br/>
                Example: `Oseberg-East_Vint_2024-11_v03.las`
            </p>
        </div>
        <div className="bg-slate-900 p-4 rounded border border-slate-800">
            <h3 className="text-white font-bold mb-2">Master Well Database</h3>
            <p className="text-xs text-slate-400">
                Maintain a "Gold Standard" set of QC'd checkshots. Do not allow users to import ad-hoc spreadsheets without validation.
            </p>
        </div>
        <div className="bg-slate-900 p-4 rounded border border-slate-800">
            <h3 className="text-white font-bold mb-2">Versioning</h3>
            <p className="text-xs text-slate-400">
                Velocity models evolve. Keep snapshots of the model used for each major drill decision. Never overwrite the "Final" model.
            </p>
        </div>
      </div>
    </div>
  );
};

export default DataManagementBestPracticesGuide;