import React, { useState } from 'react';
import AdvancedCanvas3D from '../viewer3d/AdvancedCanvas3D';
import AdvancedViewerControls from '../viewer3d/AdvancedViewerControls';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, CheckCircle } from 'lucide-react';

const FaultViewer = () => {
  const [layers, setLayers] = useState({
    grid: false,
    faults: true,
    seismic: true,
    wells: true
  });

  return (
    <div className="flex h-full gap-4">
      <div className="w-64 flex flex-col gap-2">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Fault List</h3>
            <div className="space-y-2">
              {['F1_Major', 'F2_Major', 'F3_Minor', 'F4_Minor'].map(fault => (
                <div key={fault} className="flex items-center justify-between p-2 bg-slate-950 rounded border border-slate-800 hover:border-rose-500/50 cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-500" />
                    <span className="text-sm text-slate-300 group-hover:text-rose-400">{fault}</span>
                  </div>
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex-1 bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Fault Details</h3>
            <div className="text-xs text-slate-400 space-y-2">
              <p>Select a fault to view details about throw, dip, and azimuth.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 relative rounded-lg overflow-hidden border border-slate-800">
        <AdvancedCanvas3D layers={layers} />
        <AdvancedViewerControls layers={layers} toggleLayer={(l) => setLayers(p => ({...p, [l]: !p[l]}))} />
      </div>
    </div>
  );
};

export default FaultViewer;