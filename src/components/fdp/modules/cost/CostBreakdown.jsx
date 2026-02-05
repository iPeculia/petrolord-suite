import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, TrendingDown, TrendingUp } from 'lucide-react';

const CostBreakdown = ({ costItems, onEdit, onDelete }) => {
    if (!costItems || costItems.length === 0) {
        return <div className="text-center py-8 text-slate-500">No cost items recorded.</div>;
    }

    const total = costItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-800/50">
                            <TableRow className="border-slate-800">
                                <TableHead className="text-slate-300">Item Name</TableHead>
                                <TableHead className="text-slate-300">Category</TableHead>
                                <TableHead className="text-slate-300">Type</TableHead>
                                <TableHead className="text-slate-300">Phase</TableHead>
                                <TableHead className="text-right text-slate-300">Amount (MM$)</TableHead>
                                <TableHead className="text-right text-slate-300 w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {costItems.map((item) => (
                                <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/30">
                                    <TableCell className="font-medium text-white">{item.name}</TableCell>
                                    <TableCell className="text-slate-400">{item.category}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.type === 'CAPEX' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                            {item.type}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-400">{item.phase}</TableCell>
                                    <TableCell className="text-right font-mono text-white">
                                        {parseFloat(item.amount).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-white" onClick={() => onEdit(item)}>
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-red-400" onClick={() => onDelete(item.id)}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow className="bg-slate-800 border-t-2 border-slate-700">
                                <TableCell colSpan={4} className="text-right font-bold text-slate-300 uppercase text-xs tracking-wider">Total Estimate</TableCell>
                                <TableCell className="text-right font-bold text-green-400 text-lg">${total.toFixed(2)}</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default CostBreakdown;