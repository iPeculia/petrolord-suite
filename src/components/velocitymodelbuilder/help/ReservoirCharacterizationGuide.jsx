import React from 'react';
import { Database } from 'lucide-react';

const ReservoirCharacterizationGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Database className="w-6 h-6 text-orange-400"/> Reservoir Characterization
      </h2>
      <div className="bg-slate-900 p-6 rounded border border-slate-800 text-sm text-slate-300 space-y-4">
        <p>
            Velocity is not just for depth conversion; it is a lithology and fluid indicator.
        </p>
        <ul className="list-disc pl-5 space-y-2">
            <li><strong>Vp/Vs Ratio:</strong> A key lithology discriminator. Sandstones (~1.6), Shales (~1.8-2.0), Carbonates (~1.9).</li>
            <li><strong>Fluid Effects:</strong> Gas saturation dramatically drops Vp (Gassmann effect), creating "bright spots" or AVO anomalies. Velocity models must account for this to avoid structural "push-down" artifacts.</li>
            <li><strong>Pore Pressure:</strong> High pressure preserves porosity, leading to lower velocities than normally compacted rock at the same depth.</li>
        </ul>
      </div>
    </div>
  );
};

export default ReservoirCharacterizationGuide;