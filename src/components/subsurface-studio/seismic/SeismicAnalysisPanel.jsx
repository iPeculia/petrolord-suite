import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Activity, TrendingUp, BarChart2, Layers } from 'lucide-react';

const SeismicAnalysisPanel = ({ stats, horizonStats }) => {
    
    const amplitudeDistribution = [
        { range: '-5000', count: 120 },
        { range: '-2500', count: 450 },
        { range: '0', count: 800 },
        { range: '2500', count: 420 },
        { range: '5000', count: 150 },
    ];

    const frequencyTrend = [
        { depth: 1000, freq: 45 },
        { depth: 1500, freq: 42 },
        { depth: 2000, freq: 38 },
        { depth: 2500, freq: 30 },
        { depth: 3000, freq: 25 },
    ];

    return (
        <div className="space-y-4 h-full flex flex-col">
            <Tabs defaultValue="amplitude" className="w-full flex-grow flex flex-col">
                <TabsList className="w-full bg-slate-800 border-slate-700">
                    <TabsTrigger value="amplitude" className="flex-1 text-xs">Amplitude</TabsTrigger>
                    <TabsTrigger value="frequency" className="flex-1 text-xs">Frequency</TabsTrigger>
                    <TabsTrigger value="horizons" className="flex-1 text-xs">Horizons</TabsTrigger>
                </TabsList>

                <TabsContent value="amplitude" className="flex-grow space-y-4 mt-4">
                    <Card className="bg-slate-900 border-slate-800 shadow-none">
                        <CardHeader className="pb-2 p-3">
                            <CardTitle className="text-xs font-bold flex items-center text-blue-400 uppercase">
                                <BarChart2 className="w-3 h-3 mr-2" /> Amplitude Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-48 p-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={amplitudeDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="range" stroke="#94a3b8" fontSize={10} />
                                    <YAxis stroke="#94a3b8" fontSize={10} />
                                    <Tooltip contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', fontSize: '12px'}} />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-950 p-2 rounded border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase">RMS Amplitude</div>
                            <div className="text-lg font-mono text-white">{stats?.rms?.toFixed(0) || '--'}</div>
                        </div>
                        <div className="bg-slate-950 p-2 rounded border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase">Avg Amplitude</div>
                            <div className="text-lg font-mono text-white">{stats?.avg?.toFixed(0) || '--'}</div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="frequency" className="flex-grow space-y-4 mt-4">
                    <Card className="bg-slate-900 border-slate-800 shadow-none">
                        <CardHeader className="pb-2 p-3">
                            <CardTitle className="text-xs font-bold flex items-center text-purple-400 uppercase">
                                <Activity className="w-3 h-3 mr-2" /> Freq vs Depth Trend
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-48 p-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={frequencyTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="depth" stroke="#94a3b8" fontSize={10} label={{ value: 'Depth', position: 'insideBottom', offset: -5 }} />
                                    <YAxis stroke="#94a3b8" fontSize={10} label={{ value: 'Hz', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', fontSize: '12px'}} />
                                    <Line type="monotone" dataKey="freq" stroke="#8b5cf6" strokeWidth={2} dot={{r: 3}} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="horizons" className="flex-grow space-y-4 mt-4">
                    <div className="space-y-2">
                        {horizonStats && horizonStats.length > 0 ? (
                            horizonStats.map((h, i) => (
                                <div key={i} className="bg-slate-950 p-2 rounded border border-slate-800 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-emerald-400" />
                                        <span className="text-xs font-medium text-slate-200">{h.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-slate-500">Mean Z</div>
                                        <div className="text-xs font-mono text-white">{h.meanZ.toFixed(0)} ms</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-xs text-slate-500 italic text-center py-4">No horizons tracked</div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SeismicAnalysisPanel;