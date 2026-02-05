import React from 'react';
import { useDeclineCurve } from '@/contexts/DeclineCurveContext';

// Placeholder for Phase 3 implementation - simplified for now as it requires well multi-select which is complex
const DCAGroupRollup = () => {
  return (
    <div className="p-4 text-center border border-dashed border-slate-800 rounded-lg bg-slate-900/30">
      <div className="text-sm text-slate-400 mb-2">Group Roll-up</div>
      <p className="text-xs text-slate-600">
        Multi-well forecasting and group aggregation coming in next update.
        Create groups to sum production forecasts.
      </p>
    </div>
  );
};

export default DCAGroupRollup;