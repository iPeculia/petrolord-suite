import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';
import { getProperlyInvertedDepthAxisConfig, getTooltipStyle } from '@/utils/chartConfigUtils';

const RiskHeatmap = ({ riskMap }) => {
    if (!riskMap || riskMap.length === 0) return null;

    // Transform flat list to scatter points for heatmap effect
    const typeMap = { 'Low': 0, 'Medium': 1, 'High': 2 };
    const colors = { 'Low': '#10b981', 'Medium': '#f59e0b', 'High': '#ef4444' };

    const data = riskMap.map(r => ({
        x: 1, // Single column strip
        y: r.depth,
        z: 1,
        riskLevel: r.riskLevel,
        color: colors[r.riskLevel] || '#334155'
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 0, bottom: 0, left: 0 }}>
                <XAxis type="number" dataKey="x" hide domain={[0, 2]} />
                <YAxis {...getProperlyInvertedDepthAxisConfig()} hide />
                <ZAxis type="number" dataKey="z" range={[50, 50]} />
                <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                                <div style={getTooltipStyle()} className="p-2 border">
                                    <div className="font-bold">{Math.round(d.y)} ft</div>
                                    <div style={{color: d.color}}>{d.riskLevel} Risk</div>
                                </div>
                            );
                        }
                        return null;
                    }}
                />
                <Scatter data={data} shape="square">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Scatter>
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default RiskHeatmap;