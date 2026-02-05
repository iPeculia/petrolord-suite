import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator, Settings, Play } from 'lucide-react';

const TorqueDragPredictor = () => {
    const [data, setData] = useState({
        targetMD: 12000,
        drillPipe: [{ id: 1, type: '5" 19.50 ppf', length: 10000, grade: 'S-135' }],
        // Fixed: Renamed second 'id' (inner diameter) to 'id_in' to avoid duplicate key error
        bha: [{ id: 1, type: 'Drill Collar', length: 500, od: 8, id_in: 2.8125, weight: 147 }],
        fluidParams: { mudWeight: 10.5, pv: 20, yp: 15, cof_s: 0.3, cof_d: 0.2 },
        scenarios: {}
    });

    return (
        <div className="p-6 space-y-6 text-slate-100">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Torque & Drag Predictor</h1>
                    <p className="text-slate-400">Analyze string mechanics, friction, and hook loads.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-500">
                    <Play className="w-4 h-4 mr-2" /> Run Simulation
                </Button>
            </div>

            <Tabs defaultValue="configuration" className="w-full">
                <TabsList className="bg-slate-800 border-slate-700">
                    <TabsTrigger value="configuration">Configuration</TabsTrigger>
                    <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>

                <TabsContent value="configuration" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="flex items-center"><Settings className="w-4 h-4 mr-2" /> Well Parameters</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Target MD (ft)</Label>
                                        <Input value={data.targetMD} readOnly className="bg-slate-950 border-slate-700" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Mud Weight (ppg)</Label>
                                        <Input value={data.fluidParams.mudWeight} readOnly className="bg-slate-950 border-slate-700" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Friction Factor (Cased)</Label>
                                        <Input value={data.fluidParams.cof_s} readOnly className="bg-slate-950 border-slate-700" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Friction Factor (Open)</Label>
                                        <Input value={data.fluidParams.cof_d} readOnly className="bg-slate-950 border-slate-700" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle>BHA Configuration</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-slate-800">
                                            <TableHead>Component</TableHead>
                                            <TableHead>Length</TableHead>
                                            <TableHead>OD</TableHead>
                                            <TableHead>ID</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.bha.map((comp, i) => (
                                            <TableRow key={i} className="border-slate-800">
                                                <TableCell className="font-medium">{comp.type}</TableCell>
                                                <TableCell>{comp.length} ft</TableCell>
                                                <TableCell>{comp.od} in</TableCell>
                                                <TableCell>{comp.id_in} in</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="results">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle>Simulation Results</CardTitle>
                            <CardDescription>Run the simulation to view tension and torque plots.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px] flex items-center justify-center text-slate-500">
                            <div className="text-center">
                                <Calculator className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No results generated yet.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TorqueDragPredictor;