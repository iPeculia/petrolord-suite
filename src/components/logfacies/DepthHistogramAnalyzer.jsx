import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2 } from 'lucide-react';

const histogramData = [
    { range: '1000-1100', sand: 40, shale: 50, lime: 10 },
    { range: '1100-1200', sand: 30, shale: 60, lime: 10 },
    { range: '1200-1300', sand: 20, shale: 40, lime: 40 },
    { range: '1300-1400', sand: 50, shale: 30, lime: 20 },
    { range: '1400-1500', sand: 60, shale: 20, lime: 20 },
];

const DepthHistogramAnalyzer = ({ faciesColors }) => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader className="py-3 border-b border-slate-800">
                <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-teal-400" /> Net Pay Distribution
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={histogramData} layout="vertical" margin={{ left: 20, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                        <XAxis type="number" stroke="#64748b" fontSize={10} label={{ value: '% Composition', position: 'bottom', offset: 0 }} />
                        <YAxis dataKey="range" type="category" stroke="#94a3b8" width={70} fontSize={10} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9', fontSize: '12px' }}
                            itemStyle={{ padding: 0 }}
                        />
                        <Bar dataKey="sand" stackId="a" fill={faciesColors?.Sandstone || "#fbbf24"} name="Sandstone" />
                        <Bar dataKey="shale" stackId="a" fill={faciesColors?.Shale || "#9ca3af"} name="Shale" />
                        <Bar dataKey="lime" stackId="a" fill={faciesColors?.Limestone || "#3b82f6"} name="Limestone" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default DepthHistogramAnalyzer;