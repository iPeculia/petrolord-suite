import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, CheckCircle2, XCircle, AlertTriangle, Server, Database, Shield, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SystemIntegrationEngine = () => {
    const subsystems = [
        { name: 'Authentication Service', status: 'Healthy', latency: '45ms', icon: Shield },
        { name: 'PostgreSQL Database', status: 'Healthy', latency: '12ms', icon: Database },
        { name: 'Object Storage (S3)', status: 'Healthy', latency: '120ms', icon: Server },
        { name: 'Compute Cluster (K8s)', status: 'Warning', latency: 'N/A', icon: Activity },
        { name: 'CDN / Edge', status: 'Healthy', latency: '24ms', icon: Globe },
    ];

    return (
        <div className="h-full p-1 space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-200 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-cyan-400" /> System Integration Hub
                    </h3>
                    <p className="text-xs text-slate-400">Real-time status of all integrated subsystems.</p>
                </div>
                <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                    Run Integration Tests
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {subsystems.map((sys, i) => (
                    <Card key={i} className="bg-slate-950 border-slate-800">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-full bg-slate-900 ${sys.status === 'Healthy' ? 'text-green-400' : sys.status === 'Warning' ? 'text-yellow-400' : 'text-red-400'}`}>
                                    <sys.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-200">{sys.name}</div>
                                    <div className="text-xs text-slate-500 flex gap-2">
                                        <span>Latency: {sys.latency}</span>
                                        <span>•</span>
                                        <span>Uptime: 99.99%</span>
                                    </div>
                                </div>
                            </div>
                            <Badge variant="outline" className={`${
                                sys.status === 'Healthy' ? 'border-green-500 text-green-400' : 
                                sys.status === 'Warning' ? 'border-yellow-500 text-yellow-400' : 
                                'border-red-500 text-red-400'
                            }`}>
                                {sys.status === 'Healthy' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : 
                                 sys.status === 'Warning' ? <AlertTriangle className="w-3 h-3 mr-1" /> : 
                                 <XCircle className="w-3 h-3 mr-1" />}
                                {sys.status}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SystemIntegrationEngine;