import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getProperlyInvertedDepthAxisConfig, getPressureAxisConfig, getCommonChartProps, getGridConfig, getTooltipStyle } from '@/utils/chartConfigUtils';

const FieldTrendAnalysisPanel = ({ data }) => {
    if (!data) return <div className="flex items-center justify-center h-full text-slate-500">No field trend data</div>;

    return (
        <div className="h-full w-full bg-slate-900/50 rounded-lg border border-slate-800 p-2">
             <h4 className="text-xs font-bold text-slate-400 mb-2">Regional Overpressure Trends</h4>
             <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} {...getCommonChartProps()}>
                    <CartesianGrid {...getGridConfig()} />
                    <XAxis {...getPressureAxisConfig('Pressure (psi)')} />
                    <YAxis {...getProperlyInvertedDepthAxisConfig()} />
                    <Tooltip contentStyle={getTooltipStyle()} />
                    <Legend />
                    <Line dataKey="regional_trend" stroke="#f59e0b" name="Regional Trend" dot={false} />
                    <Area dataKey="pressure_window" stroke="none" fill="#f59e0b" fillOpacity={0.1} />
                </ComposedChart>
             </ResponsiveContainer>
        </div>
    );
};

export default FieldTrendAnalysisPanel;