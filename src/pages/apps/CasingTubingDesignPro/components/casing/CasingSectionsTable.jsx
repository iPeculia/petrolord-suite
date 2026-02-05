import React from 'react';
import { useCasingTubingDesign } from '../../contexts/CasingTubingDesignContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

const CasingSectionsTable = ({ stringId }) => {
    const { casingStrings } = useCasingTubingDesign();
    const activeString = casingStrings.find(s => s.id === stringId);

    if (!activeString) {
        return <div className="text-xs text-slate-500 italic p-4">Select a casing string to view sections.</div>;
    }

    if (!activeString.sections || activeString.sections.length === 0) {
        return <div className="text-xs text-slate-500 italic p-4">No sections defined for this string.</div>;
    }

    return (
        <div className="rounded-md border border-slate-800 bg-slate-900/50 overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-900">
                    <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="h-8 text-[10px] font-bold text-slate-400">Section Name</TableHead>
                        <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-right">Top (m)</TableHead>
                        <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-right">Bottom (m)</TableHead>
                        <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-right">OD (in)</TableHead>
                        <TableHead className="h-8 text-[10px] font-bold text-slate-400">Grade</TableHead>
                        <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-right">Burst (psi)</TableHead>
                        <TableHead className="h-8 text-[10px] font-bold text-slate-400 text-right">Collapse (psi)</TableHead>
                        <TableHead className="h-8 text-[10px] font-bold text-slate-400 w-16"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {activeString.sections.map((sec) => (
                        <TableRow key={sec.id} className="border-slate-800 hover:bg-slate-800/50 h-8">
                            <TableCell className="py-1 text-xs font-medium text-slate-200">{sec.name}</TableCell>
                            <TableCell className="py-1 text-xs font-mono text-slate-400 text-right">{sec.top_depth}</TableCell>
                            <TableCell className="py-1 text-xs font-mono text-slate-400 text-right">{sec.bottom_depth}</TableCell>
                            <TableCell className="py-1 text-xs font-mono text-slate-400 text-right">{sec.od}</TableCell>
                            <TableCell className="py-1 text-xs text-lime-400">{sec.grade}</TableCell>
                            <TableCell className="py-1 text-xs font-mono text-slate-400 text-right">{sec.api_burst}</TableCell>
                            <TableCell className="py-1 text-xs font-mono text-slate-400 text-right">{sec.api_collapse}</TableCell>
                            <TableCell className="py-1 text-right">
                                <div className="flex justify-end space-x-1">
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white"><Edit className="w-3 h-3" /></Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-red-400"><Trash className="w-3 h-3" /></Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default CasingSectionsTable;