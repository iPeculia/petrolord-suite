import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
    { range: '1000-1100', Sand: 40, Shale: 50, Lime: 10 },
    { range: '1100-1200', Sand: 30, Shale: 60, Lime: 10 },
    { range: '1200-1300', Sand: 20, Shale: 40, Lime: 40 },
    { range: '1300-1400', Sand: 50, Shale: 30, Lime: 20 },
    { range: '1400-1500', Sand: 60, Shale: 20, Lime: 20 },
];

const DepthHistogram = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader className="py-3"><CardTitle className="text-sm">Facies Proportions by Depth</CardTitle></CardHeader>
            <CardContent className="h-[250px] p-2">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                        <XAxis type="number" stroke="#64748b" fontSize={10} />
                        <YAxis dataKey="range" type="category" stroke="#94a3b8" width={70} fontSize={10} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9', fontSize: '12px' }}
                            itemStyle={{ padding: 0 }}
                        />
                        <Bar dataKey="Sand" stackId="a" fill="#fbbf24" />
                        <Bar dataKey="Shale" stackId="a" fill="#9ca3af" />
                        <Bar dataKey="Lime" stackId="a" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default DepthHistogram;