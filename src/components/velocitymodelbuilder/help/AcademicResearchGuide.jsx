import React from 'react';
import { GraduationCap } from 'lucide-react';

const AcademicResearchGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <GraduationCap className="w-6 h-6 text-yellow-400"/> Academic Research Support
      </h2>
      <div className="bg-slate-900 p-6 rounded border border-slate-800 text-sm text-slate-300">
        <p>
            We support the academic community with free licenses for thesis research and teaching.
        </p>
        <h4 className="text-white font-bold mt-4 mb-2">Research Topics</h4>
        <ul className="list-disc pl-5 space-y-1">
            <li>Novel Anisotropy Parameter Estimation</li>
            <li>Machine Learning for Geopressure Prediction</li>
            <li>Full Waveform Inversion Algorithms</li>
        </ul>
        <p className="mt-4 text-slate-500 italic">
            Cite us as: "Modeled using Petrolord Velocity Builder v2025.1"
        </p>
      </div>
    </div>
  );
};

export default AcademicResearchGuide;