import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getProperlyInvertedDepthAxisConfig, getPressureAxisConfig, getCommonChartProps, getGridConfig, getTooltipStyle } from '@/utils/chartConfigUtils';

// Dummy data generator for placeholder visualization
const generateDummyData = (depths = {start: 0, end: 12000}) => {
    const data = [];
    for (let depth = depths.start; depth <= depths.end; depth += 100) {
        const sv = depth * 1.0; // Overburden (psi/ft)
        const pp = depth * 0.45; // Pore Pressure (psi/ft)
        const sh_min = pp + 0.6 * (sv - pp); // Min Horizontal Stress
        const sH_max = pp + 1.2 * (sv - pp); // Max Horizontal Stress
        const mw_pp = pp / (0.052 * depth) || 8.4;
        const mw_fg = sh_min / (0.052 * depth) || 8.4;
        data.push({ depth, sv, pp, sh_min, sH_max, mw_pp, mw_fg });
    }
    return data;
};

const CustomTooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={getTooltipStyle()} className="p-2">
                <p className="font-bold">{`Depth: ${label} ft`}</p>
                {payload.map(p => (
                    <p key={p.name} style={{ color: p.color }}>{`${p.name}: ${p.value.toFixed(0)} psi`}</p>
                ))}
            </div>
        );
    }
    return null;
};

const MudWindowTooltipContent = ({ active, payload, label }) => {
     if (active && payload && payload.length) {
        return (
            <div style={getTooltipStyle()} className="p-2">
                <p className="font-bold">{`Depth: ${label} ft`}</p>
                {payload.map(p => (
                    <p key={p.name} style={{ color: p.color }}>{`${p.name}: ${p.value.toFixed(2)} ppg`}</p>
                ))}
            </div>
        );
    }
    return null;
}

const ResultsVisualization = () => {
    const data = React.useMemo(() => generateDummyData(), []);

    return (
        <div className="space-y-6 h-full flex flex-col">
            <h2 className="text-2xl font-bold text-white">Results Visualization</h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-grow">
                <Card className="bg-slate-800/50 border-slate-700 flex flex-col">
                    <CardHeader>
                        <CardTitle>Stress Profile</CardTitle>
                        <CardDescription>Principal stresses vs. Depth</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} {...getCommonChartProps()}>
                                <CartesianGrid {...getGridConfig()} />
                                <XAxis {...getPressureAxisConfig('Stress (psi)', [0, 15000])} dataKey="sv" />
                                <YAxis {...getProperlyInvertedDepthAxisConfig()} dataKey="depth" />
                                <Tooltip content={<CustomTooltipContent />} />
                                <Legend />
                                <Line dataKey="pp" name="Pore Pressure" stroke="#3b82f6" dot={false} strokeWidth={2} />
                                <Line dataKey="sh_min" name="Sh_min" stroke="#f59e0b" dot={false} strokeWidth={2} />
                                <Line dataKey="sv" name="Sv" stroke="#ef4444" dot={false} strokeWidth={2} />
                                <Line dataKey="sH_max" name="SH_max" stroke="#10b981" dot={false} strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700 flex flex-col">
                    <CardHeader>
                        <CardTitle>Mud Weight Window</CardTitle>
                        <CardDescription>Pore pressure and fracture gradient vs. Depth</CardDescription>
                    </CardHeader>
                     <CardContent className="flex-grow">
                        <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={data} {...getCommonChartProps()}>
                                <CartesianGrid {...getGridConfig()} />
                                <XAxis {...getPressureAxisConfig('Equivalent Mud Weight (ppg)', [8, 18])} dataKey="mw_pp" />
                                <YAxis {...getProperlyInvertedDepthAxisConfig()} dataKey="depth" />
                                <Tooltip content={<MudWindowTooltipContent />} />
                                <Legend />
                                <Line dataKey="mw_pp" name="Pore Pressure" stroke="#3b82f6" dot={false} strokeWidth={2} />
                                <Line dataKey="mw_fg" name="Fracture Gradient" stroke="#ef4444" dot={false} strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResultsVisualization;