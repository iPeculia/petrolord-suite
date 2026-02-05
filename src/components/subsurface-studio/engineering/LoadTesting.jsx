import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';
const LoadTesting = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <Activity className="w-12 h-12 mx-auto text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Load Generator</h3>
            <p className="text-sm text-slate-500 mt-2">Simulate concurrent users.</p>
            <div className="mt-2 text-xs text-slate-400">Capacity: 10k req/sec</div>
        </CardContent>
    </Card>
);
export default LoadTesting;