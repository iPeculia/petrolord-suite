import React from 'react';
import { Box, Activity, Database, CheckCircle2, RefreshCcw, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const integrations = [
    { id: 'ems', name: 'EarthModel Studio', icon: Box, status: 'connected', lastSync: '5m ago', desc: 'Syncing 3D Facies Distribution' },
    { id: 'fdp', name: 'FDP Accelerator', icon: Activity, status: 'connected', lastSync: '1h ago', desc: 'Pushing Net Pay summaries' },
    { id: 'mbal', name: 'Material Balance', icon: Database, status: 'disconnected', lastSync: '-', desc: 'Waiting for connection' },
];

const PetrolordSuiteIntegration = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader className="pb-4 border-b border-slate-800">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Activity className="w-4 h-4 text-lime-400" /> Suite Connectivity
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                {integrations.map((app) => {
                    const Icon = app.icon;
                    return (
                        <div key={app.id} className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800 group">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${app.status === 'connected' ? 'bg-blue-900/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-white">{app.name}</h4>
                                    <p className="text-xs text-slate-500">{app.desc}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center justify-end gap-2 mb-1">
                                    {app.status === 'connected' && <span className="text-[10px] text-slate-500">Synced {app.lastSync}</span>}
                                    <Badge variant="outline" className={app.status === 'connected' ? 'text-green-400 border-green-900' : 'text-slate-500'}>
                                        {app.status}
                                    </Badge>
                                </div>
                                {app.status === 'connected' ? (
                                    <Button size="xs" variant="ghost" className="h-6 text-blue-400 hover:text-blue-300">
                                        <RefreshCcw className="w-3 h-3 mr-1" /> Sync Now
                                    </Button>
                                ) : (
                                    <Button size="xs" variant="ghost" className="h-6">
                                        Connect <ArrowUpRight className="w-3 h-3 ml-1" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
};

export default PetrolordSuiteIntegration;