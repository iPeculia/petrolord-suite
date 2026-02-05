import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Beaker, CheckCircle2 } from 'lucide-react';

const UnitTestSuite = () => {
    const coverage = [
        { module: 'Core Components', statements: 94, branches: 88, functions: 92, lines: 94 },
        { module: 'Data Utilities', statements: 98, branches: 95, functions: 100, lines: 98 },
        { module: 'Hooks', statements: 85, branches: 80, functions: 88, lines: 86 },
        { module: 'API Services', statements: 91, branches: 85, functions: 90, lines: 91 },
    ];

    return (
        <div className="h-full p-1 space-y-4">
            <h3 className="text-lg font-bold text-slate-200 flex items-center">
                <Beaker className="w-5 h-5 mr-2 text-green-400" /> Unit Test Coverage
            </h3>

            <div className="grid grid-cols-4 gap-4">
                {['Statements', 'Branches', 'Functions', 'Lines'].map(metric => (
                    <Card key={metric} className="bg-slate-950 border-slate-800">
                        <CardContent className="p-4 text-center">
                            <div className="text-xs text-slate-500 uppercase mb-1">{metric}</div>
                            <div className="text-2xl font-bold text-white">92%</div>
                            <Progress value={92} className="h-1 mt-2 bg-slate-800" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Module</TableHead>
                                <TableHead className="text-slate-400 text-right">Statements</TableHead>
                                <TableHead className="text-slate-400 text-right">Branches</TableHead>
                                <TableHead className="text-slate-400 text-right">Functions</TableHead>
                                <TableHead className="text-slate-400 text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {coverage.map((row, i) => (
                                <TableRow key={i} className="border-slate-800 hover:bg-slate-900/50">
                                    <TableCell className="font-medium text-slate-200">{row.module}</TableCell>
                                    <TableCell className="text-right text-slate-400">{row.statements}%</TableCell>
                                    <TableCell className="text-right text-slate-400">{row.branches}%</TableCell>
                                    <TableCell className="text-right text-slate-400">{row.functions}%</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end text-green-400"><CheckCircle2 className="w-4 h-4" /></div>
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

export default UnitTestSuite;