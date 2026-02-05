import React, { useState } from 'react';
import AdvancedCanvas3D from '../viewer3d/AdvancedCanvas3D';
import AdvancedViewerControls from '../viewer3d/AdvancedViewerControls';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FaciesViewer = () => {
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
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-slate-800">
      <AdvancedCanvas3D layers={layers} />
      <AdvancedViewerControls layers={layers} toggleLayer={toggleLayer} onReset={() => {}} />
      
      <div className="absolute bottom-4 right-4 w-48">
        <Card className="bg-slate-900/90 border-slate-800 p-3 backdrop-blur-md">
          <h4 className="text-xs font-semibold text-slate-400 mb-2">Facies Legend</h4>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#F4A460] mr-2" /> Clean Sand
              </div>
              <Badge variant="secondary" className="text-[10px] h-4">35%</Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#BDB76B] mr-2" /> Shaly Sand
              </div>
              <Badge variant="secondary" className="text-[10px] h-4">25%</Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#708090] mr-2" /> Shale
              </div>
              <Badge variant="secondary" className="text-[10px] h-4">40%</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FaciesViewer;