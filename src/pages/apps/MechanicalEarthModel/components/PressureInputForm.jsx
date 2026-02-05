import React, { useContext, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Edit, PlusCircle, Save, X, Undo, Redo, Loader2 } from 'lucide-react';
import { GuidedModeContext } from '../contexts/GuidedModeContext';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

const PressureInputForm = () => {
    const { state, dispatch, savePressureData, undo, redo, canUndo, canRedo } = useContext(GuidedModeContext);
    const { toast } = useToast();
    const [editingRow, setEditingRow] = useState(null);

    const handleAddRow = () => {
        const newPoint = { id: uuidv4(), depth: 0, pressure: 0, type: 'MDT', quality: 'Good', notes: '' };
        dispatch({ type: 'ADD_PRESSURE_POINT', payload: newPoint });
        setEditingRow(newPoint.id);
    };

    const handleDeleteRow = (id) => {
        dispatch({ type: 'DELETE_PRESSURE_POINT', payload: id });
        toast({ title: 'Point Deleted', description: 'Pressure point removed successfully.' });
    };

    const handleEditChange = (id, field, value) => {
        const val = field === 'type' ? value : parseFloat(value) || 0;
        dispatch({ type: 'UPDATE_PRESSURE_POINT', payload: { id, field, value: val } });
    };

    const validatePoint = (point) => {
        if (point.depth <= 0) return "Depth must be positive.";
        if (point.pressure <= 0) return "Pressure must be positive.";
        return null;
    };

    const handleSave = async () => {
        const invalidPoint = state.pressureData.points.find(p => validatePoint(p) !== null);
        if (invalidPoint) {
            const error = validatePoint(invalidPoint);
            toast({
                variant: 'destructive',
                title: 'Validation Error',
                description: `Cannot save. Invalid data for point at depth ${invalidPoint.depth}. ${error}`,
            });
            return;
        }
        await savePressureData();
        setEditingRow(null); // Exit edit mode on save
    };

    return (
        <Card className="bg-slate-900/50 border-slate-800 text-slate-200">
            <CardHeader>
                <CardTitle>Pressure Data</CardTitle>
                <CardDescription>Input measured pressure points (MDT, LOT, FIT).</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b-slate-700 hover:bg-slate-800">
                                <TableHead>Depth (ft)</TableHead>
                                <TableHead>Pressure (ppg)</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {state.pressureData.points.map((point) => (
                                <TableRow key={point.id} className="border-b-slate-700 hover:bg-slate-800">
                                    <TableCell>
                                        {editingRow === point.id ? (
                                            <Input type="number" value={point.depth} onChange={(e) => handleEditChange(point.id, 'depth', e.target.value)} className="h-8 bg-slate-950"/>
                                        ) : (
                                            point.depth
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingRow === point.id ? (
                                            <Input type="number" value={point.pressure} onChange={(e) => handleEditChange(point.id, 'pressure', e.target.value)} className="h-8 bg-slate-950"/>
                                        ) : (
                                            point.pressure
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingRow === point.id ? (
                                             <Select value={point.type} onValueChange={(v) => handleEditChange(point.id, 'type', v)}>
                                                <SelectTrigger className="h-8 bg-slate-950"><SelectValue /></SelectTrigger>
                                                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                                                    <SelectItem value="MDT">MDT</SelectItem>
                                                    <SelectItem value="LOT">LOT</SelectItem>
                                                    <SelectItem value="FIT">FIT</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            point.type
                                        )}
                                    </TableCell>
                                    <TableCell className="flex gap-1">
                                        {editingRow === point.id ? (
                                            <Button variant="ghost" size="icon" onClick={() => setEditingRow(null)} className="h-8 w-8"><X className="h-4 w-4 text-slate-400"/></Button>
                                        ) : (
                                            <Button variant="ghost" size="icon" onClick={() => setEditingRow(point.id)} className="h-8 w-8"><Edit className="h-4 w-4 text-slate-400"/></Button>
                                        )}
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteRow(point.id)} className="h-8 w-8"><Trash2 className="h-4 w-4 text-red-500"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex justify-between items-center">
                        <Button type="button" variant="outline" size="sm" onClick={handleAddRow} className="border-slate-700">
                            <PlusCircle className="w-4 h-4 mr-2"/> Add Point
                        </Button>
                        <div className="flex gap-1">
                           <Button type="button" variant="ghost" size="icon" onClick={() => undo('pressureData')} disabled={!canUndo('pressureData')}><Undo className="w-4 h-4"/></Button>
                           <Button type="button" variant="ghost" size="icon" onClick={() => redo('pressureData')} disabled={!canRedo('pressureData')}><Redo className="w-4 h-4"/></Button>
                        </div>
                    </div>
                     <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-500" disabled={state.calculationStatus === 'saving'}>
                         {state.calculationStatus === 'saving' ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Save className="w-4 h-4 mr-2" />}
                        {state.calculationStatus === 'saving' ? 'Saving...' : 'Save Pressure Data'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default PressureInputForm;