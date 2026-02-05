import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Network } from 'lucide-react';

const LoadBalancing = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <Network className="w-12 h-12 mx-auto text-blue-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Traffic Distribution</h3>
            <p className="text-sm text-slate-500 mt-2">Configuring HAProxy / ALB rules.</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-400">
                <div className="p-2 bg-slate-900 rounded">US-East (Primary)<br/><span className="text-green-400 font-bold">60%</span></div>
                <div className="p-2 bg-slate-900 rounded">EU-West (Secondary)<br/><span className="text-green-400 font-bold">30%</span></div>
                <div className="p-2 bg-slate-900 rounded">Asia-Pacific<br/><span className="text-green-400 font-bold">10%</span></div>
            </div>
        </CardContent>
    </Card>
);
export default LoadBalancing;