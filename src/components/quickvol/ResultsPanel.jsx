import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ResultsPanel = ({ results }) => {
    const { toast } = useToast();

    if (!results) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 border-2 border-dashed border-slate-800 rounded-lg">
                No probabilistic results to display. Run a simulation.
            </div>
        );
    }

    const formatNum = (n, unit = '') => {
        if (n === undefined || n === null) return '-';
        if (n === 0) return '0';
        if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2) + ' B';
        if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + ' MM';
        if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(2) + ' M';
        return n.toFixed(1);
    };

    const handleDownload = () => {
        toast({
            title: "Download Initiated",
            description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
            variant: "default",
        });
    };

    const inPlaceVolume = results.in_place;
    const recoverableVolume = results.recoverable;
    const units = results.unit_label;
    const totalSimulations = results.iterations;

    return (
        <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-white">Probabilistic Results Pro</CardTitle>
                <Button variant="outline" size="sm" onClick={handleDownload} className="border-slate-700 text-slate-400">
                    <Download className="h-4 w-4 mr-2" /> Export Data
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-slate-800 border-slate-700 p-4">
                        <CardTitle className="text-sm font-medium text-slate-400">P10</CardTitle>
                        <div className="text-2xl font-bold text-white mt-1">{formatNum(inPlaceVolume?.p10, units)}</div>
                        <p className="text-xs text-slate-500">In-place</p>
                    </Card>
                    <Card className="bg-slate-800 border-slate-700 p-4">
                        <CardTitle className="text-sm font-medium text-slate-400">P50</CardTitle>
                        <div className="text-2xl font-bold text-white mt-1">{formatNum(inPlaceVolume?.p50, units)}</div>
                        <p className="text-xs text-slate-500">In-place</p>
                    </Card>
                    <Card className="bg-slate-800 border-slate-700 p-4">
                        <CardTitle className="text-sm font-medium text-slate-400">P90</CardTitle>
                        <div className="text-2xl font-bold text-white mt-1">{formatNum(inPlaceVolume?.p90, units)}</div>
                        <p className="text-xs text-slate-500">In-place</p>
                    </Card>
                    <Card className="bg-slate-800 border-slate-700 p-4">
                        <CardTitle className="text-sm font-medium text-slate-400">Mean</CardTitle>
                        <div className="text-2xl font-bold text-white mt-1">{formatNum(inPlaceVolume?.mean, units)}</div>
                        <p className="text-xs text-slate-500">In-place</p>
                    </Card>
                </div>

                <h3 className="text-lg font-semibold text-white mt-4">STOOIP Probability Distribution Pro</h3>
                <div className="h-[250px] w-full bg-slate-800 rounded-lg p-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={results.stooip_distribution}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="value" stroke="#94a3b8" tickFormatter={(value) => formatNum(value)} label={{ value: `STOOIP (${units})`, position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                            <YAxis stroke="#94a3b8" label={{ value: 'Probability Density', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                            <Tooltip
                                formatter={(value) => `${formatNum(value)}`}
                                labelFormatter={(label) => `STOOIP: ${formatNum(label)} ${units}`}
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                            />
                            <ReferenceLine x={inPlaceVolume?.p10} stroke="orange" strokeDasharray="3 3" label={{ value: 'P10', position: 'top', fill: 'orange', fontSize: 10 }} />
                            <ReferenceLine x={inPlaceVolume?.p50} stroke="cyan" strokeDasharray="3 3" label={{ value: 'P50', position: 'top', fill: 'cyan', fontSize: 10 }} />
                            <ReferenceLine x={inPlaceVolume?.p90} stroke="green" strokeDasharray="3 3" label={{ value: 'P90', position: 'top', fill: 'green', fontSize: 10 }} />
                            <Area type="monotone" dataKey="density" stroke="#8884d8" fillOpacity={1} fill="#8884d8" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {recoverableVolume && (
                    <>
                        <h3 className="text-lg font-semibold text-white mt-4">Recoverable Volume Distribution Pro</h3>
                        <div className="h-[250px] w-full bg-slate-800 rounded-lg p-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={results.recoverable_distribution}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="value" stroke="#94a3b8" tickFormatter={(value) => formatNum(value)} label={{ value: `Recoverable (${units})`, position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                                    <YAxis stroke="#94a3b8" label={{ value: 'Probability Density', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                                    <Tooltip
                                        formatter={(value) => `${formatNum(value)}`}
                                        labelFormatter={(label) => `Recoverable: ${formatNum(label)} ${units}`}
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                                    />
                                    <ReferenceLine x={recoverableVolume?.p10} stroke="orange" strokeDasharray="3 3" label={{ value: 'P10', position: 'top', fill: 'orange', fontSize: 10 }} />
                                    <ReferenceLine x={recoverableVolume?.p50} stroke="cyan" strokeDasharray="3 3" label={{ value: 'P50', position: 'top', fill: 'cyan', fontSize: 10 }} />
                                    <ReferenceLine x={recoverableVolume?.p90} stroke="green" strokeDasharray="3 3" label={{ value: 'P90', position: 'top', fill: 'green', fontSize: 10 }} />
                                    <Area type="monotone" dataKey="density" stroke="#82ca9d" fillOpacity={1} fill="#82ca9d" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default ResultsPanel;