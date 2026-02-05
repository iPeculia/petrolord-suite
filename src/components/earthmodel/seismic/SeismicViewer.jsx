import React, { useState } from 'react';
import AdvancedCanvas3D from '../viewer3d/AdvancedCanvas3D';
import AdvancedViewerControls from '../viewer3d/AdvancedViewerControls';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Waves, Layers, Eye } from 'lucide-react';

const SeismicViewer = () => {
  const [layers, setLayers] = useState({
    grid: false,
    faults: true,
    seismic: true,
    wells: true
  });

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-1 relative rounded-lg overflow-hidden border border-slate-800">
        <AdvancedCanvas3D layers={layers} />
        <AdvancedViewerControls layers={layers} toggleLayer={(l) => setLayers(p => ({...p, [l]: !p[l]}))} />
        
        <div className="absolute top-4 left-4 flex gap-2">
          <Button size="sm" variant="secondary" className="bg-slate-900/80 backdrop-blur text-white border border-slate-700">
            <Waves className="w-4 h-4 mr-2" /> Inline
          </Button>
          <Button size="sm" variant="secondary" className="bg-slate-900/80 backdrop-blur text-white border border-slate-700">
            <Layers className="w-4 h-4 mr-2" /> Crossline
          </Button>
          <Button size="sm" variant="secondary" className="bg-slate-900/80 backdrop-blur text-white border border-slate-700">
            <Eye className="w-4 h-4 mr-2" /> Z-Slice
          </Button>
        </div>
      </div>
      
      <Card className="h-32 bg-slate-900 border-slate-800 p-4 flex items-center justify-center">
        <div className="w-full h-full bg-slate-950 rounded flex items-center justify-center border border-slate-800 border-dashed">
          <span className="text-sm text-slate-500">Seismic Trace Spectrum Visualization (Mock)</span>
        </div>
      </Card>
    </div>
  );
};

export default SeismicViewer;