import React, { useState } from 'react';
import { useCasingWearAnalyzer } from '../contexts/CasingWearAnalyzerContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, GitCompare, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ScenarioComparison from './ScenarioComparison';
import { compareScenarios } from '../utils/scenarioEngine';

const ScenariosTab = () => {
  const { scenarios, createNewScenario, deleteScenario } = useCasingWearAnalyzer();
  const { toast } = useToast();
  const [selectedScenarios, setSelectedScenarios] = useState([]);

  const handleCreateScenario = () => {
    // Create a new scenario with default modifications for demo purposes
    // In production, this would open a modal to define specific changes
    const modifications = {
      exposureParams: { rpm: 100 },
      mudParams: { wearFactorTJ: 0.8 }
    };
    
    // Ensure we create a safe scenario object even if calculation hasn't run
    createNewScenario(`Scenario ${scenarios.length + 1} (Reduced RPM)`, modifications);
    toast({
      title: "Scenario Created",
      description: "A new scenario with reduced RPM has been added.",
    });
  };

  const toggleScenarioSelection = (scenarioId) => {
    setSelectedScenarios(prev => 
      prev.includes(scenarioId)
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    );
  };
  
  // Transform raw scenarios into flattened comparison data structure
  // We use compareScenarios if available, otherwise fallback to direct mapping
  const rawComparisonScenarios = scenarios.filter(s => selectedScenarios.includes(s.id));
  
  let comparisonData = [];
  try {
      comparisonData = compareScenarios(rawComparisonScenarios);
  } catch (e) {
      console.warn("compareScenarios failed, using raw data", e);
      // Fallback if compareScenarios utility fails or doesn't exist
      comparisonData = rawComparisonScenarios.map(s => ({
          id: s.id,
          name: s.name,
          maxWearDepth: s.wearProfile?.summary?.maxWearDepth?.wear || 0,
          minRemainingWT: s.wearProfile?.summary?.minRemainingWT?.wt || 0,
          minBurstSF: s.wearProfile?.summary?.minBurstSF?.sf || 0,
          minCollapseSF: s.wearProfile?.summary?.minCollapseSF?.sf || 0,
          riskScore: s.riskScore || 0,
          highRiskZoneCount: s.riskZones?.length || 0
      }));
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-lg font-bold text-white">Scenario Analysis</h2>
            <p className="text-sm text-slate-400">Create and compare different operating parameters.</p>
        </div>
        <Button onClick={handleCreateScenario} className="bg-emerald-600 hover:bg-emerald-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create New Scenario
        </Button>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="pb-3 border-b border-slate-800/50">
          <CardTitle className="text-sm text-slate-300">Available Scenarios</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {scenarios.length === 0 ? (
             <div className="text-center py-10 text-slate-500 border border-dashed border-slate-800 rounded-lg">
                <p>No scenarios created yet.</p>
                <p className="text-xs mt-1">Click "Create New Scenario" to get started.</p>
             </div>
          ) : (
            <div className="space-y-2">
              {scenarios.map(scenario => {
                const isSelected = selectedScenarios.includes(scenario.id);
                // Check if scenario has valid results to determine status color
                const hasResults = scenario.wearProfile || scenario.results;
                
                return (
                  <div 
                    key={scenario.id} 
                    className={`flex items-center justify-between p-3 rounded-md border transition-all ${
                        isSelected 
                        ? 'bg-amber-500/10 border-amber-500/30' 
                        : 'bg-slate-800/30 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                       <Button 
                          size="icon" 
                          variant="ghost"
                          className={`h-8 w-8 rounded-full border ${
                              isSelected 
                              ? 'bg-amber-500 text-white border-amber-500' 
                              : 'bg-transparent text-slate-500 border-slate-600 hover:border-slate-400'
                          }`}
                          onClick={() => toggleScenarioSelection(scenario.id)}
                        >
                         {isSelected ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-4 h-4" />}
                       </Button>
                      <div>
                        <div className="flex items-center gap-2">
                            <p className={`text-sm font-medium ${isSelected ? 'text-amber-400' : 'text-slate-200'}`}>
                                {scenario.name}
                            </p>
                            {!hasResults && <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">Draft</span>}
                        </div>
                        <p className="text-xs text-slate-500">
                            {scenario.modifications && Object.keys(scenario.modifications).length > 0 
                                ? Object.keys(scenario.modifications).join(', ') 
                                : 'Base Case Copy'}
                        </p>
                      </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-500 hover:text-red-400 hover:bg-red-950/30" 
                        onClick={() => deleteScenario(scenario.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      {comparisonData && comparisonData.length > 0 ? (
         <ScenarioComparison scenarios={comparisonData} />
      ) : selectedScenarios.length > 0 ? (
          <div className="text-center py-8 text-slate-500 bg-slate-900/50 rounded border border-slate-800">
              Selected scenarios do not have result data yet. Run calculation on base case first.
          </div>
      ) : null}
    </div>
  );
};

export default ScenariosTab;