import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getProperlyInvertedDepthAxisConfig } from '@/utils/chartConfigUtils';

const WellLogsPanel = ({ data, maxDepth }) => {
    // Downsample data for performance
    const displayData = data ? data.filter((d, i) => i % 5 === 0) : []; 

    return (
        <div className="h-full w-full flex flex-col bg-white border-r border-slate-300">
            {/* Track 1: GR / CALI */}
            <div className="flex-1 relative border-b border-slate-200">
                 <div className="absolute top-0 left-0 right-0 h-8 bg-slate-100 border-b border-slate-300 flex justify-between px-1 text-[9px] font-bold items-center text-slate-600 z-10">
                    <span className="text-green-700">GR (0-150)</span>
                    <span className="text-black">CALI (6-26)</span>
                 </div>
                 <div className="pt-8 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={displayData} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#e2e8f0" />
                            <XAxis type="number" xAxisId="gr" domain={[0, 150]} hide />
                            <XAxis type="number" xAxisId="cali" domain={[6, 26]} orientation="top" hide />
                            {/* YAxis uses proper inversion: Max at Bottom, 0 at Top */}
                            <YAxis {...getProperlyInvertedDepthAxisConfig(maxDepth)} hide />
                            <Tooltip 
                                contentStyle={{ fontSize: '10px', padding: '4px' }}
                                labelStyle={{ display: 'none' }}
                                formatter={(val, name) => [val.toFixed(1), name]} 
                            />
                            <Line yAxisId={0} xAxisId="gr" dataKey="gr" stroke="#15803d" dot={false} strokeWidth={1} isAnimationActive={false} />
                            <Line yAxisId={0} xAxisId="cali" dataKey="cali" stroke="#000000" dot={false} strokeWidth={1} strokeDasharray="2 2" isAnimationActive={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                 </div>
            </div>

            {/* Track 2: RES (Log scale) / DT */}
            <div className="flex-1 relative">
                 <div className="absolute top-0 left-0 right-0 h-8 bg-slate-100 border-b border-slate-300 flex justify-between px-1 text-[9px] font-bold items-center text-slate-600 z-10">
                    <span className="text-red-600">RES (0.2-200)</span>
                    <span className="text-blue-600">DT (140-40)</span>
                 </div>
                 <div className="pt-8 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={displayData} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#e2e8f0" />
                            <XAxis type="number" xAxisId="res" domain={[0.2, 200]} scale="log" hide allowDataOverflow />
                            <XAxis type="number" xAxisId="dt" domain={[140, 40]} reversed hide />
                            {/* YAxis uses proper inversion: Max at Bottom, 0 at Top */}
                            <YAxis {...getProperlyInvertedDepthAxisConfig(maxDepth)} hide />
                            <Tooltip 
                                contentStyle={{ fontSize: '10px', padding: '4px' }}
                                labelStyle={{ display: 'none' }}
                                formatter={(val, name) => [val.toFixed(1), name]} 
                            />
                            <Line yAxisId={0} xAxisId="res" dataKey="res" stroke="#dc2626" dot={false} strokeWidth={1} isAnimationActive={false} />
                            <Line yAxisId={0} xAxisId="dt" dataKey="dt" stroke="#2563eb" dot={false} strokeWidth={1} isAnimationActive={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                 </div>
            </div>
        </div>
    );
};

export default WellLogsPanel;