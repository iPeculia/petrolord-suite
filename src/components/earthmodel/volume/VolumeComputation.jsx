import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, FileSpreadsheet } from 'lucide-react';

const VolumeComputation = ({ activeProject }) => {
    const [params, setParams] = useState({
        gridId: '',
        porosityCutoff: 0.05,
        swCutoff: 0.5,
        fluidContact: 2500
    });

    const [results, setResults] = useState(null);

    const handleCalculate = () => {
        // Mock calculation
        setResults({
            grv: 12500000,
            nrv: 9800000,
            pv: 1470000,
            hcpv: 890000,
            stoiip: 5600000 // bbls
        });
    };

    return (
        <div className="flex flex-col h-full p-6 space-y-6 overflow-y-auto">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-slate-800 bg-slate-900 lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <TrendingUp className="mr-2 h-5 w-5 text-purple-500"/> Volumetrics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Target Grid</Label>
                            <Select onValueChange={(v) => setParams({...params, gridId: v})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Grid" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="grid1">Main Field Grid</SelectItem>
                                    <SelectItem value="grid2">West Block Grid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Porosity Cutoff</Label>
                            <Input type="number" value={params.porosityCutoff} onChange={(e) => setParams({...params, porosityCutoff: parseFloat(e.target.value)})} step="0.01"/>
                        </div>

                        <div className="space-y-2">
                            <Label>Water Saturation Cutoff</Label>
                            <Input type="number" value={params.swCutoff} onChange={(e) => setParams({...params, swCutoff: parseFloat(e.target.value)})} step="0.01"/>
                        </div>

                        <div className="space-y-2">
                            <Label>Fluid Contact Depth (m)</Label>
                            <Input type="number" value={params.fluidContact} onChange={(e) => setParams({...params, fluidContact: parseFloat(e.target.value)})}/>
                        </div>

                        <Button className="w-full mt-4" onClick={handleCalculate}>Compute Volumes</Button>
                    </CardContent>
                </Card>

                <Card className="border-slate-800 bg-slate-900 lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Results</CardTitle>
                        {results && <Button variant="outline" size="sm"><FileSpreadsheet className="mr-2 h-4 w-4"/> Export</Button>}
                    </CardHeader>
                    <CardContent>
                        {!results ? (
                            <div className="flex items-center justify-center h-40 text-slate-500">
                                Run computation to see results
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-950 rounded border border-slate-800">
                                    <div className="text-slate-500 text-sm">Gross Rock Volume</div>
                                    <div className="text-2xl font-bold text-white">{results.grv.toLocaleString()} m³</div>
                                </div>
                                <div className="p-4 bg-slate-950 rounded border border-slate-800">
                                    <div className="text-slate-500 text-sm">Net Rock Volume</div>
                                    <div className="text-2xl font-bold text-white">{results.nrv.toLocaleString()} m³</div>
                                </div>
                                <div className="p-4 bg-slate-950 rounded border border-slate-800">
                                    <div className="text-slate-500 text-sm">Pore Volume</div>
                                    <div className="text-2xl font-bold text-white">{results.pv.toLocaleString()} m³</div>
                                </div>
                                <div className="p-4 bg-slate-950 rounded border border-slate-800">
                                    <div className="text-slate-500 text-sm">STOIIP</div>
                                    <div className="text-2xl font-bold text-green-400">{results.stoiip.toLocaleString()} bbls</div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
             </div>
        </div>
    );
};

export default VolumeComputation;