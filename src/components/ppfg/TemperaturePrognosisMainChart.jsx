import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend } from 'recharts';
import { getProperlyInvertedDepthAxisConfig } from '@/utils/chartConfigUtils';

const TemperaturePrognosisMainChart = ({ data, hardData, maxDepth }) => {
    const displayData = data ? data.filter((d, i) => i % 10 === 0) : [];

    return (
        <div className="w-full h-full bg-white relative">
             <div className="absolute top-0 left-0 right-0 h-8 bg-slate-100 border-b border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-700 z-10">
                Temperature (°F)
             </div>
             <div className="pt-8 h-full pb-2 px-2">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={displayData} layout="vertical" margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        
                        <XAxis type="number" domain={[40, 400]} orientation="top" tick={{fontSize: 10}} stroke="#4b5563" />
                        {/* YAxis: domain={[max, 0]} -> Max at Bottom, 0 at Top */}
                        <YAxis {...getProperlyInvertedDepthAxisConfig(maxDepth)} tick={{fontSize: 10}} />
                        
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', border: '1px solid #ccc', fontSize: '11px', color: '#000' }}
                            itemStyle={{ padding: 0 }}
                            labelStyle={{ fontWeight: 'bold', color: '#333' }}
                        />
                        <Legend verticalAlign="top" height={36} iconSize={8} wrapperStyle={{ fontSize: '10px', top: 0 }} />

                        <Line dataKey="temp" stroke="#ea580c" strokeWidth={2} name="Temperature" dot={false} isAnimationActive={false} />

                        {/* Hard Data */}
                        {hardData?.tempPoints?.map((pt, i) => (
                            <ReferenceLine key={`tp-${i}`} x={pt.value} stroke="none" label={{ position: 'right', value: '●', fill: '#ea580c', fontSize: 14 }} y={pt.depth} />
                        ))}

                    </ComposedChart>
                </ResponsiveContainer>
             </div>
        </div>
    );
};

export default TemperaturePrognosisMainChart;