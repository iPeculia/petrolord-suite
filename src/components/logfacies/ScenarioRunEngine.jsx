import React from 'react';
import { Play, Copy, Trash2, Plus, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const scenarios = [
    { id: 1, name: 'Base Case (5 Facies)', model: 'XGBoost', status: 'completed', accuracy: '88%' },
    { id: 2, name: 'High Granularity (8 Facies)', model: 'XGBoost', status: 'completed', accuracy: '82%' },
    { id: 3, name: 'Lithology Only', model: 'Random Forest', status: 'draft', accuracy: '-' },
    { id: 4, name: 'Neural Net Experiment', model: 'MLP', status: 'running', accuracy: '-' },
];

const ScenarioRunEngine = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="p-4 border-b border-slate-800 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-semibold text-white">Scenario Manager</CardTitle>
                <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-2"/> Create New</Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="p-4 space-y-3">
                        {scenarios.map(s => (
                            <div key={s.id} className="p-3 bg-slate-950 rounded border border-slate-800 hover:border-slate-600 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-medium text-slate-200 text-sm">{s.name}</h4>
                                        <p className="text-xs text-slate-500">{s.model}</p>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-400 hover:text-white"><Play className="w-3 h-3" /></Button>
                                        <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-400 hover:text-white"><Copy className="w-3 h-3" /></Button>
                                        <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400 hover:text-red-300"><Trash2 className="w-3 h-3" /></Button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <Badge variant="outline" className={
                                        s.status === 'completed' ? 'text-green-400 border-green-900 bg-green-900/10' : 
                                        s.status === 'running' ? 'text-blue-400 border-blue-900 bg-blue-900/10 animate-pulse' : 'text-slate-400'
                                    }>
                                        {s.status}
                                    </Badge>
                                    <span className="text-slate-400">Accuracy: <span className="text-slate-200">{s.accuracy}</span></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <div className="p-4 border-t border-slate-800 bg-slate-900">
                <Button variant="secondary" className="w-full">
                    <BarChart className="w-4 h-4 mr-2"/> Compare Selected
                </Button>
            </div>
        </Card>
    );
};

export default ScenarioRunEngine;