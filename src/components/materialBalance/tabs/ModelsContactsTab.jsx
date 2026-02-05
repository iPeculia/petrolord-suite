import React from 'react';
import MBModelFitting from '../MBModelFitting';
import ContactForecastPanel from '../ContactForecastPanel';
import TankSetupForm from '../TankSetupForm'; // Reusing setup form in read-only or edit mode for params

const ModelsContactsTab = () => {
  return (
    <div className="p-4 h-full overflow-hidden flex flex-col">
      <div className="grid grid-cols-12 gap-4 h-full min-h-0">
        
        {/* LEFT COLUMN: FITTING (3/12) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col h-full min-h-0 overflow-hidden">
          <MBModelFitting />
        </div>

        {/* CENTER COLUMN: CONTACTS (6/12) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col h-full min-h-0 overflow-hidden">
          <ContactForecastPanel />
        </div>

        {/* RIGHT COLUMN: PARAMETERS (3/12) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col h-full min-h-0 overflow-y-auto">
          {/* We can reuse TankSetupForm or create a read-only summary of active model params */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-xs text-slate-400">
            <h3 className="font-bold text-slate-300 mb-2 uppercase">Active Parameters</h3>
            <p className="mb-2">Parameters fitted here will be used for forecasting.</p>
            {/* Ideally this shows the fitted N, m, We live values from context */}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ModelsContactsTab;