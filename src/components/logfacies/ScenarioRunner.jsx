import React from 'react';
import { Play, Plus, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const scenarios = [
    { id: 1, name: 'Base Case (5 Facies)', status: 'completed', accuracy: '88%' },
    { id: 2, name: 'High Granularity (8 Facies)', status: 'completed', accuracy: '82%' },
    { id: 3, name: 'Lithology Only', status: 'draft', accuracy: '-' },
];

const ScenarioRunner = () => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-lg flex flex-col h-full">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-semibold text-white">Classification Scenarios</h3>
                <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-2"/> New Scenario</Button>
            </div>
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                    {scenarios.map(s => (
                        <div key={s.id} className="p-3 bg-slate-950 rounded border border-slate-800 hover:border-slate-600 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-slate-200">{s.name}</h4>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" className="h-6 w-6"><Play className="w-3 h-3" /></Button>
                                    <Button size="icon" variant="ghost" className="h-6 w-6"><Copy className="w-3 h-3" /></Button>
                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400"><Trash2 className="w-3 h-3" /></Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <Badge variant="outline" className={s.status === 'completed' ? 'text-green-400 border-green-900' : 'text-slate-400'}>
                                    {s.status}
                                </Badge>
                                <span>Accuracy: {s.accuracy}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default ScenarioRunner;