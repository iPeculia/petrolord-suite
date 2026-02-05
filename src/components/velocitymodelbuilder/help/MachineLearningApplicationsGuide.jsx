import React from 'react';
import { BrainCircuit } from 'lucide-react';

const MachineLearningApplicationsGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <BrainCircuit className="w-6 h-6 text-purple-400"/> ML in Velocity Modeling
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Automated Layer Picking</h3>
            <p className="text-sm text-slate-400">
                Supervised learning models trained on thousands of well logs can auto-correlate formation tops, defining the velocity layers instantly across a basin.
            </p>
        </div>
        <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Velocity Trend Prediction</h3>
            <p className="text-sm text-slate-400">
                Regression forests can predict pseudo-velocity logs in wells with missing sonic data using Gamma Ray, Resistivity, and Neutron-Density inputs.
            </p>
        </div>
        <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Anomaly Detection</h3>
            <p className="text-sm text-slate-400">
                Unsupervised clustering identifies spatial velocity outliers that deviate significantly from regional geological trends, flagging them for QC.
            </p>
        </div>
      </div>
    </div>
  );
};

export default MachineLearningApplicationsGuide;