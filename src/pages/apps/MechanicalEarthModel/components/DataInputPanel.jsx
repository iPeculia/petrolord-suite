import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMEM } from '../contexts/MEMContext';
import { Plus, Trash2, Upload } from 'lucide-react';

const WellInfoForm = () => {
    const { state, dispatch } = useMEM();
    const { well } = state;

    const handleChange = (field, value) => {
        dispatch({ type: 'UPDATE_WELL', payload: { [field]: value } });
    };

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader><CardTitle className="text-base">Well Information</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Well Name</Label>
                    <Input value={well.name} onChange={(e) => handleChange('name', e.target.value)} className="bg-slate-950" />
                </div>
                <div className="space-y-2">
                    <Label>Location</Label>
                    <Input value={well.location} onChange={(e) => handleChange('location', e.target.value)} className="bg-slate-950" />
                </div>
                <div className="space-y-2">
                    <Label>Top Depth ({well.depthUnit})</Label>
                    <Input type="number" value={well.depthRange.top} onChange={(e) => handleChange('depthRange', { ...well.depthRange, top: parseFloat(e.target.value) })} className="bg-slate-950" />
                </div>
                <div className="space-y-2">
                    <Label>Bottom Depth ({well.depthUnit})</Label>
                    <Input type="number" value={well.depthRange.bottom} onChange={(e) => handleChange('depthRange', { ...well.depthRange, bottom: parseFloat(e.target.value) })} className="bg-slate-950" />
                </div>
            </CardContent>
        </Card>
    );
};

const DataInputPanel = () => {
    const [activeSubTab, setActiveSubTab] = useState('well');
    const { state, dispatch, getCollection } = useMEM();
    
    // Safe access to arrays
    const pressurePoints = getCollection('pressureData');

    return (
        <div className="h-full flex flex-col p-4">
            <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="h-full flex flex-col">
                <TabsList className="bg-slate-900 w-fit mb-4">
                    <TabsTrigger value="well">Well Info</TabsTrigger>
                    <TabsTrigger value="logs">Logs</TabsTrigger>
                    <TabsTrigger value="pressure">Pressure</TabsTrigger>
                    <TabsTrigger value="lithology">Lithology</TabsTrigger>
                </TabsList>

                <TabsContent value="well" className="mt-0">
                    <WellInfoForm />
                </TabsContent>

                <TabsContent value="pressure" className="mt-0 flex-grow">
                    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle className="text-base">Pressure Data Points (MDT/LOT/FIT)</CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm"><Upload className="w-4 h-4 mr-2"/> Import</Button>
                                <Button size="sm" onClick={() => dispatch({ type: 'ADD_ITEM', collection: 'pressureData', payload: { depth: 0, value: 0, type: 'MDT' } })}>
                                    <Plus className="w-4 h-4 mr-2"/> Add Point
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Depth</TableHead>
                                        <TableHead>Value</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pressurePoints.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-slate-500 py-8">No pressure points added yet.</TableCell>
                                        </TableRow>
                                    )}
                                    {pressurePoints.map((point) => (
                                        <TableRow key={point.id}>
                                            <TableCell>
                                                <Input 
                                                    type="number" 
                                                    value={point.depth} 
                                                    onChange={(e) => dispatch({ type: 'UPDATE_ITEM', collection: 'pressureData', id: point.id, payload: { depth: parseFloat(e.target.value) } })} 
                                                    className="h-8 bg-slate-950"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input 
                                                    type="number" 
                                                    value={point.value} 
                                                    onChange={(e) => dispatch({ type: 'UPDATE_ITEM', collection: 'pressureData', id: point.id, payload: { value: parseFloat(e.target.value) } })} 
                                                    className="h-8 bg-slate-950"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input 
                                                    value={point.type} 
                                                    onChange={(e) => dispatch({ type: 'UPDATE_ITEM', collection: 'pressureData', id: point.id, payload: { type: e.target.value } })} 
                                                    className="h-8 bg-slate-950"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" onClick={() => dispatch({ type: 'DELETE_ITEM', collection: 'pressureData', id: point.id })}>
                                                    <Trash2 className="w-4 h-4 text-red-400" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="logs" className="mt-0">
                    <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-800 rounded-lg text-slate-500">
                        <div className="text-center">
                            <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Drag & drop LAS files here or click to upload</p>
                        </div>
                    </div>
                </TabsContent>

                 <TabsContent value="lithology" className="mt-0">
                    <div className="flex items-center justify-center h-64 border-2 border-dashed border-slate-800 rounded-lg text-slate-500">
                         <p>Lithology editor coming soon...</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DataInputPanel;