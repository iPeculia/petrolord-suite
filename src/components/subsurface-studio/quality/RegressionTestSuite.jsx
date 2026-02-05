import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GitCompare } from 'lucide-react';

const RegressionTestSuite = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <GitCompare className="w-5 h-5 mr-2 text-cyan-400" /> Regression Analysis
        </h3>
        <Card className="bg-slate-950 border-slate-800">
            <CardContent className="p-6 text-center text-slate-500">
                <p className="mb-2">Comparing Build #124 vs #123</p>
                <div className="text-sm text-green-400">No regressions detected in core functionality.</div>
            </CardContent>
        </Card>
    </div>
);

export default RegressionTestSuite;