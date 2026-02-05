import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getProperlyInvertedDepthAxisConfig, getPressureAxisConfig, getCommonChartProps, getGridConfig, getTooltipStyle } from '@/utils/chartConfigUtils';

const SensitivityAnalysisPanel = ({ baseInputs, params, active }) => {
    if (!active) return null;

    // Mock generating sensitivity curves
    // In real app, this would recalculate based on +/- 10% of params
    const data = [];
    if (baseInputs && baseInputs.depths) {
        for(let i=0; i<baseInputs.depths.length; i+=100) {
             const d = baseInputs.depths[i];
             const basePP = 9 + (d/3000); // Mock trend
             data.push({
                 depth: d,
                 pp_base: basePP,
                 pp_low: basePP * 0.95,
                 pp_high: basePP * 1.05
             });
        }
    }

    return (
        <div className="h-full w-full flex gap-4 p-2">
            <div className="flex-1">
                 <h4 className="text-xs font-bold text-slate-400 mb-2">Sensitivity Envelope (±5% Param Variation)</h4>
                 <div className="h-[140px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} {...getCommonChartProps()}>
                            <CartesianGrid {...getGridConfig()} />
                            <XAxis {...getPressureAxisConfig('', ['auto', 'auto'])} hide />
                            <YAxis {...getProperlyInvertedDepthAxisConfig()} hide />
                            <Tooltip contentStyle={getTooltipStyle()} />
                            
                            <Line dataKey="pp_high" stroke="#fca5a5" dot={false} strokeWidth={1} strokeDasharray="3 3" />
                            <Line dataKey="pp_base" stroke="#ef4444" dot={false} strokeWidth={2} />
                            <Line dataKey="pp_low" stroke="#fca5a5" dot={false} strokeWidth={1} strokeDasharray="3 3" />
                        </LineChart>
                    </ResponsiveContainer>
                 </div>
            </div>
            <div className="w-64 border-l border-slate-800 pl-4 overflow-y-auto">
                <h4 className="text-xs font-bold text-slate-400 mb-2">Parameter Impact</h4>
                {Object.keys(params || {}).map(k => (
                    <div key={k} className="mb-2">
                        <div className="flex justify-between text-[10px] text-slate-500">
                            <span>{k}</span>
                            <span className="text-emerald-400">High Sensitivity</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded mt-1 overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[70%]"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SensitivityAnalysisPanel;