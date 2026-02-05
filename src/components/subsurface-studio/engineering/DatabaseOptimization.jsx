import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, TrendingDown, Search } from 'lucide-react';

const DatabaseOptimization = () => {
    const slowQueries = [
        { query: 'SELECT * FROM seismic_volumes WHERE project_id = ?', duration: '1.2s', freq: '5/min', suggestion: 'Index on project_id' },
        { query: 'SELECT count(*) FROM logs WHERE type = "gamma"', duration: '850ms', freq: '12/min', suggestion: 'Composite Index needed' },
        { query: 'UPDATE wells SET last_accessed = NOW()', duration: '45ms', freq: '120/min', suggestion: 'Optimize locking' },
    ];

    return (
        <div className="h-full p-1 space-y-4">
            <h3 className="text-lg font-bold text-slate-200 flex items-center">
                <Database className="w-5 h-5 mr-2 text-indigo-400" /> Database Insights
            </h3>

            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs text-slate-500">Avg Query Time</div>
                        <div className="text-xl font-bold text-white">24ms</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs text-slate-500">Cache Hit Rate</div>
                        <div className="text-xl font-bold text-green-400">94.2%</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4">
                        <div className="text-xs text-slate-500">Active Connections</div>
                        <div className="text-xl font-bold text-blue-400">42 / 100</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-slate-950 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-sm text-slate-300 flex items-center">
                        <TrendingDown className="w-4 h-4 mr-2 text-red-400" /> Slow Query Log
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-xs text-slate-400">Query Pattern</TableHead>
                                <TableHead className="text-xs text-slate-400">Avg Duration</TableHead>
                                <TableHead className="text-xs text-slate-400">Frequency</TableHead>
                                <TableHead className="text-xs text-slate-400">AI Suggestion</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {slowQueries.map((q, i) => (
                                <TableRow key={i} className="border-slate-800 hover:bg-slate-900/50">
                                    <TableCell className="font-mono text-[10px] text-slate-300">{q.query}</TableCell>
                                    <TableCell className="text-xs text-red-400">{q.duration}</TableCell>
                                    <TableCell className="text-xs text-slate-400">{q.freq}</TableCell>
                                    <TableCell className="text-xs text-green-400 flex items-center gap-1">
                                        <Search className="w-3 h-3" /> {q.suggestion}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default DatabaseOptimization;