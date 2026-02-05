import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TornadoChart = ({ data }) => {
    // Data format: [{ name: 'Oil Price', low: 50, high: 150, base: 100 }, ...]
    // Transform for recharts range bar
    
    const chartData = data.map(d => ({
        name: d.name,
        min: d.low,
        max: d.high,
        base: d.base,
        range: [d.low, d.high]
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={chartData} margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} fontSize={11} />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                />
                <Bar dataKey="range" fill="#8b5cf6" barSize={20} radius={[4, 4, 4, 4]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default TornadoChart;