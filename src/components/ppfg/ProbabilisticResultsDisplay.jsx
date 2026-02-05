import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getProperlyInvertedDepthAxisConfig, getPressureAxisConfig, getCommonChartProps, getGridConfig, getTooltipStyle } from '@/utils/chartConfigUtils';

const ProbabilisticResultsDisplay = ({ results }) => {
    if (!results) return <div className="h-full flex items-center justify-center text-slate-500">Run simulation to view probabilistic envelopes</div>;

    // Sampling for performance
    const step = 10;
    const data = [];
    for(let i=0; i<results.depths.length; i+=step) {
        data.push({
            depth: results.depths[i],
            pp_p10: results.pp.p10[i],
            pp_p50: results.pp.p50[i],
            pp_p90: results.pp.p90[i],
            fg_p10: results.fg.p10[i],
            fg_p50: results.fg.p50[i],
            fg_p90: results.fg.p90[i],
        });
    }

    return (
        <div className="h-full w-full bg-slate-900/50 rounded-lg border border-slate-800 p-2">
             <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} {...getCommonChartProps()}>
                    <CartesianGrid {...getGridConfig()} horizontal={false} />
                    <XAxis {...getPressureAxisConfig('Gradient (ppg)', [8, 20])} />
                    <YAxis {...getProperlyInvertedDepthAxisConfig()} />
                    <Tooltip contentStyle={getTooltipStyle()} itemStyle={{ fontSize: '11px' }} />
                    <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '10px' }} iconSize={10} />
                    
                    {/* Pore Pressure P10-P50-P90 */}
                    <Line dataKey="pp_p10" stroke="#86efac" strokeDasharray="3 3" name="PP P10" dot={false} strokeWidth={1} />
                    <Line dataKey="pp_p50" stroke="#10b981" name="PP P50" dot={false} strokeWidth={2} />
                    <Line dataKey="pp_p90" stroke="#059669" strokeDasharray="3 3" name="PP P90" dot={false} strokeWidth={1} />

                    {/* Frac Gradient P10-P50-P90 */}
                    <Line dataKey="fg_p10" stroke="#93c5fd" strokeDasharray="3 3" name="FG P10" dot={false} strokeWidth={1} />
                    <Line dataKey="fg_p50" stroke="#3b82f6" name="FG P50" dot={false} strokeWidth={2} />
                    <Line dataKey="fg_p90" stroke="#1d4ed8" strokeDasharray="3 3" name="FG P90" dot={false} strokeWidth={1} />

                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProbabilisticResultsDisplay;