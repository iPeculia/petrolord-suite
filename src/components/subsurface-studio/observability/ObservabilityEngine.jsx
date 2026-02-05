import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, AlertTriangle, Eye, Server, ShieldAlert } from 'lucide-react';

const ObservabilityEngine = () => {
    return (
        <div className="h-full p-1 space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-200 flex items-center">
                        <Eye className="w-5 h-5 mr-2 text-indigo-400" /> Observability Engine
                    </h3>
                    <p className="text-xs text-slate-400">Centralized telemetry: Metrics, Logs, and Traces.</p>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="destructive"><ShieldAlert className="w-4 h-4 mr-2" /> Declare Incident</Button>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700"><Activity className="w-4 h-4 mr-2" /> Live Tail</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs text-slate-500 uppercase">System Health</div>
                        <div className="text-2xl font-bold text-green-400">99.98%</div>
                        <div className="text-[10px] text-slate-400 mt-1">All systems operational</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs text-slate-500 uppercase">Active Alerts</div>
                        <div className="text-2xl font-bold text-yellow-400">3</div>
                        <div className="text-[10px] text-slate-400 mt-1">2 Warning, 1 Critical</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs text-slate-500 uppercase">Error Rate (1h)</div>
                        <div className="text-2xl font-bold text-white">0.05%</div>
                        <div className="text-[10px] text-green-400 mt-1">-0.01% vs avg</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs text-slate-500 uppercase">Log Volume</div>
                        <div className="text-2xl font-bold text-white">24GB</div>
                        <div className="text-[10px] text-slate-400 mt-1">Last 24 hours</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Card className="col-span-2 bg-slate-950 border-slate-800 h-64">
                    <CardHeader><CardTitle className="text-sm text-slate-300">Request Volume (RPM)</CardTitle></CardHeader>
                    <CardContent className="flex items-end justify-between h-40 px-2 gap-1">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <div key={i} className="w-full bg-indigo-500/20 hover:bg-indigo-500/40 rounded-t transition-all" style={{ height: `${30 + Math.random() * 70}%` }}></div>
                        ))}
                    </CardContent>
                </Card>
                <Card className="bg-slate-950 border-slate-800 h-64">
                    <CardHeader><CardTitle className="text-sm text-slate-300">Recent Incidents</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-start gap-2 p-2 rounded bg-red-900/10 border border-red-900/30">
                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                            <div>
                                <div className="text-xs font-bold text-red-400">API Latency Spike</div>
                                <div className="text-[10px] text-slate-500">Resolved • 2h ago</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 p-2 rounded bg-yellow-900/10 border border-yellow-900/30">
                            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                            <div>
                                <div className="text-xs font-bold text-yellow-400">High Memory Usage</div>
                                <div className="text-[10px] text-slate-500">Active • 15m ago</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ObservabilityEngine;