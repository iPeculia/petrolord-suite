import React from 'react';
import MBForecastPanel from '../MBForecastPanel';
import MBScenarioBuilder from '../MBScenarioBuilder';

const ForecastScenariosTab = () => {
  return (
    <div className="p-4 h-full overflow-hidden flex flex-col">
      <div className="grid grid-cols-12 gap-4 h-full min-h-0">
        
        {/* LEFT: FORECAST ENGINE (8/12) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col h-full min-h-0 overflow-hidden">
          <MBForecastPanel />
        </div>

        {/* RIGHT: SCENARIOS (4/12) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col h-full min-h-0 overflow-hidden">
          <MBScenarioBuilder />
        </div>

      </div>
    </div>
  );
};

export default ForecastScenariosTab;