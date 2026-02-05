import React from 'react';
import DriveMechanismHelper from '../DriveMechanismHelper';
import MBDiagnosticPlots from '../plots/MBDiagnosticPlots';
import ContactConsistencyPanel from '../ContactConsistencyPanel';

const DiagnosticsTab = () => {
  return (
    <div className="p-4 h-full overflow-hidden flex flex-col">
      <div className="grid grid-cols-12 gap-4 h-full min-h-0">
        
        {/* LEFT COLUMN: DRIVE ID (3/12) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col h-full min-h-0 overflow-hidden">
          <DriveMechanismHelper />
        </div>

        {/* CENTER COLUMN: PLOTS (6/12) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col h-full min-h-0 overflow-hidden">
          <MBDiagnosticPlots />
        </div>

        {/* RIGHT COLUMN: CONSISTENCY (3/12) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col h-full min-h-0 overflow-hidden">
          <ContactConsistencyPanel />
        </div>

      </div>
    </div>
  );
};

export default DiagnosticsTab;