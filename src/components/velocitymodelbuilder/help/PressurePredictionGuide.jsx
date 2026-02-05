import React from 'react';
import { Gauge } from 'lucide-react';

const PressurePredictionGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Gauge className="w-6 h-6 text-red-500"/> Pressure Prediction Workflows
        </h2>
        <div className="prose prose-invert max-w-none text-sm text-slate-300">
            <p>
                Seismic velocity is the primary tool for pre-drill pore pressure prediction (PPP).
            </p>
            <h4 className="text-white font-bold mt-4">The Principle</h4>
            <p>
                Normally compacted sediments follow a "Normal Compaction Trend" (NCT). Deviations from this trend (slower velocities) usually indicate under-compaction and overpressure.
            </p>
            <h4 className="text-white font-bold mt-4">Common Methods</h4>
            <ul>
                <li><strong>Eaton's Method:</strong> Empirical relationship using velocity ratio (V_obs / V_nct).</li>
                <li><strong>Bowers' Method:</strong> Accounts for unloading (fluid expansion) vs. compaction disequilibrium.</li>
            </ul>
        </div>
    </div>
  );
};

export default PressurePredictionGuide;