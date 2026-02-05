import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getProperlyInvertedDepthAxisConfig, getPressureAxisConfig, getCommonChartProps, getGridConfig, getTooltipStyle } from '@/utils/chartConfigUtils';

const DepthPressureScatterPlot = ({ data }) => {
    if (!data) return <div className="flex items-center justify-center h-full text-slate-500">No scatter data</div>;

    return (
        <div className="h-full w-full bg-slate-900/50 rounded-lg border border-slate-800 p-2">
             <h4 className="text-xs font-bold text-slate-400 mb-2">Depth vs Pressure Scatter</h4>
             <ResponsiveContainer width="100%" height="100%">
                <ScatterChart {...getCommonChartProps()}>
                    <CartesianGrid {...getGridConfig()} />
                    <XAxis {...getPressureAxisConfig('Pressure (psi)')} dataKey="pressure" />
                    <YAxis {...getProperlyInvertedDepthAxisConfig()} />
                    <Tooltip contentStyle={getTooltipStyle()} />
                    <Legend />
                    <Scatter name="Formation Pressure" data={data} fill="#3b82f6" />
                </ScatterChart>
             </ResponsiveContainer>
        </div>
    );
};

export default DepthPressureScatterPlot;