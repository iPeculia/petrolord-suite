import React from 'react';
import { Server } from 'lucide-react';

const HighPerformanceComputingGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Server className="w-6 h-6 text-purple-400"/> HPC & GPU Acceleration
      </h2>
      <div className="bg-slate-900 p-6 rounded border border-slate-800 space-y-4">
        <p className="text-sm text-slate-400">
            For massive regional models or FWI velocity updates, CPU processing is insufficient.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded border border-slate-800">
                <h4 className="text-white font-bold mb-1">GPU Gridding</h4>
                <p className="text-xs text-slate-400">
                    We utilize WebGL/WebGPU to perform grid interpolation directly on your local graphics card, reducing calculation time from minutes to seconds.
                </p>
            </div>
            <div className="bg-slate-950 p-4 rounded border border-slate-800">
                <h4 className="text-white font-bold mb-1">Cluster Dispatch</h4>
                <p className="text-xs text-slate-400">
                    Connect to your corporate HPC cluster (Slurm/PBS) to run intensive PSDM velocity updates directly from the web interface.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HighPerformanceComputingGuide;