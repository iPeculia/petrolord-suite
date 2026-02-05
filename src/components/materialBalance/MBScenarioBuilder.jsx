import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Copy, Trash2, FileInput } from 'lucide-react';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { useToast } from '@/components/ui/use-toast';

const MBScenarioBuilder = () => {
  const { scenarios, createScenario, deleteScenario, setCurrentScenario, currentScenario } = useMaterialBalance();
  const { toast } = useToast();

  const handleCreate = () => {
    createScenario({ name: `Scenario ${scenarios.length + 1}` });
    toast({ title: "Scenario Created", description: "New forecast scenario added." });
  };

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="p-3 border-b border-slate-800 bg-slate-900/50 flex flex-row justify-between items-center">
        <CardTitle className="text-xs font-bold text-slate-300 uppercase">Scenarios</CardTitle>
        <Button variant="ghost" size="icon" onClick={handleCreate} className="h-6 w-6">
            <Plus className="w-4 h-4 text-blue-400" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-2 overflow-y-auto space-y-2">
        {scenarios.map((scenario, idx) => (
            <div 
                key={scenario.id} 
                className={`p-3 rounded border flex flex-col gap-2 cursor-pointer transition-colors ${currentScenario === scenario.id ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
                onClick={() => setCurrentScenario(scenario.id)}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-xs font-bold text-slate-200">{scenario.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Created: {new Date(scenario.createdAt).toLocaleDateString()}</div>
                    </div>
                    {scenarios.length > 1 && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5 text-slate-500 hover:text-red-400"
                            onClick={(e) => { e.stopPropagation(); deleteScenario(scenario.id); }}
                        >
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="bg-slate-900/50 p-1.5 rounded border border-slate-800/50">
                        <div className="text-[9px] text-slate-500 uppercase">Cum Oil</div>
                        <div className="text-[10px] font-mono text-slate-300">{scenario.results ? (scenario.results.Np_final / 1e6).toFixed(2) + ' MM' : '-'}</div>
                    </div>
                    <div className="bg-slate-900/50 p-1.5 rounded border border-slate-800/50">
                        <div className="text-[9px] text-slate-500 uppercase">Final P</div>
                        <div className="text-[10px] font-mono text-slate-300">{scenario.results ? Math.round(scenario.results.P_final) + ' psi' : '-'}</div>
                    </div>
                </div>
            </div>
        ))}
        
        {scenarios.length === 0 && (
            <div className="text-center py-8 text-slate-600 text-xs">
                No scenarios created.
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MBScenarioBuilder;