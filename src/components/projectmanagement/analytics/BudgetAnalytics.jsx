import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, Cell } from 'recharts';

const BudgetAnalytics = ({ projects, financialData }) => {
    // Mock trend data if financialData is sparse
    const trendData = [
        { month: 'Jan', Budget: 100, Actual: 90, Forecast: 100 },
        { month: 'Feb', Budget: 220, Actual: 210, Forecast: 220 },
        { month: 'Mar', Budget: 350, Actual: 340, Forecast: 360 },
        { month: 'Apr', Budget: 480, Actual: 490, Forecast: 500 },
        { month: 'May', Budget: 600, Actual: 620, Forecast: 650 },
        { month: 'Jun', Budget: 750, Actual: 780, Forecast: 800 },
    ];

    const varianceData = projects.slice(0, 8).map(p => ({
        name: p.name.substring(0, 10) + '...',
        variance: ((Math.random() * 20) - 10).toFixed(1) // Mock variance %
    }));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="bg-slate-900 border-slate-800 h-full">
                        <CardHeader><CardTitle className="text-sm text-slate-300">Cumulative Cost Trends (Portfolio)</CardTitle></CardHeader>
                        <CardContent className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="month" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                                    <Legend />
                                    <Area type="monotone" dataKey="Budget" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBudget)" />
                                    <Area type="monotone" dataKey="Actual" stroke="#ef4444" fillOpacity={1} fill="url(#colorActual)" />
                                    <Area type="monotone" dataKey="Forecast" stroke="#f59e0b" strokeDasharray="5 5" fill="none" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card className="bg-slate-900 border-slate-800 h-full">
                        <CardHeader><CardTitle className="text-sm text-slate-300">Cost Variance % (Selected Projects)</CardTitle></CardHeader>
                        <CardContent className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={varianceData} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                    <XAxis type="number" stroke="#94a3b8" />
                                    <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} fontSize={10} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                                    <Bar dataKey="variance" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                                        {varianceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.variance > 0 ? '#ef4444' : '#10b981'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BudgetAnalytics;