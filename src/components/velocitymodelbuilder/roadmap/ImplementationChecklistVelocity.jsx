import React, { useState } from 'react';
import { CheckSquare, Square } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const ImplementationChecklistVelocity = () => {
  const [checklist, setChecklist] = useState([
    { id: 1, phase: 1, task: 'LAS Parser Implementation', done: true },
    { id: 2, phase: 1, task: 'Smart Curve Detection', done: true },
    { id: 3, phase: 1, task: 'Unit Conversion Engine', done: true },
    { id: 4, phase: 2, task: 'Linear Gradient Velocity Model', done: true },
    { id: 5, phase: 2, task: 'Compaction Trends', done: true },
    { id: 6, phase: 2, task: 'Anisotropy Parameters', done: true },
    { id: 7, phase: 3, task: 'Horizon Time-Depth Conversion', done: true },
    { id: 8, phase: 3, task: 'Well Top Forward Modeling', done: true },
    { id: 9, phase: 4, task: 'Interactive TD Viewer', done: true },
    { id: 10, phase: 4, task: 'Map QC Component', done: true },
    { id: 11, phase: 5, task: 'Guided Mode Wizards', done: true },
    { id: 12, phase: 6, task: 'Expert Mode Interface', done: false },
    { id: 13, phase: 6, task: 'Misfit Analysis', done: false },
    { id: 14, phase: 7, task: 'Log Facies Integration', done: false },
    { id: 15, phase: 7, task: 'Volumetrics Export', done: false },
    { id: 16, phase: 8, task: 'Petrel Export', done: false },
    { id: 17, phase: 9, task: 'Model Versioning', done: false },
    { id: 18, phase: 9, task: 'Audit Trails', done: false },
    { id: 19, phase: 10, task: 'Job Queue System', done: false },
    { id: 20, phase: 10, task: 'Public API', done: false },
  ]);

  const toggleTask = (id) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    ));
  };

  const progress = (checklist.filter(i => i.done).length / checklist.length) * 100;

  return (
    <div className="p-4 h-full bg-slate-950 overflow-y-auto">
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
            <h2 className="text-xl font-bold text-white">Implementation Progress</h2>
            <span className="text-emerald-400 font-mono">{progress.toFixed(0)}%</span>
        </div>
        <Progress value={progress} className="h-2 bg-slate-800" indicatorClassName="bg-emerald-500" />
      </div>

      <div className="space-y-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(phaseId => {
            const phaseTasks = checklist.filter(t => t.phase === phaseId);
            if(phaseTasks.length === 0) return null;
            
            return (
                <Card key={phaseId} className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">Phase {phaseId}</h3>
                        <div className="space-y-2">
                            {phaseTasks.map(task => (
                                <div 
                                    key={task.id} 
                                    className="flex items-center gap-3 cursor-pointer group"
                                    onClick={() => toggleTask(task.id)}
                                >
                                    {task.done ? (
                                        <CheckSquare className="w-5 h-5 text-emerald-500" />
                                    ) : (
                                        <Square className="w-5 h-5 text-slate-600 group-hover:text-slate-400" />
                                    )}
                                    <span className={`text-sm ${task.done ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                                        {task.task}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            );
        })}
      </div>
    </div>
  );
};

export default ImplementationChecklistVelocity;