import React from 'react';
import { GitCommit } from 'lucide-react';

const WellCorrelationGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <GitCommit className="w-6 h-6 text-orange-400"/> Well Correlation Techniques
      </h2>
      <div className="prose prose-invert max-w-none text-sm text-slate-300">
        <p>
            Consistent well picks are the skeleton of any velocity model. Inconsistent picks create artificial velocity gradients.
        </p>
        <ul>
            <li><strong>Stratigraphic Correlation:</strong> Matching log character/patterns. Good for layer-cake geology.</li>
            <li><strong>Seismic-Guided Correlation:</strong> Using the seismic reflector to guide the pick between wells. Essential in complex structure.</li>
            <li><strong>Velocity-Based Validation:</strong> If a pick requires a physically impossible interval velocity (e.g., 8000 m/s in shale) to match, the pick or the well path is likely wrong.</li>
        </ul>
      </div>
    </div>
  );
};

export default WellCorrelationGuide;