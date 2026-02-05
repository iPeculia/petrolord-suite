import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save, Trash2, FileDown, PlayCircle } from 'lucide-react';

const ScenarioManager = ({ scenarios, activeId, setActive, onSave, onDelete }) => {
  const [newName, setNewName] = useState('');

  const handleSave = () => {
      if (newName.trim()) {
          onSave(newName);
          setNewName('');
      }
  };

  return (
    <div className="flex flex-col h-full border-l border-slate-800 bg-slate-950 w-64">
        <div className="p-4 border-b border-slate-800">
            <h3 className="font-bold text-slate-200">Scenarios</h3>
            <p className="text-xs text-slate-500">Manage & Compare cases</p>
        </div>
        
        <ScrollArea className="flex-1 p-4 space-y-3">
            {scenarios.map(scenario => (
                <div 
                    key={scenario.id} 
                    className={`p-3 rounded border cursor-pointer transition-all relative group ${activeId === scenario.id ? 'bg-emerald-950/30 border-emerald-500' : 'bg-slate-900 border-slate-800 hover:border-slate-600'}`}
                    onClick={() => setActive(scenario.id)}
                >
                    <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-bold ${activeId === scenario.id ? 'text-emerald-400' : 'text-slate-300'}`}>{scenario.name}</span>
                        {activeId === scenario.id && <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
                    </div>
                    <div className="text-[10px] text-slate-500">
                        {new Date(scenario.createdAt).toLocaleDateString()}
                    </div>
                </div>
            ))}
        </ScrollArea>

        <div className="p-4 border-t border-slate-800 space-y-3">
            <div className="flex gap-2">
                <Input 
                    placeholder="New Scenario Name" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="h-8 text-xs bg-slate-900 border-slate-700"
                />
                <Button size="icon" className="h-8 w-8 bg-emerald-600 hover:bg-emerald-500" onClick={handleSave}>
                    <Save className="w-4 h-4" />
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs border-slate-700 text-slate-400">
                    <FileDown className="w-3 h-3 mr-2" /> Export
                </Button>
                <Button variant="outline" size="sm" className="text-xs border-slate-700 text-slate-400">
                    <Trash2 className="w-3 h-3 mr-2" /> Clear
                </Button>
            </div>
        </div>
    </div>
  );
};

export default ScenarioManager;