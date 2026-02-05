import React, { useState, useMemo, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Wand2, Settings2, PanelRightClose, PanelRightOpen } from 'lucide-react';

import GuidedModePanel from './GuidedModePanel';
import ExpertModePanel from './ExpertModePanel';
import RealTimeChartUpdates from './RealTimeChartUpdates';
import ScenarioManager from './ScenarioManager';
import SensitivityAnalysisPanel from './SensitivityAnalysisPanel';
import ParameterHistoryTimeline from './ParameterHistoryTimeline';
import { runPPFGWorkflow } from '@/utils/ppfgEngine';

const Phase3ParameterTuning = ({ initialData }) => {
    // Local state management for parameters
    const [mode, setMode] = useState('guided');
    const [showScenarios, setShowScenarios] = useState(true);
    const [showSensitivity, setShowSensitivity] = useState(true);
    
    const [params, setParams] = useState({
        eatonExponent: 3.0,
        poisson: 0.4,
        nct: { a: 180, b: 0.00005 },
        waterDepth: 500,
        airGap: 80
    });

    const [results, setResults] = useState(null);
    const [history, setHistory] = useState([]);
    const [scenarios, setScenarios] = useState([{ id: 'base', name: 'Base Case', params: { ...params }, createdAt: new Date() }]);
    const [activeScenarioId, setActiveScenarioId] = useState('base');

    // Real-time calculation effect
    useEffect(() => {
        if (initialData && initialData.depths) {
            const calcResults = runPPFGWorkflow({
                ...initialData,
                params
            });
            
            // Map to chart friendly format
            const chartData = calcResults.depths.map((d, i) => ({
                depth: d,
                obg: calcResults.obg[i],
                pp: calcResults.pp[i],
                fg: calcResults.fg[i]
            })).filter((_, i) => i % 50 === 0);

            setResults({ ...calcResults, chartData });
        }
    }, [initialData, params]);

    const updateParam = (key, value) => {
        setParams(prev => {
            const newParams = { ...prev, [key]: value };
            // Add history
            setHistory(h => [...h.slice(-9), { timestamp: new Date(), change: `Updated ${key} to ${value}` }]);
            return newParams;
        });
    };

    const applyPreset = (presetName, riskProfile) => {
        // Mock preset logic
        if (presetName === 'NIGER_DELTA') {
            const factor = riskProfile === 'HIGH' ? 1.2 : riskProfile === 'LOW' ? 0.8 : 1.0;
            updateParam('eatonExponent', 3.0 * factor);
            updateParam('poisson', 0.45 * factor);
        }
    };

    const saveCurrentAsScenario = (name) => {
        const newScen = { id: Date.now(), name, params: { ...params }, createdAt: new Date() };
        setScenarios([...scenarios, newScen]);
        setActiveScenarioId(newScen.id);
    };

    const loadScenario = (id) => {
        const scen = scenarios.find(s => s.id === id);
        if (scen) {
            setParams(scen.params);
            setActiveScenarioId(id);
        }
    };

    return (
        <div className="flex h-full w-full bg-slate-950 overflow-hidden">
            {/* Left Panel: Controls */}
            <div className="w-80 flex flex-col border-r border-slate-800 bg-slate-950 shrink-0 z-10">
                <div className="p-2 border-b border-slate-800">
                    <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setMode('guided')}
                            className={`flex-1 text-xs ${mode === 'guided' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                        >
                            <Wand2 className="w-3 h-3 mr-2" /> Guided
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setMode('expert')}
                            className={`flex-1 text-xs ${mode === 'expert' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                        >
                            <Settings2 className="w-3 h-3 mr-2" /> Expert
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    {mode === 'guided' ? (
                        <GuidedModePanel currentParams={params} applyPreset={applyPreset} />
                    ) : (
                        <ExpertModePanel currentParams={params} updateParam={updateParam} />
                    )}
                </div>
                
                {/* Bottom Left: History */}
                <ParameterHistoryTimeline history={history} />
            </div>

            {/* Center Panel: Visualization */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <div className="flex-1 p-4 relative">
                    {/* Chart Layer */}
                    <RealTimeChartUpdates results={results} />
                    
                    {/* Overlay Sensitivity Panel (Bottom) */}
                    {showSensitivity && (
                        <div className="absolute bottom-4 left-4 right-4 h-48 bg-slate-950/95 backdrop-blur border border-slate-800 rounded-lg shadow-2xl z-20 transition-all transform translate-y-0">
                             <div className="absolute top-2 right-2 z-30">
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white" onClick={() => setShowSensitivity(false)}>×</Button>
                             </div>
                             <SensitivityAnalysisPanel baseInputs={initialData} params={params} active={showSensitivity} />
                        </div>
                    )}
                </div>
                
                {/* Bottom Bar controls for view */}
                {!showSensitivity && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <Button variant="outline" size="sm" className="text-xs border-slate-700 text-slate-300 bg-slate-900 shadow-xl" onClick={() => setShowSensitivity(true)}>
                            Show Sensitivity Analysis
                        </Button>
                    </div>
                )}
            </div>

            {/* Right Panel: Scenarios */}
            {showScenarios && (
                <ScenarioManager 
                    scenarios={scenarios}
                    activeId={activeScenarioId}
                    setActive={loadScenario}
                    onSave={saveCurrentAsScenario}
                />
            )}
            
            {/* Toggle Right Panel */}
            <div className="absolute top-4 right-4 z-30">
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    className="bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white shadow-lg backdrop-blur-sm"
                    onClick={() => setShowScenarios(!showScenarios)}
                 >
                    {showScenarios ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                 </Button>
            </div>
        </div>
    );
};

export default Phase3ParameterTuning;