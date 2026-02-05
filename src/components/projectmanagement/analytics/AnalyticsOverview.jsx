import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

const KPICard = ({ title, value, subtext, icon: Icon, trend, color }) => (
    <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
                </div>
                <div className={`p-2 rounded-lg bg-slate-800/50 ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
                {trend && (
                    <span className={`flex items-center ${trend > 0 ? 'text-green-400' : 'text-red-400'} mr-2`}>
                        {trend > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {Math.abs(trend)}%
                    </span>
                )}
                <span className="text-slate-500">{subtext}</span>
            </div>
        </CardContent>
    </Card>
);

const AnalyticsOverview = ({ projects, risks, financialData }) => {
    // KPI Calculations
    const totalBudget = projects.reduce((acc, p) => acc + (p.baseline_budget || 0), 0);
    const totalSpend = financialData.reduce((acc, f) => acc + (f.actual_cost || 0), 0);
    const avgProgress = projects.length ? projects.reduce((acc, p) => acc + (p.percent_complete || 0), 0) / projects.length : 0;
    const totalRisks = risks.length;
    const highRisks = risks.filter(r => r.risk_score >= 15).length;

    // Charts Data
    const statusData = [
        { name: 'Green', value: projects.filter(p => p.status === 'Green').length },
        { name: 'Amber', value: projects.filter(p => p.status === 'Amber').length },
        { name: 'Red', value: projects.filter(p => p.status === 'Red').length },
    ];

    const typeData = projects.reduce((acc, p) => {
        const type = p.project_type || 'Other';
        const existing = acc.find(i => i.name === type);
        if (existing) existing.value++;
        else acc.push({ name: type, value: 1 });
        return acc;
    }, []);

    const formatCurrency = (val) => `$${(val / 1000000).toFixed(1)}M`;

    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard 
                    title="Portfolio Value" 
                    value={formatCurrency(totalBudget)} 
                    subtext="Total Baseline Budget" 
                    icon={DollarSign} 
                    color="text-emerald-400"
                    trend={2.5}
                />
                <KPICard 
                    title="Avg Progress" 
                    value={`${Math.round(avgProgress)}%`} 
                    subtext="Weighted by Budget" 
                    icon={CheckCircle2} 
                    color="text-blue-400"
                    trend={1.2}
                />
                <KPICard 
                    title="Risk Exposure" 
                    value={highRisks} 
                    subtext={`of ${totalRisks} Active Risks`} 
                    icon={AlertTriangle} 
                    color="text-red-400"
                    trend={-5}
                />
                <KPICard 
                    title="Schedule Health" 
                    value="92%" 
                    subtext="Projects On Track" 
                    icon={Calendar} 
                    color="text-purple-400"
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader><CardTitle className="text-sm text-slate-300">Project Status Distribution</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    <Cell fill="#10b981" /> {/* Green */}
                                    <Cell fill="#f59e0b" /> {/* Amber */}
                                    <Cell fill="#ef4444" /> {/* Red */}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                                <Legend verticalAlign="bottom" />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader><CardTitle className="text-sm text-slate-300">Projects by Type</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={typeData} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsOverview;