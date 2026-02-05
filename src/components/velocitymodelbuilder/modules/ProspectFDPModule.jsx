import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';

const ProspectFDPModule = () => {
  const risks = [
    { factor: 'Source / Charge', prob: 0.9, comment: 'Proven regional source' },
    { factor: 'Migration', prob: 0.8, comment: 'Simple up-dip path' },
    { factor: 'Reservoir', prob: 0.7, comment: 'Variable quality sands' },
    { factor: 'Trap', prob: 0.6, comment: 'Fault seal uncertainty' },
    { factor: 'Seal', prob: 0.8, comment: 'Thick regional shale' }
  ];

  const pos = risks.reduce((acc, r) => acc * r.prob, 1.0);

  return (
    <div className="h-full p-4 bg-slate-950 text-white space-y-4">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <Target className="w-5 h-5 text-emerald-400" /> Prospect & FDP Analysis
      </h2>

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader><CardTitle className="text-sm">Prospect Risking (POS)</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-4xl font-bold text-emerald-400">{(pos * 100).toFixed(1)}%</div>
              <span className="text-xs text-slate-400">Probability of Success</span>
            </div>
            <div className="space-y-2 mt-4">
              {risks.map((r, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-slate-300">{r.factor}</span>
                  <Badge variant={r.prob > 0.7 ? 'outline' : 'secondary'} className="text-xs">
                    {r.prob.toFixed(2)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 col-span-2">
          <CardHeader><CardTitle className="text-sm">Field Development Plan Integration</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded border border-slate-800">
                    <h4 className="text-xs font-semibold text-slate-400 mb-2">Volumetrics (P50)</h4>
                    <div className="text-2xl font-bold text-white">125 <span className="text-sm font-normal text-slate-500">MMbbl</span></div>
                </div>
                <div className="p-4 bg-slate-950 rounded border border-slate-800">
                    <h4 className="text-xs font-semibold text-slate-400 mb-2">Estimated CAPEX</h4>
                    <div className="text-2xl font-bold text-white">$450 <span className="text-sm font-normal text-slate-500">M</span></div>
                </div>
            </div>
            
            <div className="p-4 bg-amber-900/10 border border-amber-900/30 rounded flex gap-3 items-start">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                <div>
                    <h4 className="text-sm font-bold text-amber-400">Development Risk Alert</h4>
                    <p className="text-xs text-slate-300 mt-1">High uncertainty in fault seal capacity may impact recovery factor. Recommendation: Acquire additional 3D seismic over eastern block.</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProspectFDPModule;