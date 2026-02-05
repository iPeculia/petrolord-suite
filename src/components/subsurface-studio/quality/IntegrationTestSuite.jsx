import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Network, CheckCircle2, XCircle } from 'lucide-react';

const IntegrationTestSuite = () => {
    const tests = [
        { name: 'User Authentication Flow', status: 'pass', duration: '1.2s' },
        { name: 'Project Creation & Asset Link', status: 'pass', duration: '2.4s' },
        { name: 'Seismic Volume Upload & Tile Generation', status: 'pass', duration: '5.1s' },
        { name: 'Well Log Parser -> Database Sync', status: 'fail', duration: '3.8s', error: 'Timeout awaiting db commit' },
        { name: 'Realtime Cursor Broadcast', status: 'pass', duration: '0.8s' },
    ];

    return (
        <div className="h-full p-1 space-y-4">
            <h3 className="text-lg font-bold text-slate-200 flex items-center">
                <Network className="w-5 h-5 mr-2 text-blue-400" /> Integration Tests
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4">
                        <h4 className="text-sm font-bold text-slate-300 mb-4">Recent Runs</h4>
                        <ScrollArea className="h-[400px]">
                            <div className="space-y-2">
                                {tests.map((t, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-800">
                                        <div className="flex items-center gap-3">
                                            {t.status === 'pass' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                                            <div>
                                                <div className="text-sm font-medium text-slate-200">{t.name}</div>
                                                {t.error && <div className="text-[10px] text-red-400">{t.error}</div>}
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-500 font-mono">{t.duration}</div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4">
                        <h4 className="text-sm font-bold text-slate-300 mb-4">Topology Status</h4>
                        <div className="h-[400px] bg-slate-900 rounded border border-slate-800 flex items-center justify-center text-slate-500">
                            Visualization of Service Mesh (Supabase - Edge - Client)
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default IntegrationTestSuite;