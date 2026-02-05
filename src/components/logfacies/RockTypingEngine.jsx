import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Plus, Layers } from 'lucide-react';

const INITIAL_TYPES = [
    { id: 1, facies: 'Sandstone', rtype: 'RT-1', phi_avg: 0.22, k_avg: 500, sw_irr: 0.15, model: 'J-Function' },
    { id: 2, facies: 'Shaley Sand', rtype: 'RT-2', phi_avg: 0.15, k_avg: 50, sw_irr: 0.35, model: 'Brooks-Corey' },
    { id: 3, facies: 'Limestone', rtype: 'RT-3', phi_avg: 0.08, k_avg: 10, sw_irr: 0.25, model: 'Thomeer' },
];

const RockTypingEngine = ({ faciesScheme }) => {
    const [rockTypes, setRockTypes] = useState(INITIAL_TYPES);

    const handleUpdate = (id, field, value) => {
        setRockTypes(prev => prev.map(rt => rt.id === id ? { ...rt, [field]: value } : rt));
    };

    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    <Layers className="w-4 h-4 text-violet-400" /> Electro-Rock Typing
                </CardTitle>
                <Button size="sm" variant="outline"><Save className="w-4 h-4 mr-2" /> Save Template</Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-slate-800 hover:bg-transparent">
                            <TableHead className="text-slate-400 w-[140px]">Assigned Facies</TableHead>
                            <TableHead className="text-slate-400">Rock Type Name</TableHead>
                            <TableHead className="text-slate-400">Avg Phi (v/v)</TableHead>
                            <TableHead className="text-slate-400">Avg Perm (mD)</TableHead>
                            <TableHead className="text-slate-400">Sw_irr</TableHead>
                            <TableHead className="text-slate-400">Sat. Model</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rockTypes.map((rt) => (
                            <TableRow key={rt.id} className="border-slate-800 hover:bg-slate-800/50">
                                <TableCell className="font-medium text-slate-200">
                                    <Select defaultValue={rt.facies} onValueChange={(v) => handleUpdate(rt.id, 'facies', v)}>
                                        <SelectTrigger className="h-8 bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(faciesScheme || { 'Sandstone': '', 'Shale': '', 'Limestone': '' }).map(f => (
                                                <SelectItem key={f} value={f}>{f}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell><Input className="h-8 bg-slate-950 border-slate-700" value={rt.rtype} onChange={(e) => handleUpdate(rt.id, 'rtype', e.target.value)} /></TableCell>
                                <TableCell><Input className="h-8 bg-slate-950 border-slate-700" type="number" value={rt.phi_avg} onChange={(e) => handleUpdate(rt.id, 'phi_avg', e.target.value)} step={0.01} /></TableCell>
                                <TableCell><Input className="h-8 bg-slate-950 border-slate-700" type="number" value={rt.k_avg} onChange={(e) => handleUpdate(rt.id, 'k_avg', e.target.value)} /></TableCell>
                                <TableCell><Input className="h-8 bg-slate-950 border-slate-700" type="number" value={rt.sw_irr} onChange={(e) => handleUpdate(rt.id, 'sw_irr', e.target.value)} step={0.05} /></TableCell>
                                <TableCell>
                                    <Select defaultValue={rt.model} onValueChange={(v) => handleUpdate(rt.id, 'model', v)}>
                                        <SelectTrigger className="h-8 bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="J-Function">J-Function</SelectItem>
                                            <SelectItem value="Thomeer">Thomeer</SelectItem>
                                            <SelectItem value="Brooks-Corey">Brooks-Corey</SelectItem>
                                            <SelectItem value="Archie">Archie (Simple)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="mt-4">
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300" onClick={() => setRockTypes([...rockTypes, { id: Date.now(), facies: 'New', rtype: 'RT-X', phi_avg: 0, k_avg: 0, sw_irr: 0, model: 'Archie' }])}>
                        <Plus className="w-4 h-4 mr-2" /> Add Rock Type
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default RockTypingEngine;