import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart2 } from 'lucide-react';

const MetricsMonitoring = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-blue-400" /> Custom Metrics
        </h3>
        <div className="grid grid-cols-3 gap-4">
            {['Active Projects', 'Seismic Volumes Processed', 'Well Logs Digitized'].map((metric, i) => (
                <Card key={i} className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs text-slate-500">{metric}</div>
                        <div className="text-2xl font-bold text-white mt-2">{Math.floor(Math.random() * 1000)}</div>
                        <div className="h-1 w-full bg-slate-900 mt-2 rounded overflow-hidden">
                            <div className="h-full bg-blue-500" style={{width: `${Math.random() * 100}%`}}></div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
);

export default MetricsMonitoring;