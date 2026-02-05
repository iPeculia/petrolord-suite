import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';

const AIMonitoring = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <Activity className="w-12 h-12 mx-auto text-red-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Drift Detection</h3>
            <p className="text-sm text-slate-500 mt-2">Monitoring data distribution shifts.</p>
            <div className="mt-4 text-xs text-green-400">No drift detected in last 24h.</div>
        </CardContent>
    </Card>
);

export default AIMonitoring;