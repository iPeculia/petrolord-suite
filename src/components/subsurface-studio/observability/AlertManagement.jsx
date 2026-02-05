import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const AlertManagement = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-yellow-400" /> Alert Rules
        </h3>
        <div className="space-y-2">
            {['CPU Usage > 85% (5m)', 'Error Rate > 1% (1m)', 'API Latency > 500ms (p95)', 'Storage Free < 10GB'].map((rule, i) => (
                <Card key={i} className="bg-slate-950 border-slate-800">
                    <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-300">{rule}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500">Severity: {i === 0 ? 'Critical' : 'Warning'}</span>
                            <Switch defaultChecked={true} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
);

export default AlertManagement;