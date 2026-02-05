import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Copy, Trash2, Edit3, FileBarChart } from 'lucide-react';

const ScenarioManager = () => {
    const scenarios = [
        { id: 1, name: 'Base Case', date: '2025-11-28', description: 'Standard fracture gradient model' },
        { id: 2, name: 'High Pressure', date: '2025-11-29', description: 'Overpressure scenario (+1.2 ppg)' },
        { id: 3, name: 'Depleted Zone', date: '2025-11-29', description: 'Reduced Pp in Reservoir B' },
    ];

    return (
        <Card className="bg-slate-950 border-slate-800 h-full flex flex-col">
            <CardHeader className="pb-2 border-b border-slate-800">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-bold text-slate-200 flex items-center">
                        <FileBarChart className="w-4 h-4 mr-2 text-cyan-400" /> Scenario Manager
                    </CardTitle>
                    <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 h-7 text-xs">
                        <Plus className="w-3 h-3 mr-1" /> New
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-grow">
                <ScrollArea className="h-full">
                    <div className="divide-y divide-slate-800">
                        {scenarios.map(scenario => (
                            <div key={scenario.id} className="p-3 hover:bg-slate-900 transition-colors group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-sm font-bold text-slate-200">{scenario.name}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{scenario.description}</div>
                                        <div className="text-[10px] text-slate-600 mt-1">{scenario.date}</div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white"><Edit3 className="w-3 h-3" /></Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white"><Copy className="w-3 h-3" /></Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-400"><Trash2 className="w-3 h-3" /></Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default ScenarioManager;