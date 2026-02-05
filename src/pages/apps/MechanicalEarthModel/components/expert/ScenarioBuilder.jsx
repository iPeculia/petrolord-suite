import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Sliders, Plus, Play, Download, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ScenarioBuilder = () => {
    const { toast } = useToast();
    const [scenarios, setScenarios] = useState([
        { id: 1, name: 'Base Case', status: 'Completed', description: 'Standard pore pressure and tectonic strain', created: '2023-10-27' },
        { id: 2, name: 'High Pore Pressure', status: 'Pending', description: 'Sensitivity to +10% Pp', created: '2023-10-28' }
    ]);
    const [newScenarioName, setNewScenarioName] = useState('');

    const handleAddScenario = () => {
        if (!newScenarioName) return;
        setScenarios([...scenarios, { 
            id: Date.now(), 
            name: newScenarioName, 
            status: 'Draft', 
            description: 'Custom scenario',
            created: new Date().toISOString().split('T')[0]
        }]);
        setNewScenarioName('');
        toast({ title: "Scenario Created", description: `${newScenarioName} added to list.` });
    };

    const handleDelete = (id) => {
        setScenarios(scenarios.filter(s => s.id !== id));
    };

    const handleRun = (id) => {
        setScenarios(scenarios.map(s => s.id === id ? { ...s, status: 'Running...' } : s));
        setTimeout(() => {
             setScenarios(scenarios.map(s => s.id === id ? { ...s, status: 'Completed' } : s));
             toast({ title: "Calculation Complete", description: "Scenario results are ready." });
        }, 2000);
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 text-slate-200">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                 <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-sm font-bold text-white">Scenario Builder</h2>
                        <p className="text-xs text-slate-400">Manage "What-If" cases for risk assessment</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs border-slate-700">
                    <Download className="w-3 h-3 mr-2" /> Export Comparison
                </Button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Scenario List */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader className="py-3 flex flex-row justify-between items-center">
                                <CardTitle className="text-sm font-bold text-slate-200">Defined Scenarios</CardTitle>
                                <div className="flex gap-2">
                                    <Input 
                                        placeholder="New Scenario Name..." 
                                        value={newScenarioName}
                                        onChange={(e) => setNewScenarioName(e.target.value)}
                                        className="h-8 w-48 text-xs bg-slate-950 border-slate-700"
                                    />
                                    <Button size="sm" onClick={handleAddScenario} className="h-8 text-xs"><Plus className="w-3 h-3 mr-1"/> Add</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader className="bg-slate-950/50">
                                        <TableRow className="border-slate-800 hover:bg-transparent">
                                            <TableHead className="h-8 text-xs">Name</TableHead>
                                            <TableHead className="h-8 text-xs">Description</TableHead>
                                            <TableHead className="h-8 text-xs">Status</TableHead>
                                            <TableHead className="h-8 text-xs text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {scenarios.map(s => (
                                            <TableRow key={s.id} className="border-slate-800 hover:bg-slate-800/50">
                                                <TableCell className="font-medium text-xs">{s.name}</TableCell>
                                                <TableCell className="text-xs text-slate-400">{s.description}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`text-[10px] h-5 ${
                                                        s.status === 'Completed' ? 'text-emerald-400 border-emerald-900 bg-emerald-950' : 
                                                        s.status === 'Running...' ? 'text-blue-400 border-blue-900 bg-blue-950' : 
                                                        'text-slate-400 border-slate-800 bg-slate-900'
                                                    }`}>
                                                        {s.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right flex justify-end gap-2">
                                                    <Button 
                                                        variant="ghost" size="icon" 
                                                        className="h-6 w-6 text-blue-400 hover:text-blue-300 hover:bg-blue-950"
                                                        onClick={() => handleRun(s.id)}
                                                        disabled={s.status === 'Running...'}
                                                    >
                                                        <Play className="w-3 h-3" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" size="icon" 
                                                        className="h-6 w-6 text-slate-500 hover:text-red-400 hover:bg-red-950/30"
                                                        onClick={() => handleDelete(s.id)}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Comparison / Visualization */}
                    <div className="space-y-6">
                        <Card className="bg-slate-900 border-slate-800 h-[400px] flex flex-col relative overflow-hidden">
                            <div className="absolute top-2 left-2 z-10 bg-slate-950/80 px-2 py-1 rounded text-xs font-bold text-slate-400">Window Comparison</div>
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                                <Sliders className="w-16 h-16 mb-4 opacity-50" />
                                <p className="text-xs">Select scenarios to compare mud weight windows.</p>
                            </div>
                        </Card>

                        <Card className="bg-slate-900 border-slate-800 p-4">
                            <h4 className="text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">Risk Assessment</h4>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                                    <span className="text-slate-400">Base Case</span>
                                    <span className="text-emerald-400 font-bold">Safe</span>
                                </div>
                                <div className="flex justify-between p-2 bg-slate-950 rounded border border-slate-800">
                                    <span className="text-slate-400">High Pore Pressure</span>
                                    <span className="text-red-400 font-bold">Kick Risk @ 2500m</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScenarioBuilder;