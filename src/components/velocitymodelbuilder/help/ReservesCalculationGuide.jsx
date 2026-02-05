import React from 'react';
import { Coins } from 'lucide-react';

const ReservesCalculationGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Coins className="w-6 h-6 text-yellow-400"/> Reserves Calculation & Depth
      </h2>
      <div className="bg-slate-900 p-6 rounded border border-slate-800 space-y-4 text-sm text-slate-300">
        <p>
            <strong>Gross Rock Volume (GRV)</strong> is the most sensitive parameter in reserves calculation, and it depends entirely on the velocity model.
        </p>
        <div className="bg-slate-950 p-4 rounded border border-slate-800">
            <h4 className="text-emerald-400 font-bold mb-2">The "Spill Point" Multiplier</h4>
            <p>
                In low-relief structures, a 1% velocity error can shift the depth by 30m. If the structure height is only 50m, this error can wipe out 60% of the reserves or double them.
            </p>
        </div>
        <p>
            <strong>Recommendation:</strong> Never use a single deterministic velocity model for reserves. Always use probabilistic methods (P10/P90) to capture GRV uncertainty.
        </p>
      </div>
    </div>
  );
};

export default ReservesCalculationGuide;