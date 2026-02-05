import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useCasingTubingDesign } from '../../contexts/CasingTubingDesignContext';

const TubingDesignResultsTable = ({ stringId, results }) => {
    const { tubingStrings } = useCasingTubingDesign();
    const activeString = tubingStrings.find(s => s.id === stringId);

    if (!activeString || !results) return null;

    const getStatusColor = (status) => {
        if (status === 'PASS') return 'bg-emerald-900/30 text-emerald-400 border-emerald-800';
        if (status === 'WARNING') return 'bg-amber-900/30 text-amber-400 border-amber-800';
        return 'bg-red-900/30 text-red-400 border-red-800';
    };

    const getMarginColor = (val) => {
        if (parseFloat(val) > 1.25) return 'text-emerald-400';
        if (parseFloat(val) >= 1.0) return 'text-amber-400';
        return 'text-red-400 font-bold';
    };

    return (
        <div className="space-y-2 mt-6">
            <h3 className="text-sm font-semibold text-slate-300 px-1">Calculation Results</h3>
            <div className="rounded-md border border-slate-800 bg-slate-900/50 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-900">
                        <TableRow className="border-slate-800 hover:bg-transparent">
                            <TableHead className="h-8 text-[10px] font-bold text-slate-400">Section</TableHead>
                            <TableHead className="h-8 text-[10px] font-bold text-slate-400">Depth Interval</TableHead>
                            <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-center">Burst SF</TableHead>
                            <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-center">Collapse SF</TableHead>
                            <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-center">Tension SF</TableHead>
                            <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-center">Buckling</TableHead>
                            <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activeString.sections?.map((sec) => {
                            const res = results[sec.id];
                            if (!res) return null;

                            return (
                                <TableRow key={sec.id} className="border-slate-800 hover:bg-slate-800/50 h-8">
                                    <TableCell className="py-1 text-xs font-medium text-slate-200">{sec.name}</TableCell>
                                    <TableCell className="py-1 text-xs font-mono text-slate-400">{sec.top_depth} - {sec.bottom_depth}m</TableCell>
                                    <TableCell className={`py-1 text-xs font-mono text-center ${getMarginColor(res.burstMargin)}`}>
                                        {res.burstMargin}
                                    </TableCell>
                                    <TableCell className={`py-1 text-xs font-mono text-center ${getMarginColor(res.collapseMargin)}`}>
                                        {res.collapseMargin}
                                    </TableCell>
                                    <TableCell className={`py-1 text-xs font-mono text-center ${getMarginColor(res.tensionMargin)}`}>
                                        {res.tensionMargin}
                                    </TableCell>
                                    <TableCell className="py-1 text-xs text-center text-slate-400">{res.isBuckling}</TableCell>
                                    <TableCell className="py-1 text-center">
                                        <Badge variant="outline" className={`text-[10px] h-5 px-1.5 ${getStatusColor(res.status)}`}>
                                            {res.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default TubingDesignResultsTable;