import React from 'react';
import MBADataImporter from '../MBADataImporter';
import DataQualityPanel from '../DataQualityPanel';
import TankSetupForm from '../TankSetupForm';
import ContactSetupPanel from '../ContactSetupPanel';
import MBHistoryPlots from '../plots/MBHistoryPlots';
import PVTPlots from '../plots/PVTPlots';
import ContactHistoryPlot from '../plots/ContactHistoryPlot';

const DataTankSetupTab = () => {
  return (
    <div className="p-4 h-full overflow-hidden flex flex-col">
      <div className="grid grid-cols-12 gap-4 h-full min-h-0">
        
        {/* LEFT COLUMN: INPUT & QC (3/12) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-y-auto pr-1">
          <MBADataImporter />
          <DataQualityPanel />
        </div>

        {/* CENTER COLUMN: PLOTS (6/12) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 h-full min-h-0 overflow-y-auto pr-1">
          <div className="h-80 shrink-0">
            <MBHistoryPlots />
          </div>
          <div className="h-64 shrink-0">
            <PVTPlots />
          </div>
          <div className="shrink-0">
            <ContactHistoryPlot />
          </div>
        </div>

        {/* RIGHT COLUMN: SETUP FORMS (3/12) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col h-full min-h-0 overflow-y-auto">
          <TankSetupForm />
          <ContactSetupPanel />
        </div>

      </div>
    </div>
  );
};

export default DataTankSetupTab;