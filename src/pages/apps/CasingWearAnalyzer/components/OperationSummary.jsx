import React from 'react';
import { useCasingWearAnalyzer } from '../contexts/CasingWearAnalyzerContext';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Weight, Ruler } from 'lucide-react';

const OperationSummary = () => {
  const { operationParams, derivedLoads } = useCasingWearAnalyzer();
  const { bhaSummary } = derivedLoads || { bhaSummary: {} }; // Safety fallback

  // Robust safe access
  const drillPipeSize = operationParams?.drillPipe?.size ?? '-';
  const hwdpCount = operationParams?.hwdp?.count ?? 0;
  const dcCount = operationParams?.drillCollars?.count ?? 0;
  const totalWeight = bhaSummary?.totalWeight ?? 0;
  const totalLength = bhaSummary?.totalLength ?? 0;

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <Weight className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Total BHA Weight</div>
              <div className="text-xl font-bold text-white">{totalWeight.toFixed(1)} <span className="text-sm font-normal text-slate-400">klbf</span></div>
            </div>
          </div>

          <ArrowRight className="hidden md:block w-5 h-5 text-slate-700" />

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 rounded-full border border-blue-500/20">
              <Ruler className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Total BHA Length</div>
              <div className="text-xl font-bold text-white">{totalLength.toFixed(0)} <span className="text-sm font-normal text-slate-400">ft</span></div>
            </div>
          </div>

          <ArrowRight className="hidden md:block w-5 h-5 text-slate-700" />

          <div className="flex flex-col items-end">
            <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1">Configuration</div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">{drillPipeSize}" DP</span>
              <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">{hwdpCount} HWDP</span>
              <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">{dcCount} DC</span>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default OperationSummary;