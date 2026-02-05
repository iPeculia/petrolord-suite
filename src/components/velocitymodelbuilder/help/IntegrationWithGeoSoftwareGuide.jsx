import React from 'react';
import { Workflow } from 'lucide-react';

const IntegrationWithGeoSoftwareGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Workflow className="w-6 h-6 text-cyan-400"/> Integration with GeoSoftware
      </h2>
      
      <div className="space-y-4">
        <div className="bg-slate-900 p-4 rounded border border-slate-800">
            <h3 className="text-white font-bold">Petrel Integration</h3>
            <p className="text-sm text-slate-400">
                Supports direct I/O of `.vf` (Velocity Functions), ZMap grids, and well headers via the Ocean API connector or ASCII exchange.
            </p>
        </div>
        <div className="bg-slate-900 p-4 rounded border border-slate-800">
            <h3 className="text-white font-bold">ArcGIS / GIS</h3>
            <p className="text-sm text-slate-400">
                Export velocity maps as GeoTIFF or Shapefiles. Critical for surface geology correlation or planning pipeline routes based on shallow velocity hazards.
            </p>
        </div>
        <div className="bg-slate-900 p-4 rounded border border-slate-800">
            <h3 className="text-white font-bold">Python & SDK</h3>
            <p className="text-sm text-slate-400">
                Use `petrolord-sdk` to programmatically fetch velocity cubes for use in custom NumPy/Pandas workflows or Jupyter notebooks.
            </p>
        </div>
      </div>
    </div>
  );
};

export default IntegrationWithGeoSoftwareGuide;