import React from 'react';
import { useReservoirCalc } from '../../contexts/ReservoirCalcContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History } from 'lucide-react';

const AuditTrail = () => {
    const { state } = useReservoirCalc();
    const logs = state.auditTrail || [];

    return (
        <div className="h-full flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <History className="w-6 h-6 text-orange-400" /> Audit Trail
            </h2>
            <Card className="bg-slate-900 border-slate-800 flex-1 overflow-hidden flex flex-col">
                <CardHeader className="pb-2">
                    <CardTitle className="text-white text-sm">System Logs</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-0">
                    <Table>
                        <TableHeader className="bg-slate-950 sticky top-0">
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-300">Timestamp</TableHead>
                                <TableHead className="text-slate-300">Action</TableHead>
                                <TableHead className="text-slate-300">Details</TableHead>
                                <TableHead className="text-slate-300">User</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                                        No activity recorded.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log, i) => (
                                    <TableRow key={log.id || i} className="border-slate-800 hover:bg-slate-800/50">
                                        <TableCell className="text-slate-400 font-mono text-xs">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-white font-medium">{log.action}</TableCell>
                                        <TableCell className="text-slate-300">{log.details}</TableCell>
                                        <TableCell className="text-slate-400">You</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AuditTrail;