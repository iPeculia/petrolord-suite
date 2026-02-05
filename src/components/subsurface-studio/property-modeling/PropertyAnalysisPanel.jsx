import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FileText } from 'lucide-react';

const PropertyAnalysisPanel = ({ property = 'Porosity' }) => {
    // Mock histogram data
    const data = [
        { range: '0-5%', count: 120 },
        { range: '5-10%', count: 450 },
        { range: '10-15%', count: 890 },
        { range: '15-20%', count: 650 },
        { range: '20-25%', count: 230 },
        { range: '25%+', count: 50 },
    ];

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-slate-200">
                    <FileText className="w-4 h-4 mr-2" /> Property Statistics ({property})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis dataKey="range" fontSize={10} stroke="#64748b" />
                            <YAxis fontSize={10} stroke="#64748b" />
                            <Tooltip 
                                contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', fontSize: '12px'}}
                                cursor={{fill: '#334155', opacity: 0.2}}
                            />
                            <Bar dataKey="count" fill="#3b82f6">
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 2 ? '#22c55e' : '#3b82f6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">Mean: <span className="text-white">14.2%</span></div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">Std Dev: <span className="text-white">4.1%</span></div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">Min: <span className="text-white">2.1%</span></div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">Max: <span className="text-white">28.5%</span></div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PropertyAnalysisPanel;