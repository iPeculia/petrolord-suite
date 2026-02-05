import React from 'react';
import { Layers, ArrowDown } from 'lucide-react';

const PreStackDepthMigrationGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Layers className="w-6 h-6 text-blue-500"/> PSDM Velocity Workflows
      </h2>
      <div className="space-y-4 text-sm text-slate-300">
        <p>
            Pre-Stack Depth Migration (PSDM) requires an interval velocity model in depth (not time). The model is iteratively updated to flatten gathers.
        </p>
        
        <div className="flex flex-col gap-2 border-l-2 border-slate-800 pl-4">
            <div className="flex items-center gap-2">
                <div className="bg-blue-900/50 p-2 rounded text-blue-300 font-bold">1</div>
                <span>Initial Model Building (Tomography or Smoothing Stacking Velocities)</span>
            </div>
            <ArrowDown className="w-4 h-4 text-slate-600 ml-4" />
            <div className="flex items-center gap-2">
                <div className="bg-blue-900/50 p-2 rounded text-blue-300 font-bold">2</div>
                <span>Migration & Residual Moveout Analysis (RMO)</span>
            </div>
            <ArrowDown className="w-4 h-4 text-slate-600 ml-4" />
            <div className="flex items-center gap-2">
                <div className="bg-blue-900/50 p-2 rounded text-blue-300 font-bold">3</div>
                <span>Tomographic Update (Grid or Layer-based)</span>
            </div>
            <ArrowDown className="w-4 h-4 text-slate-600 ml-4" />
            <div className="flex items-center gap-2">
                <div className="bg-blue-900/50 p-2 rounded text-blue-300 font-bold">4</div>
                <span>Well Calibration (Anisotropy Update)</span>
            </div>
        </div>

        <p className="mt-4 bg-slate-900 p-3 rounded border border-slate-800 text-slate-400">
            <strong>Note:</strong> PSDM velocities are "imaging velocities". They may not match "well velocities" perfectly due to anisotropy (epsilon/delta). Always check well misties after PSDM.
        </p>
      </div>
    </div>
  );
};

export default PreStackDepthMigrationGuide;