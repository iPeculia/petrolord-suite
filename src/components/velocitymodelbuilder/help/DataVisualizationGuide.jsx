import React from 'react';
import { MonitorPlay } from 'lucide-react';

const DataVisualizationGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <MonitorPlay className="w-6 h-6 text-blue-400"/> Advanced Data Visualization
      </h2>
      <div className="bg-slate-900 p-6 rounded border border-slate-800 space-y-4">
        <p className="text-sm text-slate-400">
            Effective visualization detects errors that statistics miss.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-slate-950 p-3 rounded">
                <h4 className="text-white font-bold text-sm">Multi-Z Layers</h4>
                <p className="text-xs text-slate-500">Visualizing complex thrust belts or salt overhangs where one X,Y has multiple Z values.</p>
             </div>
             <div className="bg-slate-950 p-3 rounded">
                <h4 className="text-white font-bold text-sm">4D QC</h4>
                <p className="text-xs text-slate-500">Animating velocity changes over time (e.g., 4D seismic monitoring of production).</p>
             </div>
             <div className="bg-slate-950 p-3 rounded">
                <h4 className="text-white font-bold text-sm">Uncertainty Cones</h4>
                <p className="text-xs text-slate-500">Displaying the P10-P90 depth range as a translucent cone along well paths.</p>
             </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualizationGuide;