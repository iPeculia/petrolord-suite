import React, { useState } from 'react';
import AdvancedCanvas3D from '../viewer3d/AdvancedCanvas3D';
import AdvancedViewerControls from '../viewer3d/AdvancedViewerControls';
import VariogramAnalysis from '../plots/VariogramAnalysis';
import { Card } from '@/components/ui/card';

const PropertyViewer = () => {
  const [layers, setLayers] = useState({
    grid: true,
    faults: false,
    seismic: false,
    wells: true
  });

  const toggleLayer = (layer) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="flex h-full gap-4">
      <div className="flex-1 relative rounded-lg overflow-hidden border border-slate-800">
        <AdvancedCanvas3D layers={layers} />
        <AdvancedViewerControls layers={layers} toggleLayer={toggleLayer} onReset={() => {}} />
        
        <Card className="absolute top-4 left-4 p-3 bg-slate-900/90 border-slate-800 backdrop-blur-md">
          <div className="text-xs font-medium text-slate-400 mb-1">Property</div>
          <select className="bg-slate-800 border border-slate-700 text-white text-sm rounded px-2 py-1 w-32">
            <option>Porosity (PHI)</option>
            <option>Permeability (K)</option>
            <option>Water Sat. (Sw)</option>
          </select>
        </Card>
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64 h-12 bg-gradient-to-r from-blue-900 via-green-500 to-yellow-400 rounded-full opacity-80 border border-white/20 flex items-center justify-between px-4 text-xs font-bold text-white shadow-lg">
          <span>0.00</span>
          <span>Porosity (v/v)</span>
          <span>0.35</span>
        </div>
      </div>
      
      <div className="w-80 flex flex-col gap-4">
        <div className="h-64">
          <VariogramAnalysis />
        </div>
        <Card className="flex-1 bg-slate-900 border-slate-800 p-4">
          <h3 className="text-sm font-medium text-white mb-4">Statistics</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Mean</span>
              <span className="font-mono text-slate-200">0.185</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Std Dev</span>
              <span className="font-mono text-slate-200">0.042</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Min</span>
              <span className="font-mono text-slate-200">0.020</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Max</span>
              <span className="font-mono text-slate-200">0.320</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PropertyViewer;