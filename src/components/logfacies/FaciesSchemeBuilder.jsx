import React, { useState } from 'react';
import { Palette, Plus, Trash2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DEFAULT_SCHEME = [
    { id: 1, name: 'Sandstone', code: 'SST', color: '#fbbf24' },
    { id: 2, name: 'Shale', code: 'SH', color: '#9ca3af' },
    { id: 3, name: 'Limestone', code: 'LST', color: '#3b82f6' },
];

const FaciesSchemeBuilder = () => {
    const [scheme, setScheme] = useState(DEFAULT_SCHEME);

    const addFacies = () => {
        const newId = Math.max(...scheme.map(s => s.id)) + 1;
        setScheme([...scheme, { id: newId, name: 'New Facies', code: 'NEW', color: '#ffffff' }]);
    };

    const updateFacies = (id, field, value) => {
        setScheme(scheme.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const removeFacies = (id) => {
        setScheme(scheme.filter(s => s.id !== id));
    };

    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg flex items-center gap-2"><Palette className="w-5 h-5 text-pink-400"/> Facies Scheme Editor</CardTitle>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={addFacies}><Plus className="w-4 h-4 mr-2"/> Add Class</Button>
                    <Button size="sm"><Save className="w-4 h-4 mr-2"/> Save Template</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Color</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scheme.map(facies => (
                            <TableRow key={facies.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="color" 
                                            value={facies.color} 
                                            onChange={(e) => updateFacies(facies.id, 'color', e.target.value)}
                                            className="h-8 w-8 rounded cursor-pointer bg-transparent border-none"
                                        />
                                        <span className="text-xs text-slate-500 font-mono">{facies.color}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Input 
                                        value={facies.name} 
                                        onChange={(e) => updateFacies(facies.id, 'name', e.target.value)}
                                        className="h-8 bg-slate-950 border-slate-700"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input 
                                        value={facies.code} 
                                        onChange={(e) => updateFacies(facies.id, 'code', e.target.value)}
                                        className="h-8 bg-slate-950 border-slate-700 w-24"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => removeFacies(facies.id)} className="text-slate-500 hover:text-red-400">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default FaciesSchemeBuilder;