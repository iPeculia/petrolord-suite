import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle, Video, FileText } from 'lucide-react';

const E2ETestSuite = () => {
    const suites = [
        { id: 'E2E-101', name: 'Smoke Test - Login to Dashboard', status: 'pass', artifacts: true },
        { id: 'E2E-102', name: 'Create New Project Wizard', status: 'pass', artifacts: true },
        { id: 'E2E-103', name: '3D Viewer Interaction', status: 'pass', artifacts: true },
        { id: 'E2E-104', name: 'Export PDF Report', status: 'fail', artifacts: true },
    ];

    return (
        <div className="h-full p-1 space-y-4">
            <h3 className="text-lg font-bold text-slate-200 flex items-center">
                <PlayCircle className="w-5 h-5 mr-2 text-pink-400" /> E2E User Flows
            </h3>

            <div className="grid grid-cols-1 gap-4">
                {suites.map((s, i) => (
                    <Card key={i} className="bg-slate-950 border-slate-800">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-slate-500">{s.id}</span>
                                    <span className={`text-sm font-bold ${s.status === 'pass' ? 'text-slate-200' : 'text-red-400'}`}>{s.name}</span>
                                </div>
                                <div className="text-xs text-slate-500 mt-1">Last run: 15 mins ago on Chrome v120</div>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-2 py-1 bg-slate-900 rounded border border-slate-800 flex items-center text-xs text-blue-400 cursor-pointer hover:bg-slate-800">
                                    <Video className="w-3 h-3 mr-1" /> Replay
                                </div>
                                <div className="px-2 py-1 bg-slate-900 rounded border border-slate-800 flex items-center text-xs text-slate-400 cursor-pointer hover:bg-slate-800">
                                    <FileText className="w-3 h-3 mr-1" /> Logs
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default E2ETestSuite;