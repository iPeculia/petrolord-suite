import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const TubingDetailedResultsTable = ({ results }) => {
    if (!results || results.length === 0) return <div className="p-4 text-center text-xs text-slate-500">No results calculated.</div>;

    const getStatusColor = (status) => {
        if (status === 'PASS') return 'bg-emerald-900/30 text-emerald-400 border-emerald-800';
        if (status === 'WARNING') return 'bg-amber-900/30 text-amber-400 border-amber-800';
        return 'bg-red-900/30 text-red-400 border-red-800';
    };

    const getMarginColor = (val, thresholdLow, thresholdHigh) => {
        const v = parseFloat(val);
        if (v < thresholdLow) return 'text-red-400 font-bold';
        if (v < thresholdHigh) return 'text-amber-400';
        return 'text-emerald-400';
    };

    return (
        <div className="h-full overflow-auto custom-scrollbar">
            <Table>
                <TableHeader className="bg-slate-900 sticky top-0 z-10">
                    <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="h-8 text-[10px] font-bold text-slate-400 w-20">Depth (m)</TableHead>
                        <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-center">Burst SF</TableHead>
                        <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-center">Coll. SF</TableHead>
                        <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-center">Tens. SF</TableHead>
                        <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-center">Comp. SF</TableHead>
                        <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-right">Load (kN)</TableHead>
                        <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-center">Buckling</TableHead>
                        <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-center">Ballooning</TableHead>
                        <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-center">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {results.map((row, idx) => (
                        <TableRow key={idx} className="border-slate-800 hover:bg-slate-800/50 h-7 text-[10px]">
                            <TableCell className="py-1 font-mono text-slate-300">{row.depth}</TableCell>
                            <TableCell className={`py-1 text-center font-mono ${getMarginColor(row.burstSF, 1.1, 1.25)}`}>{row.burstSF}</TableCell>
                            <TableCell className={`py-1 text-center font-mono ${getMarginColor(row.collapseSF, 1.0, 1.1)}`}>{row.collapseSF}</TableCell>
                            <TableCell className={`py-1 text-center font-mono ${getMarginColor(row.tensionSF, 1.3, 1.6)}`}>{row.tensionSF}</TableCell>
                            <TableCell className={`py-1 text-center font-mono ${getMarginColor(row.compressionSF, 1.2, 1.4)}`}>{row.compressionSF}</TableCell>
                            <TableCell className="py-1 text-right font-mono text-slate-400">{row.axialLoad}</TableCell>
                            <TableCell className={`py-1 text-center ${row.buckling === 'High' ? 'text-red-400' : (row.buckling === 'Moderate' ? 'text-amber-400' : 'text-emerald-400')}`}>
                                {row.buckling}
                            </TableCell>
                            <TableCell className={`py-1 text-center ${row.ballooning === 'High' ? 'text-red-400' : 'text-slate-500'}`}>
                                {row.ballooning}
                            </TableCell>
                            <TableCell className="py-1 text-center">
                                <Badge variant="outline" className={`text-[9px] h-4 px-1 py-0 ${getStatusColor(row.status)}`}>
                                    {row.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TubingDetailedResultsTable;