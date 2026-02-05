import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Database } from 'lucide-react';
import { aggregateReserves } from '@/utils/fdp/subsurfaceCalculations';

const ReservesTable = ({ reserves = [], onChange }) => {
    const addRow = () => {
        const newRow = { 
            id: Date.now(), 
            name: `Reservoir ${reserves.length + 1}`, 
            fluid: 'Oil', 
            p90: 0, 
            p50: 0, 
            p10: 0, 
            rf: 0.3 
        };
        onChange([...reserves, newRow]);
    };

    const updateRow = (id, field, value) => {
        const updated = reserves.map(r => r.id === id ? { ...r, [field]: value } : r);
        onChange(updated);
    };

    const deleteRow = (id) => {
        onChange(reserves.filter(r => r.id !== id));
    };

    const totals = aggregateReserves(reserves);

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium text-white flex items-center">
                    <Database className="w-5 h-5 mr-2 text-blue-400" />
                    Reserves Breakdown (MMbbl/Bcf)
                </CardTitle>
                <Button size="sm" variant="outline" onClick={addRow} className="border-slate-700 hover:bg-slate-800">
                    <Plus className="w-4 h-4 mr-2" /> Add Reservoir
                </Button>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-800/50">
                            <TableRow>
                                <TableHead className="text-slate-300">Reservoir Name</TableHead>
                                <TableHead className="text-slate-300">Fluid Type</TableHead>
                                <TableHead className="text-slate-300 text-right">P90 (Low)</TableHead>
                                <TableHead className="text-slate-300 text-right">P50 (Best)</TableHead>
                                <TableHead className="text-slate-300 text-right">P10 (High)</TableHead>
                                <TableHead className="text-slate-300 text-right">Rec. Factor</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reserves.map((row) => (
                                <TableRow key={row.id} className="border-slate-800">
                                    <TableCell>
                                        <Input 
                                            value={row.name} 
                                            onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                                            className="h-8 bg-transparent border-slate-700"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Select value={row.fluid} onValueChange={(v) => updateRow(row.id, 'fluid', v)}>
                                            <SelectTrigger className="h-8 bg-transparent border-slate-700">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Oil">Oil</SelectItem>
                                                <SelectItem value="Gas">Gas</SelectItem>
                                                <SelectItem value="Condensate">Condensate</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            type="number"
                                            value={row.p90} 
                                            onChange={(e) => updateRow(row.id, 'p90', parseFloat(e.target.value))}
                                            className="h-8 bg-transparent border-slate-700 text-right"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            type="number"
                                            value={row.p50} 
                                            onChange={(e) => updateRow(row.id, 'p50', parseFloat(e.target.value))}
                                            className="h-8 bg-transparent border-slate-700 text-right font-medium text-blue-400"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            type="number"
                                            value={row.p10} 
                                            onChange={(e) => updateRow(row.id, 'p10', parseFloat(e.target.value))}
                                            className="h-8 bg-transparent border-slate-700 text-right"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            type="number"
                                            value={row.rf} 
                                            onChange={(e) => updateRow(row.id, 'rf', parseFloat(e.target.value))}
                                            className="h-8 bg-transparent border-slate-700 text-right"
                                            step="0.01"
                                            max="1"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => deleteRow(row.id)} className="h-8 w-8 hover:text-red-400">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {/* Totals Row */}
                            <TableRow className="bg-slate-800/30 font-bold border-t-2 border-slate-700">
                                <TableCell colSpan={2} className="text-right text-slate-400">Total (P50):</TableCell>
                                <TableCell className="text-right text-slate-400">{totals.p90.toFixed(1)}</TableCell>
                                <TableCell className="text-right text-blue-400">{totals.p50.toFixed(1)}</TableCell>
                                <TableCell className="text-right text-slate-400">{totals.p10.toFixed(1)}</TableCell>
                                <TableCell colSpan={2}></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default ReservesTable;