import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, PlusCircle, Trash2, RefreshCw, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CalibrationPanel = () => {
    const { toast } = useToast();
    const [calibrationPoints, setCalibrationPoints] = useState([
        { id: 1, depth: 1500, type: 'LOT', value: 1.65, quality: 'Good' },
        { id: 2, depth: 2200, type: 'FIT', value: 1.72, quality: 'Fair' }
    ]);
    
    const [observations, setObservations] = useState([
        { id: 1, depth: 1850, type: 'Breakout', width: 45, quality: 'Clear' }
    ]);

    const addPoint = (type) => {
        if (type === 'pressure') {
            setCalibrationPoints([...calibrationPoints, { id: Date.now(), depth: 0, type: 'LOT', value: 0, quality: 'Good' }]);
        } else {
            setObservations([...observations, { id: Date.now(), depth: 0, type: 'Breakout', width: 0, quality: 'Good' }]);
        }
    };

    const removePoint = (id, type) => {
        if (type === 'pressure') {
            setCalibrationPoints(calibrationPoints.filter(p => p.id !== id));
        } else {
            setObservations(observations.filter(p => p.id !== id));
        }
    };

    const handleSave = () => {
        toast({ title: "Calibration Saved", description: "Calibration data points saved to project." });
    };

    const handleRecalculate = () => {
        toast({ title: "Recalculating Model", description: "Adjusting stress profiles to match calibration points..." });
        // Logic to trigger edge function would go here
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 text-slate-200">
             <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                 <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-sm font-bold text-white">Model Calibration</h2>
                        <p className="text-xs text-slate-400">Constrain model with measured data</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button 
                        size="sm" variant="outline"
                        onClick={handleRecalculate}
                        className="h-8 text-xs border-slate-700"
                    >
                        <RefreshCw className="w-3 h-3 mr-1" /> Fit Model
                    </Button>
                    <Button 
                        size="sm" 
                        onClick={handleSave}
                        className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        <Save className="w-3 h-3 mr-1" /> Save Data
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Left Column: Data Inputs */}
                    <div className="space-y-6">
                        
                        {/* Pressure Points */}
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader className="py-3 flex flex-row justify-between items-center">
                                <CardTitle className="text-sm font-bold text-slate-200">Stress Measurements (LOT/FIT/DFIT)</CardTitle>
                                <Button variant="ghost" size="sm" onClick={() => addPoint('pressure')} className="h-6 w-6 p-0"><PlusCircle className="w-4 h-4 text-indigo-400"/></Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-950/50">
                                        <TableRow className="border-slate-800 hover:bg-transparent">
                                            <TableHead className="h-8 text-xs">Depth</TableHead>
                                            <TableHead className="h-8 text-xs">Type</TableHead>
                                            <TableHead className="h-8 text-xs">Value (sg)</TableHead>
                                            <TableHead className="h-8 text-xs w-[40px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {calibrationPoints.map(pt => (
                                            <TableRow key={pt.id} className="border-slate-800 hover:bg-slate-800/50">
                                                <TableCell className="p-2"><Input className="h-7 text-xs bg-transparent border-transparent hover:border-slate-700 focus:bg-slate-950 font-mono" defaultValue={pt.depth} /></TableCell>
                                                <TableCell className="p-2">
                                                    <Select defaultValue={pt.type}>
                                                        <SelectTrigger className="h-7 text-xs bg-transparent border-transparent hover:border-slate-700 focus:bg-slate-950"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="LOT">LOT</SelectItem>
                                                            <SelectItem value="FIT">FIT</SelectItem>
                                                            <SelectItem value="DFIT">DFIT</SelectItem>
                                                            <SelectItem value="MDT">MDT/RFT</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell className="p-2"><Input className="h-7 text-xs bg-transparent border-transparent hover:border-slate-700 focus:bg-slate-950 font-mono" defaultValue={pt.value} /></TableCell>
                                                <TableCell className="p-2"><Button variant="ghost" size="sm" onClick={() => removePoint(pt.id, 'pressure')} className="h-6 w-6 p-0"><Trash2 className="w-3 h-3 text-red-400"/></Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Failure Observations */}
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader className="py-3 flex flex-row justify-between items-center">
                                <CardTitle className="text-sm font-bold text-slate-200">Wellbore Failure Observations</CardTitle>
                                <Button variant="ghost" size="sm" onClick={() => addPoint('obs')} className="h-6 w-6 p-0"><PlusCircle className="w-4 h-4 text-indigo-400"/></Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-950/50">
                                        <TableRow className="border-slate-800 hover:bg-transparent">
                                            <TableHead className="h-8 text-xs">Depth</TableHead>
                                            <TableHead className="h-8 text-xs">Type</TableHead>
                                            <TableHead className="h-8 text-xs">Width/Angle</TableHead>
                                            <TableHead className="h-8 text-xs w-[40px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {observations.map(pt => (
                                            <TableRow key={pt.id} className="border-slate-800 hover:bg-slate-800/50">
                                                <TableCell className="p-2"><Input className="h-7 text-xs bg-transparent border-transparent hover:border-slate-700 focus:bg-slate-950 font-mono" defaultValue={pt.depth} /></TableCell>
                                                <TableCell className="p-2">
                                                    <Select defaultValue={pt.type}>
                                                        <SelectTrigger className="h-7 text-xs bg-transparent border-transparent hover:border-slate-700 focus:bg-slate-950"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Breakout">Breakout</SelectItem>
                                                            <SelectItem value="DITF">Tensile Frac</SelectItem>
                                                            <SelectItem value="Washout">Washout</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell className="p-2"><Input className="h-7 text-xs bg-transparent border-transparent hover:border-slate-700 focus:bg-slate-950 font-mono" defaultValue={pt.width} /></TableCell>
                                                <TableCell className="p-2"><Button variant="ghost" size="sm" onClick={() => removePoint(pt.id, 'obs')} className="h-6 w-6 p-0"><Trash2 className="w-3 h-3 text-red-400"/></Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Visualization & QC */}
                    <div className="space-y-6">
                        <Card className="bg-slate-900 border-slate-800 h-[300px] flex flex-col relative overflow-hidden">
                            <div className="absolute top-2 left-2 z-10 bg-slate-950/80 px-2 py-1 rounded text-xs font-bold text-slate-400">Calibration Misfit Plot</div>
                            <div className="flex-1 flex items-center justify-center">
                                <Target className="w-16 h-16 text-slate-700 opacity-50" />
                            </div>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                             <Card className="bg-slate-900 border-slate-800 p-4 text-center">
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Shmin RMS Error</div>
                                <div className="text-2xl font-mono font-bold text-emerald-400">0.02 sg</div>
                            </Card>
                             <Card className="bg-slate-900 border-slate-800 p-4 text-center">
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Calib. Quality</div>
                                <div className="text-2xl font-mono font-bold text-amber-400">Medium</div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalibrationPanel;