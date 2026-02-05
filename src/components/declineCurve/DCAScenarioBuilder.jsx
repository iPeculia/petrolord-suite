import React, { useState } from 'react';
import { useDeclineCurve } from '@/contexts/DeclineCurveContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const DCAScenarioBuilder = () => {
  const { 
    scenarios, 
    createScenario, 
    deleteScenario, 
    selectedScenarios, 
    toggleScenarioSelection, 
    streamState, 
    selectedStream 
  } = useDeclineCurve();

  const [newScenarioName, setNewScenarioName] = useState('');
  const canSave = !!streamState[selectedStream].forecastResults;

  const handleCreate = () => {
    if (newScenarioName && canSave) {
      createScenario(newScenarioName);
      setNewScenarioName('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input 
            placeholder="Scenario Name (e.g., High Case)" 
            value={newScenarioName}
            onChange={(e) => setNewScenarioName(e.target.value)}
            className="bg-slate-800 border-slate-700 h-8 text-xs"
          />
          <Button 
            onClick={handleCreate} 
            disabled={!canSave || !newScenarioName}
            size="sm"
            className="h-8 w-8 p-0 bg-slate-700 hover:bg-slate-600"
          >
            <Plus size={14} />
          </Button>
        </div>
        {!canSave && <p className="text-[10px] text-slate-500">Run a forecast to save a scenario.</p>}
      </div>

      <ScrollArea className="h-[200px] rounded border border-slate-800 bg-slate-900/50 p-2">
        <div className="space-y-2">
          {scenarios.filter(s => s.stream === selectedStream).length === 0 ? (
            <div className="text-center text-slate-500 text-xs py-4">No saved scenarios</div>
          ) : (
            scenarios.filter(s => s.stream === selectedStream).map(s => (
              <div key={s.id} className="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-700 hover:border-slate-600 transition-colors">
                <div className="flex items-center gap-2 overflow-hidden">
                  <button onClick={() => toggleScenarioSelection(s.id)} className="text-slate-400 hover:text-white">
                    {selectedScenarios.includes(s.id) ? <CheckCircle2 size={14} className="text-blue-400" /> : <Circle size={14} />}
                  </button>
                  <div className="min-w-0">
                    <div className="text-xs font-medium truncate text-slate-200">{s.name}</div>
                    <div className="text-[10px] text-slate-500 flex gap-2">
                      <span>EUR: {s.forecastResults.eur.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                      <Badge variant="outline" className="h-3 px-1 text-[8px] border-slate-600 text-slate-400">{s.fitResults.modelType}</Badge>
                    </div>
                  </div>
                </div>
                <button onClick={() => deleteScenario(s.id)} className="text-slate-500 hover:text-red-400">
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DCAScenarioBuilder;