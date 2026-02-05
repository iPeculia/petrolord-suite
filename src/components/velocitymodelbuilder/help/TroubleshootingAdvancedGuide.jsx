import React from 'react';
import { Wrench } from 'lucide-react';

const TroubleshootingAdvancedGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Wrench className="w-6 h-6 text-slate-400"/> Advanced Troubleshooting
      </h2>
      <div className="bg-slate-900 p-6 rounded border border-slate-800 text-sm text-slate-300 space-y-4">
        <div className="border-b border-slate-800 pb-4">
            <h4 className="text-red-400 font-bold">"Grid Exploded" Error</h4>
            <p>Occurs when gridding algorithms (e.g., Minimum Curvature) overshoot in areas with no control points. Solution: Increase tension parameter or add "dummy" control points.</p>
        </div>
        <div className="border-b border-slate-800 pb-4">
            <h4 className="text-red-400 font-bold">Negative Depths</h4>
            <p>Usually caused by incorrect SRD (Seismic Reference Datum) settings. Ensure the Replacement Velocity (Vrep) is positive and consistent.</p>
        </div>
        <div>
            <h4 className="text-red-400 font-bold">WebGL Context Lost</h4>
            <p>Browser GPU memory limit reached. Try reducing the 3D viewer resolution or closing other WebGL tabs.</p>
        </div>
      </div>
    </div>
  );
};

export default TroubleshootingAdvancedGuide;