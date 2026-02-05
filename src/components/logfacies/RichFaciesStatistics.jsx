import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const statsData = [
    { name: 'Sandstone', thickness: 45, count: 450, color: '#fbbf24' },
    { name: 'Shale', thickness: 120, count: 1200, color: '#9ca3af' },
    { name: 'Limestone', thickness: 30, count: 300, color: '#3b82f6' },
    { name: 'Dolomite', thickness: 15, count: 150, color: '#a855f7' },
    { name: 'Coal', thickness: 5, count: 50, color: '#1f2937' },
];

const RichFaciesStatistics = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
             <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="py-3"><CardTitle className="text-sm text-slate-300">Net Thickness Distribution (m)</CardTitle></CardHeader>
                <CardContent className="h-[200px] p-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statsData} layout="vertical" margin={{ left: 40, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                            <XAxis type="number" stroke="#64748b" fontSize={10} />
                            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={70} fontSize={10} />
                            <Tooltip 
                                cursor={{fill: 'transparent'}}
                                contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9', fontSize: '12px'}} 
                            />
                            <Bar dataKey="thickness" radius={[0, 4, 4, 0]} barSize={20}>
                                {statsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="py-3"><CardTitle className="text-sm text-slate-300">Facies Proportions</CardTitle></CardHeader>
                <CardContent className="h-[200px] p-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statsData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={2}
                                dataKey="count"
                            >
                                {statsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }} />
                            <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{fontSize: '10px'}} />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default RichFaciesStatistics;