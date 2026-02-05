import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, Gauge, Zap, Timer } from 'lucide-react';

const PerformanceProfiler = () => {
    const metrics = [
        { name: 'First Contentful Paint (FCP)', value: 850, unit: 'ms', score: 95, target: '< 1.8s' },
        { name: 'Largest Contentful Paint (LCP)', value: 1.2, unit: 's', score: 92, target: '< 2.5s' },
        { name: 'Cumulative Layout Shift (CLS)', value: 0.02, unit: '', score: 98, target: '< 0.1' },
        { name: 'Time to Interactive (TTI)', value: 2.1, unit: 's', score: 88, target: '< 3.8s' },
    ];

    return (
        <div className="h-full p-1 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-200 flex items-center">
                    <Gauge className="w-5 h-5 mr-2 text-green-400" /> Performance Profiler
                </h3>
                <div className="px-3 py-1 bg-green-900/30 border border-green-800 rounded text-xs text-green-400 font-mono">
                    Lighthouse Score: 96/100
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, i) => (
                    <Card key={i} className="bg-slate-950 border-slate-800">
                        <CardContent className="p-4">
                            <div className="text-xs text-slate-500 mb-1">{m.name}</div>
                            <div className="text-2xl font-mono text-slate-200 mb-2">
                                {m.value}<span className="text-sm text-slate-500 ml-1">{m.unit}</span>
                            </div>
                            <Progress value={m.score} className="h-1.5 mb-2" />
                            <div className="flex justify-between text-[10px]">
                                <span className="text-slate-400">Target: {m.target}</span>
                                <span className="text-green-400 font-bold">{m.score}/100</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-slate-950 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-sm text-slate-300 flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-yellow-400" /> Hot Path Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {[
                            { path: '3D Rendering Loop', cost: '12ms', calls: '60/sec', status: 'Optimized' },
                            { path: 'Seismic Volume Decode', cost: '45ms', calls: 'On Demand', status: 'Heavy' },
                            { path: 'WebSocket State Sync', cost: '2ms', calls: 'Continuous', status: 'Light' },
                        ].map((path, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-800 text-xs">
                                <div className="flex items-center gap-3">
                                    <Activity className="w-4 h-4 text-slate-500" />
                                    <span className="font-mono text-slate-300">{path.path}</span>
                                </div>
                                <div className="flex gap-4 text-slate-400">
                                    <span>Avg: {path.cost}</span>
                                    <span>Freq: {path.calls}</span>
                                    <span className={path.status === 'Optimized' ? 'text-green-400' : path.status === 'Heavy' ? 'text-orange-400' : 'text-blue-400'}>{path.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PerformanceProfiler;