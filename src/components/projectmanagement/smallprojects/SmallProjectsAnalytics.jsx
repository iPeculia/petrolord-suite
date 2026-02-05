import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { LayoutGrid, ArrowRightLeft, BarChart3 } from 'lucide-react';

const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6'];

export const SmallerProjectsPortfolioView = ({ projects }) => {
    const smallProjects = projects.filter(p => ['Well Intervention', 'Facility Upgrade', 'Optimization', 'Workover', 'R&D'].includes(p.project_type));

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg text-white"><LayoutGrid className="w-5 h-5"/> Smaller Projects Portfolio</CardTitle></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader><TableRow className="border-b-slate-800"><TableHead className="text-white">Project</TableHead><TableHead className="text-white">Type</TableHead><TableHead className="text-white">Stage</TableHead><TableHead className="text-right text-white">Budget ($k)</TableHead><TableHead className="text-right text-white">Progress</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {smallProjects.map((p, i) => (
                            <TableRow key={i} className="border-b-slate-800/50 hover:bg-slate-800/30">
                                <TableCell className="font-medium text-slate-200">{p.name}</TableCell>
                                <TableCell><Badge variant="outline" className="text-xs">{p.project_type}</Badge></TableCell>
                                <TableCell className="text-slate-400 text-xs">{p.stage}</TableCell>
                                <TableCell className="text-right font-mono text-slate-300">${(p.baseline_budget/1000).toFixed(0)}</TableCell>
                                <TableCell className="text-right text-slate-300">{p.percent_complete}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export const SmallerProjectsComparison = ({ projects }) => {
    const data = projects.filter(p => ['Well Intervention', 'Facility Upgrade', 'Optimization', 'Workover', 'R&D'].includes(p.project_type))
        .map(p => ({ name: p.name, budget: p.baseline_budget, progress: p.percent_complete }));

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg text-white"><ArrowRightLeft className="w-5 h-5"/> Project Comparison</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" hide />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none'}} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="budget" fill="#8884d8" name="Budget ($)" />
                        <Bar yAxisId="right" dataKey="progress" fill="#82ca9d" name="Progress (%)" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export const SmallerProjectsAnalytics = ({ projects }) => {
    const typeCounts = {};
    projects.filter(p => ['Well Intervention', 'Facility Upgrade', 'Optimization', 'Workover', 'R&D'].includes(p.project_type))
        .forEach(p => { typeCounts[p.project_type] = (typeCounts[p.project_type] || 0) + 1; });
    
    const pieData = Object.keys(typeCounts).map(key => ({ name: key, value: typeCounts[key] }));

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg text-white"><BarChart3 className="w-5 h-5"/> Portfolio Distribution</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none'}} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};