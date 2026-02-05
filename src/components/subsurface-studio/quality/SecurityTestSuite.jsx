import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Lock } from 'lucide-react';

const SecurityTestSuite = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-red-400" /> Security Scan
        </h3>
        <div className="grid grid-cols-2 gap-4">
            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-4">
                    <div className="text-xs text-slate-500">OWASP Top 10</div>
                    <div className="text-xl font-bold text-green-400 mt-1">Clean</div>
                    <p className="text-[10px] text-slate-500 mt-2">Last scan: 2 hours ago</p>
                </CardContent>
            </Card>
            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-4">
                    <div className="text-xs text-slate-500">Dependency Audit</div>
                    <div className="text-xl font-bold text-yellow-400 mt-1">3 Low Severity</div>
                    <p className="text-[10px] text-slate-500 mt-2">npm audit results</p>
                </CardContent>
            </Card>
        </div>
    </div>
);

export default SecurityTestSuite;