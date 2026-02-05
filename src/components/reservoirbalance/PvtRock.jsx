import React, { useState, useEffect, useMemo, useCallback } from 'react';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
    import { Save, AlertTriangle, CheckCircle, Calculator } from 'lucide-react';
    import { pvtCalcs } from '@/utils/pvtCalculations';

    const PvtRock = ({ pvtData, onPvtDataChange }) => {
        const { toast } = useToast();
        const [inputs, setInputs] = useState(pvtData?.inputs || {});
        const [generatedPvtTable, setGeneratedPvtTable] = useState([]);
        const [activePlot, setActivePlot] = useState('bo');

        useEffect(() => {
            if (pvtData?.inputs) {
                setInputs(pvtData.inputs);
            }
        }, [pvtData?.inputs]);

        const isTableDataValid = useMemo(() => {
            return pvtData?.pvtTable && pvtData.pvtTable.length > 0;
        }, [pvtData?.pvtTable]);

        const handleGenerateTable = useCallback(() => {
            try {
                if (!inputs || Object.keys(inputs).length === 0) return;
                const table = pvtCalcs.generatePvtTable(inputs);
                setGeneratedPvtTable(table);
                 toast({
                    title: 'PVT Table Recalculated',
                    description: `Generated ${table.length} data points from correlations.`,
                });
            } catch (error) {
                toast({
                    title: 'Calculation Error',
                    description: `Could not generate PVT table: ${error.message}`,
                    variant: 'destructive',
                });
            }
        }, [inputs, toast]);
        
        useEffect(() => {
            // Only generate on mount if no table data exists
            if (!isTableDataValid) {
                handleGenerateTable();
            }
        }, [isTableDataValid, handleGenerateTable]);
        
        const effectivePvtData = useMemo(() => {
            const data = isTableDataValid ? pvtData.pvtTable : generatedPvtTable;
            // Normalize keys to ensure plots work with either casing
            return data.map(row => ({
                ...row,
                pressure: row.pressure ?? row.Pressure_psia,
                Bo: row.Bo ?? row.bo ?? row['Oil_FVF_bbl_per_STB'],
                Rs: row.Rs ?? row.rs ?? row['Solution_GOR_SCF_per_STB'],
                Bg: row.Bg ?? row.bg,
                oil_viscosity: row.oil_viscosity ?? row.muo,
            }));
        }, [isTableDataValid, pvtData?.pvtTable, generatedPvtTable]);
        
        const handleInputChange = (key, value, isNested = false) => {
            if (isNested) {
                const [parent, child] = key.split('.');
                setInputs(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
            } else {
                setInputs(prev => ({ ...prev, [key]: value }));
            }
        };

        const handleUseProperties = () => {
            const dataToSave = {
                inputs,
                pvtTable: isTableDataValid ? pvtData.pvtTable : generatedPvtTable,
            };
            onPvtDataChange(dataToSave);
            toast({
                title: 'PVT Properties Updated',
                description: 'The current properties and table are now active for analysis.',
            });
        };
        
        const plotConfig = {
            bo: { dataKey: 'Bo', name: 'Oil FVF (bbl/STB)', color: '#a3e635' },
            rs: { dataKey: 'Rs', name: 'Solution GOR (scf/STB)', color: '#38bdf8' },
            muo: { dataKey: 'oil_viscosity', name: 'Oil Viscosity (cP)', color: '#f87171' },
        };
        const currentPlot = plotConfig[activePlot];

        return (
            <div className="space-y-6">
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="flex flex-row justify-between items-start">
                        <div>
                            <CardTitle className="text-lime-300">PVT & Rock Properties</CardTitle>
                            <CardDescription>Define or correlate fluid properties. The PVT table from Data Hub will override correlations if available.</CardDescription>
                        </div>
                        <Button onClick={handleUseProperties}><Save className="w-4 h-4 mr-2" /> Use Properties</Button>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            <Card className="bg-slate-900/50 border-slate-700">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg">Input Parameters for Correlations</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputGroup label="Oil Gravity (°API)" id="api" value={inputs?.api || ''} onChange={e => handleInputChange('api', parseFloat(e.target.value) || 0)} />
                                        <InputGroup label="Gas Specific Gravity" id="gasGravity" value={inputs?.gasGravity || ''} onChange={e => handleInputChange('gasGravity', parseFloat(e.target.value) || 0)} />
                                        <InputGroup label="Reservoir Temp (°F)" id="temp" value={inputs?.temp || ''} onChange={e => handleInputChange('temp', parseFloat(e.target.value) || 0)} />
                                        <InputGroup label="Initial Bubble Point (psia)" id="pb" value={inputs?.pb || ''} onChange={e => handleInputChange('pb', parseFloat(e.target.value) || 0)} />
                                    </div>
                                     <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div className="space-y-2">
                                            <Label>Pb, Rs, Bo Correlation</Label>
                                            <Select value={inputs?.correlations?.pb_rs_bo || 'standing'} onValueChange={v => handleInputChange('correlations.pb_rs_bo', v, true)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="standing">Standing</SelectItem>
                                                    <SelectItem value="vasquez_beggs">Vasquez-Beggs</SelectItem>
                                                    <SelectItem value="glaso">Glaso</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                         <div className="space-y-2">
                                            <Label>Oil Viscosity Correlation</Label>
                                            <Select value={inputs?.correlations?.viscosity || 'beal_cook_spillman'} onValueChange={v => handleInputChange('correlations.viscosity', v, true)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="beal_cook_spillman">Beal et al.</SelectItem>
                                                    <SelectItem value="beggs_robinson">Beggs-Robinson</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                      <Button onClick={handleGenerateTable} className="w-full"><Calculator className="w-4 h-4 mr-2" /> Recalculate PVT Table</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="md:col-span-3 space-y-4">
                             <Card className="bg-slate-900/50 border-slate-700">
                                 <CardHeader>
                                     <div className="flex justify-between items-center">
                                         <CardTitle className="text-white text-lg">PVT Data</CardTitle>
                                         {isTableDataValid ? (
                                             <div className="flex items-center text-sm text-green-400"><CheckCircle className="w-4 h-4 mr-2" /> Using table from Data Hub</div>
                                         ) : (
                                             <div className="flex items-center text-sm text-yellow-400"><AlertTriangle className="w-4 h-4 mr-2" /> Using correlated data</div>
                                         )}
                                     </div>
                                 </CardHeader>
                                 <CardContent>
                                     <ScrollArea className="h-64">
                                         <Table>
                                             <TableHeader>
                                                 <TableRow>
                                                    <TableHead>Pressure</TableHead>
                                                    <TableHead>Oil FVF</TableHead>
                                                    <TableHead>Solution GOR</TableHead>
                                                    <TableHead>Gas FVF</TableHead>
                                                    <TableHead>Oil Visc.</TableHead>
                                                 </TableRow>
                                             </TableHeader>
                                             <TableBody>
                                                 {effectivePvtData.map((row, i) => (
                                                     <TableRow key={i}>
                                                        <TableCell>{row.pressure?.toFixed(0)}</TableCell>
                                                        <TableCell>{row.Bo?.toFixed(3)}</TableCell>
                                                        <TableCell>{row.Rs?.toFixed(0)}</TableCell>
                                                        <TableCell>{row.Bg?.toFixed(4)}</TableCell>
                                                        <TableCell>{row.oil_viscosity?.toFixed(3)}</TableCell>
                                                     </TableRow>
                                                 ))}
                                             </TableBody>
                                         </Table>
                                     </ScrollArea>
                                 </CardContent>
                             </Card>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700">
                     <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lime-300">PVT Plots</CardTitle>
                            <Tabs value={activePlot} onValueChange={setActivePlot} className="w-[300px]">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="bo">Bo</TabsTrigger>
                                    <TabsTrigger value="rs">Rs</TabsTrigger>
                                    <TabsTrigger value="muo">µo</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={effectivePvtData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                                <XAxis dataKey="pressure" type="number" domain={['dataMin', 'dataMax']} stroke="#94a3b8" label={{ value: 'Pressure (psia)', position: 'insideBottom', offset: -5, fill: '#cbd5e1' }} />
                                <YAxis yAxisId="left" stroke={currentPlot.color} label={{ value: currentPlot.name, angle: -90, position: 'insideLeft', fill: currentPlot.color }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} labelStyle={{ color: '#e2e8f0' }} />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey={currentPlot.dataKey} name={currentPlot.name} stroke={currentPlot.color} strokeWidth={2} dot={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        );
    };

    const InputGroup = ({ label, id, ...props }) => (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-slate-300">{label}</Label>
            <Input id={id} {...props} type={props.type || "number"} className="bg-slate-900 border-slate-600 focus:ring-lime-500" />
        </div>
    );

    export default PvtRock;