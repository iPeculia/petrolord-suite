import React from 'react';
import { Server, Zap, Bell, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const CloudJobEngine = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader className="pb-4 border-b border-slate-800">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Server className="w-4 h-4 text-purple-400" /> Cloud Compute Status
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-400"/> GPU Usage (A100 Cluster)</span>
                        <span>45%</span>
                    </div>
                    <Progress value={45} className="h-1.5 bg-slate-800" indicatorClassName="bg-yellow-500" />
                </div>

                <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase">Active Jobs</h4>
                    {[
                        { id: 'JOB-X99', name: 'Field-Wide Correlation', status: 'processing', progress: 78 },
                        { id: 'JOB-X98', name: 'Model Training (RandomForest)', status: 'queued', progress: 0 },
                    ].map((job, i) => (
                        <div key={i} className="p-3 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-slate-200">{job.name}</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-[10px] h-4 px-1 text-slate-500 border-slate-700 uppercase">{job.status}</Badge>
                                    <span className="text-[10px] text-slate-600 font-mono">{job.id}</span>
                                </div>
                            </div>
                            {job.status === 'processing' ? (
                                <div className="w-12 h-12 relative flex items-center justify-center">
                                    <div className="absolute inset-0 border-2 border-slate-800 rounded-full"></div>
                                    <div className="absolute inset-0 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                                    <span className="text-[10px] text-blue-400">{job.progress}%</span>
                                </div>
                            ) : (
                                <Clock className="w-4 h-4 text-slate-600" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                            <Bell className="w-3 h-3 text-slate-500" />
                            Notify me on completion
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CloudJobEngine;