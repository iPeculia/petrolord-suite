import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Layers } from 'lucide-react';

const WellCorrelationAnalysisPanel = ({ wells }) => {
    
    // Calculate basic stats from well data
    const data = React.useMemo(() => {
        if (!wells || wells.length === 0) return [];
        
        // Example: Average GR value per well
        return wells.map(w => {
            const gr = w.log_data?.GR || [];
            const avg = gr.reduce((a, b) => a + b.value, 0) / (gr.length || 1);
            return {
                name: w.name,
                avgGR: avg,
                depth: w.meta?.kb || 0
            };
        });
    }, [wells]);

    if (data.length === 0) return null;

    return (
        <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-slate-200">
                    <Layers className="w-4 h-4 mr-2 text-amber-400" /> Stratigraphic Analysis
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="h-40">
                    <p className="text-xs text-slate-400 mb-2 text-center">Average Gamma Ray Response</p>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis dataKey="name" tick={{fontSize: 10, fill: '#94a3b8'}} interval={0} />
                            <YAxis hide />
                            <Tooltip 
                                contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', fontSize: '12px'}}
                                itemStyle={{color: '#e2e8f0'}}
                            />
                            <Bar dataKey="avgGR" radius={[4, 4, 0, 0]}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.avgGR > 60 ? '#ef4444' : '#22c55e'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-[10px] text-slate-500 text-center">
                    * Red bars indicate higher shale content (High GR)
                </div>
            </CardContent>
        </Card>
    );
};

export default WellCorrelationAnalysisPanel;