import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit2, Trash2, Copy, CheckCircle } from 'lucide-react';

const FacilitiesList = ({ facilities, onEdit, onDelete, onDuplicate, selectedId, onSelect }) => {
    if (!facilities || facilities.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-900/50 border border-dashed border-slate-800 rounded-lg">
                <p className="text-slate-500 mb-2">No facilities defined yet.</p>
                <p className="text-sm text-slate-600">Create a facility concept to start engineering.</p>
            </div>
        );
    }

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-800/50">
                            <TableRow className="border-slate-800">
                                <TableHead className="text-slate-300 w-[50px]">Sel</TableHead>
                                <TableHead className="text-slate-300">Facility Name</TableHead>
                                <TableHead className="text-slate-300">Type</TableHead>
                                <TableHead className="text-slate-300 text-right">Oil Cap (bpd)</TableHead>
                                <TableHead className="text-slate-300 text-right">CAPEX ($MM)</TableHead>
                                <TableHead className="text-right w-[120px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {facilities.map((facility) => (
                                <TableRow 
                                    key={facility.id} 
                                    className={`border-slate-800 hover:bg-slate-800/30 cursor-pointer ${selectedId === facility.id ? 'bg-slate-800/50' : ''}`}
                                    onClick={() => onSelect(facility.id)}
                                >
                                    <TableCell>
                                        {selectedId === facility.id && <CheckCircle className="w-4 h-4 text-orange-500" />}
                                    </TableCell>
                                    <TableCell className="font-medium text-white">{facility.name}</TableCell>
                                    <TableCell>
                                        <span className="text-xs px-2 py-1 rounded-full border bg-slate-800 border-slate-700 text-slate-400">
                                            {facility.type}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-slate-300">{facility.nameplateCapacity?.toLocaleString()}</TableCell>
                                    <TableCell className="text-right font-mono text-orange-400">{facility.capex}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white" onClick={() => onDuplicate(facility)}>
                                                <Copy className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white" onClick={() => onEdit(facility)}>
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-400" onClick={() => onDelete(facility.id)}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default FacilitiesList;