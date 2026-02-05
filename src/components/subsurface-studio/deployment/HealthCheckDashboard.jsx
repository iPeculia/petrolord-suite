import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Server, Database, Globe, Wifi, Cpu, HardDrive, Lock } from 'lucide-react';

const HealthCheckDashboard = () => {
    return (
        <div className="h-full p-4 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center">
                    <Activity className="w-6 h-6 mr-2 text-green-400" /> System Health
                </h2>
                <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm text-green-400 font-medium">All Systems Operational</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-xs text-slate-500 uppercase font-bold">Uptime (30d)</div>
                            <div className="text-2xl font-bold text-white mt-1">99.99%</div>
                        </div>
                        <Activity className="w-8 h-8 text-green-500/20" />
                    </CardContent>
                </Card>
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-xs text-slate-500 uppercase font-bold">Avg Latency</div>
                            <div className="text-2xl font-bold text-white mt-1">45ms</div>
                        </div>
                        <Wifi className="w-8 h-8 text-blue-500/20" />
                    </CardContent>
                </Card>
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-xs text-slate-500 uppercase font-bold">Error Rate</div>
                            <div className="text-2xl font-bold text-white mt-1">0.02%</div>
                        </div>
                        <Activity className="w-8 h-8 text-red-500/20" />
                    </CardContent>
                </Card>
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-xs text-slate-500 uppercase font-bold">Active Sessions</div>
                            <div className="text-2xl font-bold text-white mt-1">842</div>
                        </div>
                        <Globe className="w-8 h-8 text-purple-500/20" />
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold text-slate-300">Infrastructure Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { name: 'Primary Database (Supabase)', icon: Database, status: 'Healthy', latency: '12ms' },
                            { name: 'Storage Bucket (S3)', icon: HardDrive, status: 'Healthy', latency: '24ms' },
                            { name: 'Edge Functions', icon: Server, status: 'Healthy', latency: '45ms' },
                            { name: 'Authentication Service', icon: Lock, status: 'Healthy', latency: '18ms' },
                        ].map((service, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-800">
                                <div className="flex items-center gap-3">
                                    <service.icon className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <div className="text-sm font-medium text-slate-200">{service.name}</div>
                                        <div className="text-xs text-green-400 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            {service.status}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs font-mono text-slate-500">{service.latency}</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold text-slate-300">Resource Usage</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <div className="flex justify-between text-xs mb-2">
                                <span className="text-slate-400 flex items-center"><Cpu className="w-3 h-3 mr-1" /> CPU Load</span>
                                <span className="text-white font-bold">42%</span>
                            </div>
                            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[42%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-2">
                                <span className="text-slate-400 flex items-center"><HardDrive className="w-3 h-3 mr-1" /> Memory Usage</span>
                                <span className="text-white font-bold">68%</span>
                            </div>
                            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-[68%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-2">
                                <span className="text-slate-400 flex items-center"><Database className="w-3 h-3 mr-1" /> Database Connections</span>
                                <span className="text-white font-bold">24/100</span>
                            </div>
                            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[24%]"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default HealthCheckDashboard;