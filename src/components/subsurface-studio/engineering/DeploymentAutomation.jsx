import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GitBranch, PlayCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';

const DeploymentAutomation = () => {
    const pipelines = [
        { id: 'b-124', branch: 'main', commit: 'a1b2c3d', status: 'success', time: '2m ago', duration: '4m 12s' },
        { id: 'b-123', branch: 'feat/seismic-gpu', commit: 'e5f6g7h', status: 'failed', time: '1h ago', duration: '2m 45s' },
        { id: 'b-122', branch: 'main', commit: 'i9j0k1l', status: 'success', time: '3h ago', duration: '4m 05s' },
    ];

    return (
        <div className="h-full p-1 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-200 flex items-center">
                    <GitBranch className="w-5 h-5 mr-2 text-orange-400" /> CI/CD Pipelines
                </h3>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-xs">
                    <PlayCircle className="w-4 h-4 mr-2" /> Trigger Deploy
                </Button>
            </div>

            <Card className="bg-slate-950 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-sm text-slate-300">Recent Workflows</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {pipelines.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-800">
                            <div className="flex items-center gap-4">
                                {p.status === 'success' ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                )}
                                <div>
                                    <div className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                        Build #{p.id}
                                        <span className="font-mono text-[10px] bg-slate-800 px-1 rounded text-slate-400">{p.commit}</span>
                                    </div>
                                    <div className="text-xs text-slate-500 flex items-center gap-2">
                                        <GitBranch className="w-3 h-3" /> {p.branch}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right text-xs text-slate-500">
                                <div className="flex items-center justify-end gap-1">
                                    <Clock className="w-3 h-3" /> {p.time}
                                </div>
                                <div>Duration: {p.duration}</div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default DeploymentAutomation;