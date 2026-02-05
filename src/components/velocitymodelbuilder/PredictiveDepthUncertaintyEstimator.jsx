import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, HelpCircle } from 'lucide-react';

const PredictiveDepthUncertaintyEstimator = () => {
  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-yellow-400" /> Uncertainty Estimator
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
            <HelpCircle className="w-3 h-3" />
            <span>Shows P10-P50-P90 depth envelopes based on V0 variance.</span>
        </div>

        <div className="h-40 bg-slate-950 rounded border border-slate-800 relative flex items-end p-2">
            {/* Conceptual Uncertainty Cone */}
            <div className="absolute bottom-0 left-1/2 h-[90%] w-0 border-l border-dashed border-white opacity-20"></div>
            
            {/* Cone Shape */}
            <svg className="w-full h-full overflow-visible">
                <path d="M150,10 L180,140 L120,140 Z" fill="rgba(234, 179, 8, 0.1)" stroke="rgba(234, 179, 8, 0.5)" />
                <path d="M150,10 L165,140 L135,140 Z" fill="rgba(234, 179, 8, 0.2)" stroke="none" />
                <line x1="150" y1="10" x2="150" y2="140" stroke="#eab308" strokeWidth="2" />
            </svg>
            
            <div className="absolute top-2 left-2 text-[10px] text-slate-500">0m</div>
            <div className="absolute bottom-2 left-2 text-[10px] text-slate-500">3000m</div>
            
            <div className="absolute bottom-4 right-4 bg-slate-900/90 p-2 rounded border border-slate-800 text-[9px]">
                <div className="flex gap-2 mb-1"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span> P50 Target</div>
                <div className="flex gap-2"><span className="w-2 h-2 bg-yellow-500/20 border border-yellow-500 rounded-full"></span> ±2σ (95%)</div>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500">Shallow Risk</span>
                <div className="text-emerald-400 text-xs font-bold">Low</div>
            </div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500">Reservoir Risk</span>
                <div className="text-yellow-400 text-xs font-bold">Medium</div>
            </div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500">Deep Risk</span>
                <div className="text-red-400 text-xs font-bold">High</div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveDepthUncertaintyEstimator;