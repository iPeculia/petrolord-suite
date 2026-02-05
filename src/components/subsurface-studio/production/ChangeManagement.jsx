import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GitCommit } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ChangeManagement = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <GitCommit className="w-5 h-5 mr-2 text-purple-400" /> Change Log
        </h3>
        <Card className="bg-slate-950 border-slate-800">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-transparent">
                            <TableHead className="text-slate-400 text-xs">ID</TableHead>
                            <TableHead className="text-slate-400 text-xs">Description</TableHead>
                            <TableHead className="text-slate-400 text-xs">Author</TableHead>
                            <TableHead className="text-slate-400 text-xs text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[
                            { id: 'CHG-102', desc: 'Updated seismic volume compression algo', author: 'John D.', date: '2025-11-24' },
                            { id: 'CHG-101', desc: 'Rotated API keys for external vendors', author: 'SecOps', date: '2025-11-22' },
                            { id: 'CHG-100', desc: 'Deployed Hotfix v2.3.1', author: 'BuildBot', date: '2025-11-20' },
                        ].map((chg, i) => (
                            <TableRow key={i} className="border-slate-800 hover:bg-slate-900/50">
                                <TableCell className="text-xs font-mono text-purple-400">{chg.id}</TableCell>
                                <TableCell className="text-xs text-slate-300">{chg.desc}</TableCell>
                                <TableCell className="text-xs text-slate-400">{chg.author}</TableCell>
                                <TableCell className="text-xs text-slate-500 text-right">{chg.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
);
export default ChangeManagement;