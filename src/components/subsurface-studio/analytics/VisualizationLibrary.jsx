import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

export const COLORS = ['#3b82f6', '#10b981', '#f97316', '#ef4444', '#8b5cf6', '#ec4899'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 p-2 rounded-md shadow-lg text-xs">
                <p className="label text-slate-300">{`${label}`}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }} className="font-bold">
                        {`${p.name}: ${p.value.toFixed(2)}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export const SimpleBarChart = ({ data, xKey, yKey, color = "#8884d8" }) => (
    <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey={xKey} stroke="#9ca3af" style={{ fontSize: '10px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '10px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
    </ResponsiveContainer>
);

export const SimpleLineChart = ({ data, xKey, yKeys = [], colors = [] }) => (
    <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey={xKey} stroke="#9ca3af" style={{ fontSize: '10px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '10px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{fontSize: '11px'}} />
            {yKeys.map((key, i) => (
                <Line key={key} type="monotone" dataKey={key} stroke={colors[i] || COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
            ))}
        </LineChart>
    </ResponsiveContainer>
);

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-[10px] font-bold">
            {`${name} (${(percent * 100).toFixed(0)}%)`}
        </text>
    );
};

export const SimplePieChart = ({ data, nameKey, valueKey }) => (
    <ResponsiveContainer width="100%" height={250}>
        <PieChart>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props) => renderCustomizedLabel({...props, name: props[nameKey]})}
                outerRadius={100}
                fill="#8884d8"
                dataKey={valueKey}
                nameKey={nameKey}
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
        </PieChart>
    </ResponsiveContainer>
);