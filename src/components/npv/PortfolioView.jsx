import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';
import { Download, Filter, ArrowUpRight } from 'lucide-react';

const PortfolioView = ({ projects = [] }) => {
    // Mock projects if empty for visualization
    const displayProjects = projects.length > 0 ? projects : [
        { id: 1, name: 'Alpha Field Dev', asset: 'North Sea', npv: 125, irr: 22, capex: 450, risk: 0.8, status: 'Approved' },
        { id: 2, name: 'Beta Infill', asset: 'GoM', npv: 45, irr: 35, capex: 80, risk: 0.9, status: 'Review' },
        { id: 3, name: 'Gamma Expl.', asset: 'West Africa', npv: 350, irr: 18, capex: 120, risk: 0.2, status: 'Draft' },
        { id: 4, name: 'Delta Tie-back', asset: 'North Sea', npv: 80, irr: 28, capex: 150, risk: 0.75, status: 'Approved' },
        { id: 5, name: 'Epsilon EOR', asset: 'Permian', npv: 60, irr: 15, capex: 200, risk: 0.6, status: 'Rejected' },
    ];

    const totalNPV = displayProjects.reduce((acc, p) => acc + p.npv, 0);
    const totalCapex = displayProjects.reduce((acc, p) => acc + p.capex, 0);
    const riskedNPV = displayProjects.reduce((acc, p) => acc + (p.npv * p.risk), 0);

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val * 1e6);

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Portfolio KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-slate-900 border-slate-800 p-4">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Total Portfolio NPV</p>
                    <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalNPV)}</p>
                </Card>
                <Card className="bg-slate-900 border-slate-800 p-4">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Total Risked NPV</p>
                    <p className="text-2xl font-bold text-blue-400">{formatCurrency(riskedNPV)}</p>
                </Card>
                <Card className="bg-slate-900 border-slate-800 p-4">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Total CAPEX Exposure</p>
                    <p className="text-2xl font-bold text-red-400">{formatCurrency(totalCapex)}</p>
                </Card>
                <Card className="bg-slate-900 border-slate-800 p-4">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Capital Efficiency</p>
                    <p className="text-2xl font-bold text-amber-400">{(totalNPV / totalCapex).toFixed(2)}x</p>
                </Card>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader><CardTitle className="text-sm text-slate-300">Project Ranking (NPV vs CAPEX)</CardTitle></CardHeader>
                    <CardContent className="h-[340px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis type="number" dataKey="capex" name="CAPEX" stroke="#94a3b8" label={{ value: 'CAPEX ($MM)', position: 'bottom', fill: '#94a3b8', fontSize: 10 }} />
                                <YAxis type="number" dataKey="npv" name="NPV" stroke="#94a3b8" label={{ value: 'NPV ($MM)', angle: -90, position: 'left', fill: '#94a3b8', fontSize: 10 }} />
                                <ZAxis type="number" dataKey="irr" range={[50, 400]} name="IRR" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                                <Scatter name="Projects" data={displayProjects} fill="#8884d8">
                                    {displayProjects.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.irr > 20 ? '#10b981' : '#f59e0b'} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                 <Card className="bg-slate-900 border-slate-800">
                    <CardHeader><CardTitle className="text-sm text-slate-300">Risked vs Unrisked Value by Asset</CardTitle></CardHeader>
                    <CardContent className="h-[340px]">
                        {/* Mock Aggregation by Asset */}
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                                { name: 'North Sea', unrisked: 205, risked: 160 },
                                { name: 'GoM', unrisked: 45, risked: 40.5 },
                                { name: 'West Africa', unrisked: 350, risked: 70 },
                                { name: 'Permian', unrisked: 60, risked: 36 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                                <YAxis stroke="#94a3b8" fontSize={10} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                                <Bar dataKey="unrisked" fill="#3b82f6" name="Unrisked NPV" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="risked" fill="#10b981" name="Risked NPV" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Projects Table */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm text-slate-300">Project Inventory</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 border-slate-700 text-slate-300"><Filter className="w-3 h-3 mr-2"/> Filter</Button>
                        <Button variant="outline" size="sm" className="h-8 border-slate-700 text-slate-300"><Download className="w-3 h-3 mr-2"/> Export</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b-slate-800">
                                <TableHead className="text-slate-300">Project Name</TableHead>
                                <TableHead className="text-slate-300">Asset</TableHead>
                                <TableHead className="text-right text-slate-300">NPV ($MM)</TableHead>
                                <TableHead className="text-right text-slate-300">IRR (%)</TableHead>
                                <TableHead className="text-right text-slate-300">CAPEX ($MM)</TableHead>
                                <TableHead className="text-right text-slate-300">Risk (POS)</TableHead>
                                <TableHead className="text-right text-slate-300">Status</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayProjects.map((p) => (
                                <TableRow key={p.id} className="border-b-slate-800 hover:bg-slate-800/50">
                                    <TableCell className="font-medium text-white">{p.name}</TableCell>
                                    <TableCell className="text-slate-400">{p.asset}</TableCell>
                                    <TableCell className="text-right font-mono text-emerald-400">{p.npv}</TableCell>
                                    <TableCell className="text-right font-mono text-white">{p.irr}%</TableCell>
                                    <TableCell className="text-right font-mono text-red-400">{p.capex}</TableCell>
                                    <TableCell className="text-right font-mono text-blue-400">{(p.risk * 100).toFixed(0)}%</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline" className={`
                                            ${p.status === 'Approved' ? 'border-green-500 text-green-500' : 
                                              p.status === 'Rejected' ? 'border-red-500 text-red-500' : 'border-amber-500 text-amber-500'}
                                        `}>{p.status}</Badge>
                                    </TableCell>
                                    <TableCell><Button variant="ghost" size="sm" className="h-6 w-6 p-0"><ArrowUpRight className="w-4 h-4 text-slate-500" /></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default PortfolioView;