import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const SpiderChart = ({ sensitivityData }) => {
    // Transform data: we need a series of points. 
    // Let's assume we vary parameters by %, so X axis is % Change (-30, -15, 0, +15, +30)
    // For a Spider plot, we ideally calculate multiple points. The current helper 'runSensitivityAnalysis' gives Low/High.
    // We can interpolate or mock intermediate points for smooth lines for this visual.
    
    // Mocking plotting data based on the endpoints provided
    const points = [-30, -15, 0, 15, 30];
    
    const data = points.map(pct => {
        const point = { pct };
        sensitivityData.forEach(item => {
            // Linear interpolation between Low (-30%), Base (0%), High (+30%)
            let val = item.baseNPV;
            if (pct < 0) {
                const slope = (item.baseNPV - item.lowParamNPV) / 30; // slope per % from low to base
                val = item.baseNPV + slope * pct;
            } else {
                const slope = (item.highParamNPV - item.baseNPV) / 30;
                val = item.baseNPV + slope * pct;
            }
            point[item.name] = val;
        });
        return point;
    });

    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="pct" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}%`} label={{ value: '% Change in Parameter', position: 'bottom', fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `$${v/1e6}M`} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }} formatter={(v) => `$${(v/1e6).toFixed(1)}M`} labelFormatter={(v) => `${v}% Variation`} />
                <Legend />
                <ReferenceLine x={0} stroke="#64748b" strokeDasharray="3 3" />
                
                {sensitivityData.map((item, i) => (
                    <Line key={item.name} type="monotone" dataKey={item.name} stroke={colors[i % colors.length]} strokeWidth={2} dot />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default SpiderChart;