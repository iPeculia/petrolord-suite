import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ProfilePlot = ({ data, lines, xLabel, yLabel, reversedY = true, width = "100%", height = "100%" }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center text-slate-500 bg-slate-900/20 rounded-lg border border-dashed border-slate-700" style={{ width, height }}>
                <span className="text-xs">No data to display</span>
            </div>
        );
    }

    return (
        <ResponsiveContainer width={width} height={height}>
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis 
                    dataKey={lines[0].dataKey} 
                    type="number"
                    label={{ value: xLabel, position: 'bottom', fill: '#94a3b8', fontSize: 10, offset: 0 }} 
                    stroke="#94a3b8"
                    fontSize={10}
                    tickFormatter={(val) => val.toFixed(1)}
                    domain={['auto', 'auto']}
                />
                <YAxis 
                    dataKey="tvd"
                    type="number"
                    reversed={reversedY} 
                    label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10, offset: 10 }} 
                    stroke="#94a3b8"
                    fontSize={10}
                    domain={['dataMin', 'dataMax']}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }}
                    itemStyle={{ color: '#f8fafc' }}
                    labelStyle={{ color: '#94a3b8' }}
                    formatter={(value) => value.toFixed(2)}
                    labelFormatter={(label) => `Depth: ${label} ft`}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', paddingTop: '0px' }} iconType="circle" />
                
                {lines.map((line, idx) => (
                    <Line 
                        key={idx}
                        type="monotone" 
                        dataKey={line.dataKey} 
                        name={line.name}
                        stroke={line.color} 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0 }}
                    />
                ))}
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default ProfilePlot;