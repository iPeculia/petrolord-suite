import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const WaterfallChart = ({ metrics }) => {
    const data = [
        { name: 'Gross Rev', value: metrics.totalRevenue, step: 'start' },
        { name: 'Royalty', value: -metrics.totalRoyalty, step: 'sub' },
        { name: 'OPEX', value: -metrics.totalOpex, step: 'sub' },
        { name: 'CAPEX', value: -metrics.totalCapex, step: 'sub' },
        { name: 'Tax', value: -metrics.totalTax, step: 'sub' },
        { name: 'Net Cash', value: metrics.totalRevenue - metrics.totalRoyalty - metrics.totalOpex - metrics.totalCapex - metrics.totalTax, step: 'end' }
    ];

    // Transform for floating bars
    let runningTotal = 0;
    const processedData = data.map(item => {
        const prevTotal = runningTotal;
        if (item.step === 'start' || item.step === 'end') {
            runningTotal = item.value;
            return { ...item, y: 0, height: item.value, displayVal: item.value };
        } else {
            runningTotal += item.value;
            return { ...item, y: prevTotal + item.value, height: Math.abs(item.value), displayVal: item.value };
        }
    });

    // Custom shape could be used, but simple stacked bar logic works if we format data carefully. 
    // For simplicity in Recharts Waterfall, we usually use a range [min, max]. 
    // Let's use a simplified BarChart where we offset 'y' manually if needed, or use the 'stack' trick.
    // Actually, standard Recharts bar with transparent stack is easier.
    
    const chartData = data.map((item, i) => {
        let uv = 0; // invisible filler
        let pv = 0; // visible bar
        
        if (i === 0) {
            pv = item.value;
        } else if (i === data.length - 1) {
             pv = item.value;
        } else {
            // For intermediate negative steps
            // Previous End
            const prevSum = data.slice(0, i).reduce((acc, curr) => acc + curr.value, 0);
            uv = prevSum + item.value; 
            pv = Math.abs(item.value);
        }
        return { name: item.name, uv, pv, val: item.value, type: item.step };
    });

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `$${val/1e6}M`} />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }}
                    formatter={(val, name, props) => props.payload.type === 'sub' ? [`$${(props.payload.val/1e6).toFixed(1)}M`, 'Change'] : [`$${(props.payload.val/1e6).toFixed(1)}M`, 'Value']}
                />
                <Bar dataKey="uv" stackId="a" fill="transparent" />
                <Bar dataKey="pv" stackId="a">
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.type === 'end' ? '#3b82f6' : entry.type === 'sub' ? '#ef4444' : '#10b981'} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default WaterfallChart;