import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gauge, Server, Globe } from 'lucide-react';

const PerformanceAnalytics = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <Gauge className="w-5 h-5 mr-2 text-orange-400" /> APM Dashboard
        </h3>
        <div className="grid grid-cols-3 gap-4">
            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-4 text-center">
                    <Globe className="w-8 h-8 mx-auto text-blue-400 mb-2" />
                    <div className="text-2xl font-bold text-white">145ms</div>
                    <div className="text-xs text-slate-500">Avg Global Latency</div>
                </CardContent>
            </Card>
            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-4 text-center">
                    <Server className="w-8 h-8 mx-auto text-purple-400 mb-2" />
                    <div className="text-2xl font-bold text-white">99.98%</div>
                    <div className="text-xs text-slate-500">Uptime (30 days)</div>
                </CardContent>
            </Card>
            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-4 text-center">
                    <Gauge className="w-8 h-8 mx-auto text-green-400 mb-2" />
                    <div className="text-2xl font-bold text-white">0.02%</div>
                    <div className="text-xs text-slate-500">Error Rate</div>
                </CardContent>
            </Card>
        </div>
        <Card className="bg-slate-950 border-slate-800 h-64">
            <CardContent className="flex items-center justify-center h-full text-slate-500 text-sm">
                [Latency Time Series Graph]
            </CardContent>
        </Card>
    </div>
);

export default PerformanceAnalytics;