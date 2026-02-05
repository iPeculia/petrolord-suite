import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CompressorPumpPack = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Compressor & Pump Pack</h1>
      <p className="text-slate-400">Select and size compressors and pumps for various applications.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Compressor Sizing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
                  <h3 className="font-medium text-slate-300 mb-2">Results</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Power: <span className="text-cyan-400">1250 hp</span></div>
                    <div>Discharge Temp: <span className="text-cyan-400">245 °F</span></div>
                  </div>
               </div>
               <p className="text-xs text-slate-500 pt-2">Estimates are for conceptual studies. Surge margin &gt; 10% is recommended.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Pump Sizing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
                  <h3 className="font-medium text-slate-300 mb-2">Results</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Head: <span className="text-lime-400">450 ft</span></div>
                    <div>NPSHa: <span className="text-lime-400">12 ft</span></div>
                  </div>
               </div>
               <p className="text-xs text-slate-500 pt-2">BHP assumes centrifugal pump. NPSH margin &gt; 5 ft is recommended for safe operation.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompressorPumpPack;