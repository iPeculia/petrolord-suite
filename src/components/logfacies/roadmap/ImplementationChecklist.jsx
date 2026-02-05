import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialChecklist = [
    { phase: 1, task: 'LAS Parser implementation', done: true },
    { phase: 1, task: 'Curve Normalization utils', done: true },
    { phase: 1, task: 'Quality Checker UI', done: true },
    { phase: 2, task: 'XGBoost Model Integration', done: true },
    { phase: 2, task: 'Facies Scheme Builder', done: true },
    { phase: 2, task: 'In-App Training UI', done: false },
    { phase: 3, task: 'Canvas Log Viewer', done: false },
    { phase: 3, task: 'Correlation Panel', done: false },
    { phase: 3, task: 'Interactive Crossplots', done: false },
    { phase: 4, task: 'Rock Typing Engine', done: false },
    { phase: 4, task: 'Pay Flag Calculator', done: false },
    { phase: 5, task: 'Confusion Matrix Viz', done: false },
    { phase: 5, task: 'Manual Edit Layer', done: false },
    { phase: 6, task: 'Project Workspaces', done: false },
    { phase: 7, task: 'Petrel Export Script', done: false },
    { phase: 8, task: 'GPU Cluster Setup', done: false },
];

const ImplementationChecklist = () => {
    const [items, setItems] = useState(initialChecklist);

    const toggleItem = (index) => {
        const newItems = [...items];
        newItems[index].done = !newItems[index].done;
        setItems(newItems);
    };

    const progress = Math.round((items.filter(i => i.done).length / items.length) * 100);

    return (
        <div className="h-full flex flex-col p-4 space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-white">
                    <span>Overall Progress</span>
                    <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-slate-800" indicatorClassName="bg-gradient-to-r from-blue-500 to-green-500" />
            </div>

            <ScrollArea className="flex-1">
                <div className="space-y-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(phase => {
                        const phaseItems = items.map((item, idx) => ({...item, originalIdx: idx})).filter(item => item.phase === phase);
                        if (phaseItems.length === 0) return null;
                        
                        return (
                            <Card key={phase} className="bg-slate-900 border-slate-800">
                                <CardHeader className="py-3 border-b border-slate-800 bg-slate-950/50">
                                    <CardTitle className="text-sm font-bold text-slate-200">Phase {phase}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-3 space-y-2">
                                    {phaseItems.map((item) => (
                                        <div key={item.originalIdx} className="flex items-center space-x-2">
                                            <Checkbox 
                                                id={`task-${item.originalIdx}`} 
                                                checked={item.done} 
                                                onCheckedChange={() => toggleItem(item.originalIdx)}
                                                className="border-slate-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                            />
                                            <label 
                                                htmlFor={`task-${item.originalIdx}`} 
                                                className={`text-sm cursor-pointer select-none ${item.done ? 'text-slate-500 line-through' : 'text-slate-300'}`}
                                            >
                                                {item.task}
                                            </label>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
};

export default ImplementationChecklist;