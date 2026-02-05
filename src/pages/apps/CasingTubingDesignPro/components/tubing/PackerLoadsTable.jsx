import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const PackerLoadsTable = ({ loads }) => {
    if (!loads || loads.length === 0) return <div className="p-4 text-center text-xs text-slate-500">No packer loads calculated.</div>;

    return (
        <Table>
            <TableHeader className="bg-slate-900 sticky top-0 z-10">
                <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="h-8 text-[10px] font-bold text-slate-400">Load Case</TableHead>
                    <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-right">Differential (bar)</TableHead>
                    <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-right">Load (kN)</TableHead>
                    <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-right">Rating (kN)</TableHead>
                    <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-center">SF</TableHead>
                    <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-center">Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loads.map((row, idx) => (
                    <TableRow key={idx} className="border-slate-800 hover:bg-slate-800/50 h-8">
                        <TableCell className="py-1 text-xs font-medium text-slate-300">{row.caseName}</TableCell>
                        <TableCell className="py-1 text-xs text-right font-mono text-slate-400">{row.differential}</TableCell>
                        <TableCell className="py-1 text-xs text-right font-mono text-slate-400">{row.load}</TableCell>
                        <TableCell className="py-1 text-xs text-right font-mono text-slate-400">{row.rating}</TableCell>
                        <TableCell className={`py-1 text-xs text-center font-mono font-bold ${parseFloat(row.sf) < 1.2 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {row.sf}
                        </TableCell>
                        <TableCell className="py-1 text-center">
                            <Badge variant="outline" className={`text-[10px] h-5 px-1.5 ${row.status === 'PASS' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800' : 'bg-red-900/20 text-red-400 border-red-800'}`}>
                                {row.status}
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default PackerLoadsTable;