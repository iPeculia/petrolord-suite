import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ScenarioComparison = ({ scenarios }) => {
    if (!scenarios || scenarios.length === 0) return null;

    // Helper to safely format numbers, handling null/undefined/NaN
    const safeToFixed = (value, precision = 2) => {
        if (value === null || value === undefined) return 'N/A';
        const num = Number(value);
        return !isNaN(num) ? num.toFixed(precision) : 'N/A';
    };

    // Helper to get safe numeric value for charts (returns 0 for invalid inputs to prevent chart errors)
    const safeNum = (value) => {
        const num = Number(value);
        return !isNaN(num) ? num : 0;
    };

    // Prepare data for the chart
    // We strictly validate inputs to avoid .toFixed() crashes or chart rendering issues
    const data = scenarios.map(s => {
        // Calculate min safety factor safely
        let minSF = 0;
        const burstSF = s.minBurstSF?.sf !== undefined ? s.minBurstSF.sf : (s.minBurstSF !== undefined ? s.minBurstSF : null);
        const collapseSF = s.minCollapseSF?.sf !== undefined ? s.minCollapseSF.sf : (s.minCollapseSF !== undefined ? s.minCollapseSF : null);
        
        if (burstSF !== null && collapseSF !== null) {
            minSF = Math.min(burstSF, collapseSF);
        } else if (burstSF !== null) {
            minSF = burstSF;
        } else if (collapseSF !== null) {
            minSF = collapseSF;
        }

        return {
            name: s.name || 'Unnamed Scenario',
            'Max Wear (mm)': safeNum(s.maxWearDepth?.wear !== undefined ? s.maxWearDepth.wear : s.maxWearDepth),
            'Min SF': safeNum(minSF),
            'Risk Score': safeNum(s.riskScore),
        };
    });

    // Helper to extract nested values safely for the table
    const getValue = (scenario, key) => {
        if (!scenario) return null;
        
        // Handle nested objects like maxWearDepth.wear or straight values
        const val = scenario[key];
        
        if (key === 'maxWearDepth') return val?.wear !== undefined ? val.wear : val;
        if (key === 'minRemainingWT') return val?.wt !== undefined ? val.wt : val;
        if (key === 'minBurstSF') return val?.sf !== undefined ? val.sf : val;
        if (key === 'minCollapseSF') return val?.sf !== undefined ? val.sf : val;
        
        return val;
    };

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
                <CardTitle className="text-sm">Scenario Comparison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-transparent">
                            <TableHead className="text-slate-400">Metric</TableHead>
                            {scenarios.map(s => <TableHead key={s.id} className="text-slate-300">{s.name}</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[
                            { key: 'maxWearDepth', label: 'Max Wear Depth (mm)', precision: 3 },
                            { key: 'minRemainingWT', label: 'Min Wall Thickness (mm)', precision: 2 },
                            { key: 'minBurstSF', label: 'Min Burst SF', precision: 2 },
                            { key: 'minCollapseSF', label: 'Min Collapse SF', precision: 2 },
                            { key: 'riskScore', label: 'Highest Risk Score', precision: 0 },
                            { key: 'highRiskZoneCount', label: '# High-Risk Zones', precision: 0 },
                        ].map(metric => (
                            <TableRow key={metric.key} className="border-slate-800">
                                <TableCell className="font-medium text-slate-400 text-xs">{metric.label}</TableCell>
                                {scenarios.map(s => (
                                    <TableCell key={s.id} className="text-xs font-mono">
                                        {safeToFixed(getValue(s, metric.key), metric.precision)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-64">
                    <div className="lg:col-span-1">
                        <h4 className="text-xs text-center font-semibold text-slate-400 mb-2">Max Wear Depth (mm)</h4>
                        <div className="h-full w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" />
                                    <YAxis fontSize={10} stroke="#94a3b8" />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} 
                                        itemStyle={{ color: '#f1f5f9' }}
                                        formatter={(value) => safeToFixed(value, 3)}
                                    />
                                    <Bar dataKey="Max Wear (mm)" fill="#FF6B6B" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <h4 className="text-xs text-center font-semibold text-slate-400 mb-2">Min Safety Factor</h4>
                        <div className="h-full w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" />
                                    <YAxis fontSize={10} stroke="#94a3b8" />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} 
                                        itemStyle={{ color: '#f1f5f9' }}
                                        formatter={(value) => safeToFixed(value, 2)}
                                    />
                                    <Bar dataKey="Min SF" fill="#FFC107" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                     <div className="lg:col-span-1">
                        <h4 className="text-xs text-center font-semibold text-slate-400 mb-2">Peak Risk Score</h4>
                        <div className="h-full w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" />
                                    <YAxis fontSize={10} stroke="#94a3b8" domain={[0, 100]} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} 
                                        itemStyle={{ color: '#f1f5f9' }} 
                                    />
                                    <Bar dataKey="Risk Score" fill="#4CAF50" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ScenarioComparison;