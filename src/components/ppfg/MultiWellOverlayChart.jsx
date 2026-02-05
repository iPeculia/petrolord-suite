import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getProperlyInvertedDepthAxisConfig, getPressureAxisConfig, getCommonChartProps, getGridConfig, getTooltipStyle } from '@/utils/chartConfigUtils';

const MultiWellOverlayChart = ({ wells, stats }) => {
    // If specific wells are selected, we might want to show individual lines
    // If many wells, maybe just the envelope and mean.
    // For now, let's show the statistical envelope + selected individual well curves if < 5 selected
    
    const showIndividualWells = wells.length <= 5;
    
    // Data preparation needs to align depths. 
    // Simplified approach: Use the stats array which is already depth-aligned
    const chartData = stats ? stats.map(s => {
        const point = {
            depth: s.depth,
            ppMin: s.pp.min,
            ppMax: s.pp.max,
            ppMean: s.pp.mean,
            fgMean: s.fg.mean
        };
        
        if (showIndividualWells) {
            wells.forEach(w => {
                // Find closest depth point in well data - naive approach
                // Real implementation needs proper depth indexing/resampling
                const idx = w.depths.findIndex(d => Math.abs(d - s.depth) < 25); // within 25ft
                if (idx !== -1) {
                    point[`pp_${w.id}`] = w.results.pp[idx];
                    point[`fg_${w.id}`] = w.results.fg[idx];
                }
            });
        }
        return point;
    }) : [];

    return (
        <div className="h-full w-full bg-slate-900/50 rounded-lg border border-slate-800 p-2 relative flex flex-col">
            <div className="flex justify-between items-center px-2 mb-2">
                 <h4 className="text-xs font-bold text-slate-400 uppercase">
                    {showIndividualWells ? "Individual Well Comparison" : "Field Envelope & Trends"}
                 </h4>
            </div>
            
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} {...getCommonChartProps()}>
                        <CartesianGrid {...getGridConfig()} horizontal={false} />
                        <XAxis {...getPressureAxisConfig('Pressure (psi)')} />
                        <YAxis {...getProperlyInvertedDepthAxisConfig()} />
                        <Tooltip contentStyle={getTooltipStyle()} itemStyle={{ fontSize: '11px' }} />
                        <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '10px' }} iconSize={10} />
                        
                        {/* Envelope for PP Range across field (always shown for context) */}
                        <Area dataKey="ppMin" dataKey1="ppMax" stroke="none" fill="#10b981" fillOpacity={0.1} name="Field Range (PP)" />

                        {/* Mean Lines */}
                        {!showIndividualWells && (
                            <>
                                <Line dataKey="ppMean" stroke="#10b981" name="Field Mean PP" dot={false} strokeWidth={2} />
                                <Line dataKey="fgMean" stroke="#3b82f6" name="Field Mean FG" dot={false} strokeWidth={2} />
                            </>
                        )}

                        {/* Individual Well Lines */}
                        {showIndividualWells && wells.map((w, i) => (
                            <Line 
                                key={`pp-${w.id}`}
                                dataKey={`pp_${w.id}`} 
                                stroke={`hsl(${i * 60}, 70%, 50%)`} 
                                name={`${w.name} PP`} 
                                dot={false} 
                                strokeWidth={1.5} 
                            />
                        ))}
                         {showIndividualWells && wells.map((w, i) => (
                            <Line 
                                key={`fg-${w.id}`}
                                dataKey={`fg_${w.id}`} 
                                stroke={`hsl(${i * 60}, 70%, 50%)`} 
                                strokeDasharray="5 5"
                                name={`${w.name} FG`} 
                                dot={false} 
                                strokeWidth={1.5} 
                            />
                        ))}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MultiWellOverlayChart;