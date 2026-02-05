import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';

const data = [
    { phi: 0, cumPay: 100 },
    { phi: 0.05, cumPay: 98 },
    { phi: 0.08, cumPay: 92 }, // Knee
    { phi: 0.10, cumPay: 85 },
    { phi: 0.15, cumPay: 60 },
    { phi: 0.20, cumPay: 30 },
    { phi: 0.25, cumPay: 5 },
    { phi: 0.30, cumPay: 0 },
];

const CutoffOptimizer = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Cutoff Optimization (Phi)</CardTitle>
                <Button size="xs" variant="ghost" className="h-6 text-purple-400 hover:text-purple-300"><Wand2 className="w-3 h-3 mr-1"/> Auto-Detect</Button>
            </CardHeader>
            <CardContent className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="phi" stroke="#64748b" fontSize={10} label={{ value: 'Porosity', position: 'bottom', offset: 0, fontSize: 10 }} />
                        <YAxis stroke="#64748b" fontSize={10} label={{ value: '% Pay Retained', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }} />
                        <Line type="monotone" dataKey="cumPay" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        <ReferenceLine x={0.08} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Suggested: 0.08', fill: '#ef4444', fontSize: 10 }} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default CutoffOptimizer;