import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Wind, Waves, AlertTriangle } from 'lucide-react';

const FlowCapacityAnalysis = ({ flowData }) => {
    if (!flowData) return null;

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4">
                <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center justify-between">
                    <div className="flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-cyan-400" />
                        Flow Capacity Analysis
                    </div>
                    {flowData.erosionRisk !== 'OK' && (
                        <div className="flex items-center text-[10px] text-amber-400 bg-amber-900/20 px-2 py-0.5 rounded border border-amber-800">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Erosion Risk: {flowData.erosionRisk}
                        </div>
                    )}
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Max Flow Rate</span>
                        <span className="text-sm font-mono font-bold text-white">{flowData.maxRate} <span className="text-[10px] text-slate-600">bbl/d</span></span>
                    </div>
                    <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Velocity</span>
                        <span className={`text-sm font-mono font-bold ${flowData.erosionRisk === 'Critical' ? 'text-red-400' : 'text-white'}`}>
                            {flowData.velocity} <span className="text-[10px] text-slate-600">ft/s</span>
                        </span>
                    </div>
                    <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Friction Loss</span>
                        <span className="text-sm font-mono font-bold text-white">{flowData.frictionLoss} <span className="text-[10px] text-slate-600">psi</span></span>
                    </div>
                    <div className="bg-slate-950/50 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">Regime</span>
                        <span className="text-sm font-mono font-bold text-emerald-400">{flowData.regime}</span>
                    </div>
                </div>
                
                <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
                    <span>Limiting Node: {flowData.limitingNode}</span>
                    <span>Constraint: Friction/WHP</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default FlowCapacityAnalysis;