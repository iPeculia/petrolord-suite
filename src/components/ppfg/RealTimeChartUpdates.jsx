import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getProperlyInvertedDepthAxisConfig, getPressureAxisConfig, getCommonChartProps, getGridConfig, getTooltipStyle } from '@/utils/chartConfigUtils';

const RealTimeChartUpdates = ({ results }) => {
    if (!results) return <div className="h-full flex items-center justify-center text-slate-500">Awaiting Calculation...</div>;

    // Assuming results come in a form ready to map or pre-mapped
    // For MVP, let's assume results.chartData exists or we map it
    const data = results.chartData || [];

    return (
        <div className="h-full w-full bg-slate-900/50 rounded-lg border border-slate-800 p-2 relative">
            <h4 className="absolute top-4 right-4 text-xs font-bold text-slate-500 z-10">Real-Time Prognosis</h4>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} {...getCommonChartProps()}>
                    <CartesianGrid {...getGridConfig()} />
                    <XAxis {...getPressureAxisConfig('Gradient (ppg)')} />
                    <YAxis {...getProperlyInvertedDepthAxisConfig()} />
                    <Tooltip contentStyle={getTooltipStyle()} />
                    <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '10px' }} />
                    
                    <Line dataKey="obg" stroke="#64748b" name="OBG" dot={false} strokeDasharray="3 3" />
                    <Area dataKey="pp" stroke="none" fill="#ef4444" fillOpacity={0.2} />
                    <Line dataKey="pp" stroke="#ef4444" name="Pore Pressure" dot={false} strokeWidth={2} />
                    <Line dataKey="fg" stroke="#3b82f6" name="Frac Gradient" dot={false} strokeWidth={2} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RealTimeChartUpdates;