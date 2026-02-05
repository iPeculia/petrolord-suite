import React from 'react';
import { DollarSign } from 'lucide-react';

const EconomicsAndCostAnalysisGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <DollarSign className="w-6 h-6 text-emerald-400"/> Economics & ROI
      </h2>
      <div className="bg-slate-900 p-6 rounded border border-slate-800 text-sm text-slate-300">
        <p className="mb-4">
            The cost of a dry hole due to depth error ($50M+) dwarfs the cost of velocity modeling software.
        </p>
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded">
                <h4 className="text-white font-bold">Value of Information (VOI)</h4>
                <p className="text-xs text-slate-400">
                    Accurate depth conversion can increase P90 reserves estimates, potentially making a marginal project economic.
                </p>
            </div>
            <div className="bg-slate-950 p-4 rounded">
                <h4 className="text-white font-bold">Efficiency Savings</h4>
                <p className="text-xs text-slate-400">
                    Automating checkshot QC saves approx. 400 geoscientist-hours per year for a mid-sized team.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EconomicsAndCostAnalysisGuide;