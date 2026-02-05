import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Cpu, Network, Zap } from 'lucide-react';

const AIMLEngine = () => {
    const stats = [
        { label: 'Active Models', value: '14', icon: BrainCircuit, color: 'text-purple-400', bg: 'bg-purple-900/20' },
        { label: 'Inference Requests', value: '1.2M', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-900/20' },
        { label: 'Training Jobs', value: '3 Running', icon: Cpu, color: 'text-blue-400', bg: 'bg-blue-900/20' },
        { label: 'Model Registry', value: '45 Versions', icon: Network, color: 'text-green-400', bg: 'bg-green-900/20' },
    ];

    return (
        <div className="h-full p-1 space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-200 flex items-center">
                        <BrainCircuit className="w-5 h-5 mr-2 text-purple-400" /> AI/ML Control Plane
                    </h3>
                    <p className="text-xs text-slate-400">Centralized MLOps dashboard for EarthModel models.</p>
                </div>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Launch Notebook
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="bg-slate-950 border-slate-800">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-200">{stat.value}</div>
                                <div className="text-xs text-slate-500">{stat.label}</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-slate-950 border-slate-800 h-64">
                    <CardContent className="p-4">
                        <h4 className="text-sm font-bold text-slate-300 mb-4">Recent Training Activity</h4>
                        <div className="space-y-3">
                            {[
                                { name: 'Seismic Fault Detection v2.1', status: 'Training', progress: 45 },
                                { name: 'Lithology Classification v1.0', status: 'Queued', progress: 0 },
                                { name: 'Porosity Prediction v3.4', status: 'Completed', progress: 100 },
                            ].map((job, i) => (
                                <div key={i} className="text-xs">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-slate-300">{job.name}</span>
                                        <span className={job.status === 'Training' ? 'text-blue-400' : job.status === 'Completed' ? 'text-green-400' : 'text-slate-500'}>
                                            {job.status}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${job.status === 'Training' ? 'bg-blue-500' : job.status === 'Completed' ? 'bg-green-500' : 'bg-slate-700'}`} 
                                            style={{ width: `${job.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-950 border-slate-800 h-64 flex items-center justify-center text-slate-500 text-sm">
                    [Inference Latency Chart Placeholder]
                </Card>
            </div>
        </div>
    );
};

export default AIMLEngine;