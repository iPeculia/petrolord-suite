import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getProperlyInvertedDepthAxisConfig, getPressureAxisConfig, getCommonChartProps, getGridConfig, getTooltipStyle } from '@/utils/chartConfigUtils';

const ProbabilityDensityPlots = ({ data }) => {
    // Placeholder visualization for depth-based probability density
    // Typically represented as track with color intensity or multiple lines (P10/50/90)
    
    if (!data) return <div className="flex items-center justify-center h-full text-slate-500">No density data available</div>;

    return (
        <div className="h-full w-full bg-slate-900/50 rounded-lg border border-slate-800 p-2 relative">
             <h4 className="absolute top-4 right-4 text-xs font-bold text-slate-500 z-10">Probability Density</h4>
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} {...getCommonChartProps()}>
                    <CartesianGrid {...getGridConfig()} />
                    <XAxis {...getPressureAxisConfig('Probability Density')} />
                    <YAxis {...getProperlyInvertedDepthAxisConfig()} />
                    <Tooltip contentStyle={getTooltipStyle()} />
                    <Area dataKey="density" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="Density" />
                </AreaChart>
             </ResponsiveContainer>
        </div>
    );
};

export default ProbabilityDensityPlots;