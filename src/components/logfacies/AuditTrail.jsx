import React from 'react';
import { FileText, Search, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const logs = [
    { id: 'LOG-9921', action: 'Model Retrain', user: 'Alex Chen', details: 'Params: XGBoost, Depth: 1200-3000', time: '2024-03-15 14:30' },
    { id: 'LOG-9920', action: 'Manual Override', user: 'Sarah Miller', details: 'Interval: 1250-1255m -> Sandstone', time: '2024-03-15 14:15' },
    { id: 'LOG-9919', action: 'Project Export', user: 'Mike Ross', details: 'Format: DLIS, Target: Petrel', time: '2024-03-15 13:45' },
    { id: 'LOG-9918', action: 'Data Import', user: 'System', details: 'File: Well-A01.las', time: '2024-03-15 10:00' },
];

const AuditTrail = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="pb-4 border-b border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="w-4 h-4 text-slate-400" /> Compliance Log
                </CardTitle>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-2 h-3 w-3 text-slate-500" />
                        <Input placeholder="Filter logs..." className="h-8 w-48 pl-7 bg-slate-950 border-slate-700 text-xs" />
                    </div>
                    <Button size="sm" variant="outline" className="h-8"><Download className="w-3 h-3 mr-2"/> Export CSV</Button>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
                <Table>
                    <TableHeader className="bg-slate-950 sticky top-0">
                        <TableRow className="border-slate-800 hover:bg-slate-950">
                            <TableHead className="w-[100px]">Log ID</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead className="text-right">Timestamp</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/50">
                                <TableCell className="font-mono text-xs text-slate-500">{log.id}</TableCell>
                                <TableCell className="font-medium text-slate-200">{log.action}</TableCell>
                                <TableCell className="text-slate-400">{log.user}</TableCell>
                                <TableCell className="text-slate-400 text-xs truncate max-w-[200px]">{log.details}</TableCell>
                                <TableCell className="text-right text-slate-500 font-mono text-xs">{log.time}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default AuditTrail;