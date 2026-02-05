import React from 'react';
import { ScanEye } from 'lucide-react';

const DepthMigrationQCGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <ScanEye className="w-6 h-6 text-purple-400"/> Depth Migration QC
      </h2>
      <div className="grid gap-4">
        <div className="bg-slate-900 p-4 rounded border border-slate-800">
            <h3 className="text-white font-bold mb-2">Common Image Gathers (CIGs)</h3>
            <p className="text-sm text-slate-400">
                The primary QC tool. Flat gathers = Correct Velocity. 
                <br/>Smiles (uphole curvature) = Velocity too slow.
                <br/>Frowns (downhole curvature) = Velocity too fast.
            </p>
        </div>
        <div className="bg-slate-900 p-4 rounded border border-slate-800">
            <h3 className="text-white font-bold mb-2">Well Markers in Depth</h3>
            <p className="text-sm text-slate-400">
                Overlay well tops on the PSDM volume. If the seismic event is deeper than the well marker, the overburden velocity model is too slow.
            </p>
        </div>
      </div>
    </div>
  );
};

export default DepthMigrationQCGuide;