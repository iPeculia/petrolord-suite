import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Gauge } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const MobileOptimization = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <Smartphone className="w-5 h-5 mr-2 text-blue-400" /> Optimization Score
        </h3>
        <div className="grid grid-cols-3 gap-4">
            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-green-400">98</div>
                    <div className="text-xs text-slate-500 mt-1">Lighthouse Mobile</div>
                </CardContent>
            </Card>
            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-white">1.2s</div>
                    <div className="text-xs text-slate-500 mt-1">Time to Interactive (3G)</div>
                </CardContent>
            </Card>
            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-white">0</div>
                    <div className="text-xs text-slate-500 mt-1">Touch Target Errors</div>
                </CardContent>
            </Card>
        </div>
        <Card className="bg-slate-950 border-slate-800">
            <CardContent className="p-4">
                <h4 className="text-sm font-bold text-slate-300 mb-2">Device Coverage</h4>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400"><span>iOS (Safari)</span> <span>95%</span></div>
                    <Progress value={95} className="h-1 bg-slate-900" />
                    <div className="flex justify-between text-xs text-slate-400"><span>Android (Chrome)</span> <span>92%</span></div>
                    <Progress value={92} className="h-1 bg-slate-900" />
                </div>
            </CardContent>
        </Card>
    </div>
);

export default MobileOptimization;