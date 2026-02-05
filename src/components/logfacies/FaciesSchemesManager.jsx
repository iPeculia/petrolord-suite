import React, { useState } from 'react';
import { Palette, Plus, Trash2, Save, GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';

const DEFAULT_SCHEME = [
    { id: 1, name: 'Sandstone', code: 'SST', color: '#fbbf24', pattern: 'dots' },
    { id: 2, name: 'Shale', code: 'SH', color: '#9ca3af', pattern: 'lines' },
    { id: 3, name: 'Limestone', code: 'LST', color: '#3b82f6', pattern: 'blocks' },
    { id: 4, name: 'Dolomite', code: 'DOL', color: '#a855f7', pattern: 'diag' },
    { id: 5, name: 'Anhydrite', code: 'ANHY', color: '#f472b6', pattern: 'cross' },
];

const FaciesSchemesManager = () => {
    const [scheme, setScheme] = useState(DEFAULT_SCHEME);

    const addFacies = () => {
        const newId = Math.max(...scheme.map(s => s.id), 0) + 1;
        setScheme([...scheme, { id: newId, name: 'New Facies', code: 'NEW', color: '#ffffff', pattern: 'solid' }]);
    };

    const updateFacies = (id, field, value) => {
        setScheme(scheme.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const removeFacies = (id) => {
        setScheme(scheme.filter(s => s.id !== id));
    };

    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Palette className="w-5 h-5 text-pink-400"/> 
                    Facies Schemes
                </CardTitle>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={addFacies} className="h-8">
                        <Plus className="w-4 h-4 mr-2"/> Add Class
                    </Button>
                    <Button size="sm" className="bg-pink-600 hover:bg-pink-700 h-8 text-white">
                        <Save className="w-4 h-4 mr-2"/> Save Scheme
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
                <ScrollArea className="h-[400px]">
                    <Table>
                        <TableHeader className="bg-slate-950">
                            <TableRow className="hover:bg-slate-950 border-slate-800">
                                <TableHead className="w-[40px]"></TableHead>
                                <TableHead>Color</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Pattern</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {scheme.map((facies) => (
                                <TableRow key={facies.id} className="border-slate-800 hover:bg-slate-800/50">
                                    <TableCell>
                                        <GripVertical className="w-4 h-4 text-slate-600 cursor-grab" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="relative w-8 h-8 rounded overflow-hidden border border-slate-600">
                                                <input 
                                                    type="color" 
                                                    value={facies.color} 
                                                    onChange={(e) => updateFacies(facies.id, 'color', e.target.value)}
                                                    className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer p-0 border-0"
                                                />
                                            </div>
                                            <span className="text-xs text-slate-500 font-mono hidden md:inline">{facies.color}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            value={facies.name} 
                                            onChange={(e) => updateFacies(facies.id, 'name', e.target.value)}
                                            className="h-8 bg-slate-950 border-slate-700 text-slate-200"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            value={facies.code} 
                                            onChange={(e) => updateFacies(facies.id, 'code', e.target.value)}
                                            className="h-8 bg-slate-950 border-slate-700 w-20 text-slate-200 font-mono"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <select 
                                            className="h-8 bg-slate-950 border border-slate-700 rounded text-sm text-slate-300 px-2 w-full"
                                            value={facies.pattern}
                                            onChange={(e) => updateFacies(facies.id, 'pattern', e.target.value)}
                                        >
                                            <option value="solid">Solid</option>
                                            <option value="dots">Dots</option>
                                            <option value="lines">Lines</option>
                                            <option value="blocks">Blocks</option>
                                            <option value="cross">Cross</option>
                                        </select>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => removeFacies(facies.id)} className="text-slate-500 hover:text-red-400 hover:bg-red-950/30 h-8 w-8">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default FaciesSchemesManager;