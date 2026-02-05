import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { ScrollArea } from '@/components/ui/scroll-area';
import { calculateZonalStats } from '@/utils/petrophysicsCalculations';

const MultiWellDashboard = ({ wells, markers }) => {
    // Aggregate Stats per well
    const wellStats = useMemo(() => {
        return wells.map(well => {
            // Calculate average properties for entire well (or pay zones if defined)
            // For simplicity, calculate global averages of key curves where valid
            const phiKey = well.curveMap['PHIE'] || well.curveMap['NPHI']; // Fallback
            const swKey = well.curveMap['SW'];
            const permKey = well.curveMap['PERM'];
            
            let phiSum = 0, swSum = 0, permSum = 0, count = 0;
            well.data.forEach(row => {
                const p = row[phiKey];
                const s = row[swKey];
                const k = row[permKey];
                if (p != null) {
                    phiSum += p;
                    if (s != null) swSum += s;
                    if (k != null) permSum += k;
                    count++;
                }
            });

            return {
                name: well.name,
                avgPhi: count ? (phiSum/count) : 0,
                avgSw: count ? (swSum/count) : 0,
                avgPerm: count ? (permSum/count) : 0,
                payCount: count // Proxy for net pay thickness if we assume step
            };
        });
    }, [wells]);

    return (
        <div className="h-full flex flex-col gap-4 p-4 bg-slate-950 overflow-y-auto">
            <h2 className="text-lg font-bold text-white mb-2">Multi-Well Comparison</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[400px]">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-300">Average Porosity & Saturation</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={wellStats} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                                <YAxis stroke="#94a3b8" fontSize={10} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    formatter={(val) => val.toFixed(3)}
                                />
                                <Legend />
                                <Bar dataKey="avgPhi" name="Avg Phi" fill="#3b82f6" />
                                <Bar dataKey="avgSw" name="Avg Sw" fill="#0ea5e9" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-300">Average Permeability (mD)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={wellStats} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                                <YAxis stroke="#94a3b8" fontSize={10} type="log" domain={['auto', 'auto']} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    formatter={(val) => val.toFixed(1)}
                                />
                                <Legend />
                                <Bar dataKey="avgPerm" name="Avg Perm" fill="#8b5cf6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="flex-1">
                <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-300">Summary Table</CardTitle>
                    </CardHeader>
                    <ScrollArea className="flex-1">
                        <div className="p-4">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-400 uppercase bg-slate-950/50">
                                    <tr>
                                        <th className="px-4 py-3">Well Name</th>
                                        <th className="px-4 py-3">Avg Porosity</th>
                                        <th className="px-4 py-3">Avg Sw</th>
                                        <th className="px-4 py-3">Avg Perm (mD)</th>
                                        <th className="px-4 py-3">Sample Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {wellStats.map((w, i) => (
                                        <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50">
                                            <td className="px-4 py-3 font-medium text-slate-200">{w.name}</td>
                                            <td className="px-4 py-3 text-slate-400">{(w.avgPhi*100).toFixed(1)}%</td>
                                            <td className="px-4 py-3 text-slate-400">{(w.avgSw*100).toFixed(1)}%</td>
                                            <td className="px-4 py-3 text-slate-400">{w.avgPerm.toFixed(1)}</td>
                                            <td className="px-4 py-3 text-slate-400">{w.payCount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </ScrollArea>
                </Card>
            </div>
        </div>
    );
};

export default MultiWellDashboard;