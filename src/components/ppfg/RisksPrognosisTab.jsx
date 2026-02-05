import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, PieChart, Pie, Legend, AreaChart, Area, CartesianGrid } from 'recharts';
import { AlertTriangle, AlertOctagon, ShieldAlert, Info } from 'lucide-react';

const RISK_COLORS = {
    'Kick': '#ef4444', // Red
    'Lost Circulation': '#f97316', // Orange
    'Stuck Pipe': '#eab308', // Yellow
    'Abnormal Pressure': '#a855f7', // Purple
    'Shallow Hazard': '#3b82f6' // Blue
};

const RisksPrognosisTab = ({ data, risks }) => {
    // Mock data if not provided
    const riskData = risks || [
        { depth: 3500, pressure: 9.2, type: 'Shallow Hazard', probability: 40, severity: 'Medium' },
        { depth: 8200, pressure: 12.5, type: 'Stuck Pipe', probability: 60, severity: 'High' },
        { depth: 12500, pressure: 16.8, type: 'Kick', probability: 85, severity: 'Critical' },
        { depth: 14200, pressure: 17.5, type: 'Lost Circulation', probability: 70, severity: 'High' },
        { depth: 15000, pressure: 18.2, type: 'Abnormal Pressure', probability: 50, severity: 'Medium' }
    ];

    const riskStats = [
        { name: 'Kick', value: 15 },
        { name: 'Lost Circulation', value: 25 },
        { name: 'Stuck Pipe', value: 30 },
        { name: 'Abnormal Pressure', value: 20 },
        { name: 'Shallow Hazard', value: 10 }
    ];

    const depthRiskProfile = [
        { depth: 0, risk: 10 },
        { depth: 3000, risk: 40 },
        { depth: 6000, risk: 20 },
        { depth: 9000, risk: 60 },
        { depth: 12000, risk: 90 },
        { depth: 15000, risk: 75 }
    ];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-slate-900 text-white p-2 rounded text-xs shadow-lg border border-slate-700">
                    <p className="font-bold mb-1">{data.type}</p>
                    <p>Depth: {data.depth} ft</p>
                    <p>Pressure: {data.pressure} ppg</p>
                    <p>Probability: {data.probability}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-full p-6 bg-slate-50 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6">
                
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-white border-l-4 border-l-red-500 shadow-sm">
                        <CardContent className="pt-4">
                            <div className="text-2xl font-bold text-slate-900">3</div>
                            <p className="text-xs text-slate-500 uppercase font-semibold mt-1">Critical Risks</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-l-4 border-l-orange-500 shadow-sm">
                        <CardContent className="pt-4">
                            <div className="text-2xl font-bold text-slate-900">12,500 ft</div>
                            <p className="text-xs text-slate-500 uppercase font-semibold mt-1">Highest Risk Depth</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-l-4 border-l-blue-500 shadow-sm">
                        <CardContent className="pt-4">
                            <div className="text-2xl font-bold text-slate-900">$2.4M</div>
                            <p className="text-xs text-slate-500 uppercase font-semibold mt-1">Contingency Est.</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-l-4 border-l-emerald-500 shadow-sm">
                        <CardContent className="pt-4">
                            <div className="text-2xl font-bold text-slate-900">96%</div>
                            <p className="text-xs text-slate-500 uppercase font-semibold mt-1">Drillability Score</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
                    {/* Risk Heatmap */}
                    <Card className="lg:col-span-2 flex flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Risk Heatmap (Depth vs Pressure)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" dataKey="pressure" name="Pressure" unit=" ppg" domain={[8, 20]} />
                                    <YAxis type="number" dataKey="depth" name="Depth" unit=" ft" reversed />
                                    <ZAxis type="number" dataKey="probability" range={[100, 500]} name="Probability" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Scatter name="Risks" data={riskData} fill="#8884d8">
                                        {riskData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.type] || '#000'} />
                                        ))}
                                    </Scatter>
                                    <Legend 
                                        payload={Object.keys(RISK_COLORS).map(type => ({
                                            value: type,
                                            type: 'circle',
                                            color: RISK_COLORS[type]
                                        }))}
                                    />
                                </ScatterChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Side Charts */}
                    <div className="flex flex-col gap-6 h-full">
                        <Card className="flex-1">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Risk Distribution by Type</CardTitle>
                            </CardHeader>
                            <CardContent className="h-full pb-8">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={riskStats}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={70}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {riskStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name] || '#ccc'} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        
                        <Card className="flex-1">
                             <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Risk Profile vs Depth</CardTitle>
                            </CardHeader>
                            <CardContent className="h-full pb-4">
                                 <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={depthRiskProfile} layout="vertical">
                                        <XAxis type="number" hide />
                                        <YAxis type="number" dataKey="depth" reversed hide />
                                        <Area type="monotone" dataKey="risk" stroke="#ef4444" fill="#fee2e2" />
                                        <Tooltip />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Detailed Risk Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Identified Hazards & Mitigation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-100">
                                    <tr>
                                        <th className="px-4 py-3">Depth Interval</th>
                                        <th className="px-4 py-3">Hazard Type</th>
                                        <th className="px-4 py-3">Severity</th>
                                        <th className="px-4 py-3">Consequence</th>
                                        <th className="px-4 py-3">Mitigation Recommendation</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {riskData.map((risk, i) => (
                                        <tr key={i} className="bg-white hover:bg-slate-50">
                                            <td className="px-4 py-3 font-mono">{risk.depth - 200} - {risk.depth + 200} ft</td>
                                            <td className="px-4 py-3">
                                                <Badge variant="outline" className="bg-slate-100" style={{ borderColor: RISK_COLORS[risk.type], color: RISK_COLORS[risk.type] }}>
                                                    {risk.type}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${risk.severity === 'Critical' ? 'bg-red-100 text-red-700' : risk.severity === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {risk.severity}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">
                                                Potential well control incident, 2-3 days NPT.
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 font-medium">
                                                Maintain ECD &lt; {(risk.pressure + 0.5).toFixed(1)} ppg. Pump viscous pill.
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RisksPrognosisTab;