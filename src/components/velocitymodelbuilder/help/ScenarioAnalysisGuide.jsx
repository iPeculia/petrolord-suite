import React from 'react';
import { GitBranch, Target } from 'lucide-react';

const ScenarioAnalysisGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-blue-400" /> Scenario Analysis & Uncertainty
        </h2>
        
        <div className="prose prose-invert max-w-none text-slate-300 text-sm space-y-4">
            <p>
                Single deterministic models are rarely sufficient for critical decisions. Use the Scenario Manager to capture the range of uncertainty.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-slate-900 p-4 rounded border border-slate-800">
                    <div className="text-emerald-400 font-bold mb-2">P10 (Optimistic)</div>
                    <p className="text-xs text-slate-400">
                        "Fast" Velocity Model. Result: Shallowest depth conversion. 
                        <br/><em>Risk:</em> May overestimate gross rock volume if structure is smaller than expected.
                    </p>
                </div>
                <div className="bg-slate-900 p-4 rounded border border-slate-800">
                    <div className="text-blue-400 font-bold mb-2">P50 (Base Case)</div>
                    <p className="text-xs text-slate-400">
                        Best Technical Estimate. Derived from the mean of well control and calibrated to seismic.
                    </p>
                </div>
                <div className="bg-slate-900 p-4 rounded border border-slate-800">
                    <div className="text-red-400 font-bold mb-2">P90 (Pessimistic)</div>
                    <p className="text-xs text-slate-400">
                        "Slow" Velocity Model. Result: Deepest depth conversion.
                        <br/><em>Risk:</em> Spill point might be deeper, but structure volume is minimal.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ScenarioAnalysisGuide;