import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export const HistogramChart = ({ data, p10, p50, p90 }) => (
    <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="binStart" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `$${(v/1e6).toFixed(0)}`} />
            <YAxis stroke="#94a3b8" fontSize={10} />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }} />
            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Frequency" />
            <ReferenceLine x={p90} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'P90', fill: '#ef4444', fontSize: 10 }} />
            <ReferenceLine x={p50} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'P50', fill: '#f59e0b', fontSize: 10 }} />
            <ReferenceLine x={p10} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'P10', fill: '#10b981', fontSize: 10 }} />
        </BarChart>
    </ResponsiveContainer>
);

export const SCurveChart = ({ data }) => (
    <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="value" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `$${(v/1e6).toFixed(0)}`} type="number" domain={['auto', 'auto']} />
            <YAxis stroke="#94a3b8" fontSize={10} unit="%" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }} />
            <Area type="monotone" dataKey="probability" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} name="Cumulative Prob." />
        </AreaChart>
    </ResponsiveContainer>
);