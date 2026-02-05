import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
const CodeQuality = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto text-green-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Code Quality Gate</h3>
            <p className="text-sm text-slate-500 mt-2">Coverage: 84%</p>
            <p className="text-sm text-slate-500">Technical Debt: A</p>
        </CardContent>
    </Card>
);
export default CodeQuality;