import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { CheckSquare } from 'lucide-react';

const ModelEvaluation = () => {
    const data = [
        { metric: 'Accuracy', value: 94 },
        { metric: 'Precision', value: 88 },
        { metric: 'Recall', value: 92 },
        { metric: 'F1 Score', value: 90 },
    ];

    return (
        <div className="space-y-4 h-full p-1">
            <Card className="bg-slate-950 border-slate-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center text-slate-200"><CheckSquare className="w-4 h-4 mr-2 text-blue-400"/> Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-48 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis type="number" domain={[0, 100]} stroke="#666" />
                                <YAxis dataKey="metric" type="category" stroke="#ccc" width={80} style={{fontSize: '10px'}} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1e293b', border: 'none'}} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ModelEvaluation;