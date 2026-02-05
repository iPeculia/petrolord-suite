import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Zap } from 'lucide-react';

const PerformanceMonitoring = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <Zap className="w-12 h-12 mx-auto text-yellow-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">APM Insights</h3>
            <p className="text-sm text-slate-500 mt-2">Transaction traces and bottleneck detection.</p>
        </CardContent>
    </Card>
);
export default PerformanceMonitoring;