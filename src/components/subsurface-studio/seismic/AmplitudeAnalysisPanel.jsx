import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Waves, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AmplitudeAnalysisPanel = ({ stats }) => {
    const data = [
        { name: 'Min', value: stats.min },
        { name: 'Avg', value: stats.avg },
        { name: 'RMS', value: stats.rms },
        { name: 'Max', value: stats.max },
    ];

    return (
        <Card className="bg-slate-900 border-slate-800 shadow-none">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center text-blue-400">
                    <Waves className="w-4 h-4 mr-2" /> Amplitude Stats
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-6 w-6"><Download className="w-3 h-3"/></Button>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={30} />
                            <Tooltip 
                                contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', fontSize: '12px'}}
                                cursor={{fill: '#334155', opacity: 0.2}}
                            />
                            <Bar dataKey="value" barSize={15} radius={[0, 4, 4, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.value < 0 ? '#ef4444' : '#3b82f6'} />
                                ))}
                            </Bar>
                            <ReferenceLine x={0} stroke="#64748b" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 bg-slate-950 p-2 rounded">
                    <div className="flex justify-between"><span>RMS:</span> <span className="text-white font-mono">{stats.rms.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Avg:</span> <span className="text-white font-mono">{stats.avg.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Min:</span> <span className="text-white font-mono">{stats.min.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Max:</span> <span className="text-white font-mono">{stats.max.toFixed(2)}</span></div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AmplitudeAnalysisPanel;