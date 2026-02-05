import React from 'react';
import { Crosshair } from 'lucide-react';

const SeismicVelocityPickingGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Crosshair className="w-6 h-6 text-red-400"/> Seismic Velocity Picking
      </h2>
      <div className="bg-slate-900 p-6 rounded border border-slate-800">
        <p className="text-slate-400 text-sm mb-4">
            Seismic stacking velocities (Vrms) are derived from NMO correction analysis (semblance picking). While dense, they are not true interval velocities and contain anisotropy effects.
        </p>
        <div className="grid grid-cols-2 gap-6">
            <div>
                <h4 className="text-white font-bold mb-2">Manual Picking</h4>
                <p className="text-xs text-slate-400">Best for complex structures or noisy data. Analysts pick "bullseyes" on semblance plots representing primary reflections.</p>
            </div>
            <div>
                <h4 className="text-white font-bold mb-2">Automated Picking (ABO)</h4>
                <p className="text-xs text-slate-400">High-density automatic picking. Requires heavy smoothing and outlier removal (guided by horizons) to be useful for depth conversion.</p>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-800">
            <h4 className="text-white font-bold mb-2">Dix Conversion Pitfalls</h4>
            <p className="text-xs text-slate-400">
                Converting Vrms to Vint using the Dix Equation is unstable if Vrms picks are noisy. Small errors in Vrms result in huge, non-physical swings in Interval Velocity. Always smooth Vrms *before* Dix conversion.
            </p>
        </div>
      </div>
    </div>
  );
};

export default SeismicVelocityPickingGuide;