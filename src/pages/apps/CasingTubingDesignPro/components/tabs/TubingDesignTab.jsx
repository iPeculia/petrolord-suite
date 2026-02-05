import React, { useState, useEffect, useMemo } from 'react';
import { useCasingTubingDesign } from '../../contexts/CasingTubingDesignContext';
import TubingStringList from '../tubing/TubingStringList';
import TubingSectionsTable from '../tubing/TubingSectionsTable';
import TubingDetailedResultsTable from '../tubing/TubingDetailedResultsTable';
import PackerLoadsTable from '../tubing/PackerLoadsTable';
import TubingDesignSummary from '../tubing/TubingDesignSummary';
import PackerConfigPanel from '../tubing/PackerConfigPanel';
import FlowCapacityAnalysis from '../tubing/FlowCapacityAnalysis';
import { SafetyFactorPlot, PressurePlot, AxialLoadPlot } from '../tubing/TubingPlots';
import { calculateTubingSectionResult, generatePlotData, calculateFlowAnalysis, calculatePackerLoads } from '../../utils/tubingCalculations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShieldAlert, ToggleRight, ToggleLeft, FileText } from 'lucide-react';
import TubingVisualizer from '../tubing/TubingVisualizer';
import CompletionComponentsList from '../tubing/CompletionComponentsList';
import { Button } from '@/components/ui/button';

const TubingDesignTab = () => {
    const { 
        tubingStrings, 
        casingStrings,
        loadCases, 
        packerConfig,
        safetyFactors
    } = useCasingTubingDesign();

    const [selectedStringId, setSelectedStringId] = useState(null);
    const [activeLoadCaseId, setActiveLoadCaseId] = useState(null);
    const [viewMode, setViewMode] = useState('plots'); // plots, results, flow
    const [showCasingComparison, setShowCasingComparison] = useState(false);

    // Default selections
    useEffect(() => {
        if (tubingStrings.length > 0 && !selectedStringId) setSelectedStringId(tubingStrings[0].id);
        if (loadCases.length > 0 && !activeLoadCaseId) setActiveLoadCaseId(loadCases[0].id);
    }, [tubingStrings, loadCases, selectedStringId, activeLoadCaseId]);

    const activeString = tubingStrings.find(s => s.id === selectedStringId);
    const activeLoadCase = loadCases.find(lc => lc.id === activeLoadCaseId);

    // Calculate detailed results for the active string
    const detailedResults = useMemo(() => {
        if (!activeString || !activeLoadCase) return [];
        return activeString.sections.map(sec => 
            calculateTubingSectionResult(sec, activeLoadCase, packerConfig)
        );
    }, [activeString, activeLoadCase, packerConfig]);

    // Derived Data for Plots
    const plotData = useMemo(() => 
        generatePlotData(activeString, activeLoadCase, showCasingComparison ? casingStrings : []), 
    [activeString, activeLoadCase, showCasingComparison, casingStrings]);

    // Flow Analysis
    const flowData = useMemo(() => 
        calculateFlowAnalysis(
            activeString, 
            300, // Reservoir P bar (mock)
            50,  // WHP bar (mock)
            activeString?.sections[0] ? parseFloat(activeString.sections[0].id_nom || 3.0) : 3.0 // ID
        ), 
    [activeString]);

    // Packer Loads
    const packerLoadResults = useMemo(() => 
        calculatePackerLoads(packerConfig, loadCases), 
    [packerConfig, loadCases]);

    // Warnings Generation
    const activeWarnings = useMemo(() => {
        const warns = [];
        if (!detailedResults) return warns;
        
        detailedResults.forEach(res => {
            if (parseFloat(res.burstSF) < safetyFactors.burst) warns.push({ type: 'critical', msg: `Burst SF low at ${res.depth}m` });
            if (parseFloat(res.collapseSF) < safetyFactors.collapse) warns.push({ type: 'critical', msg: `Collapse SF low at ${res.depth}m` });
            if (res.buckling === 'High') warns.push({ type: 'warning', msg: `High buckling risk at ${res.depth}m` });
        });
        
        if (flowData?.erosionRisk === 'Critical') warns.push({ type: 'critical', msg: 'Critical Erosion Velocity Exceeded' });
        
        return warns;
    }, [detailedResults, flowData, safetyFactors]);

    return (
        <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden m-0 p-0">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-4 py-1.5 border-b border-slate-800 bg-slate-900/50 shrink-0 h-10 mt-0">
                <div className="flex items-center space-x-4">
                    <Select value={selectedStringId?.toString()} onValueChange={(v) => setSelectedStringId(parseInt(v))}>
                        <SelectTrigger className="w-[200px] h-7 text-xs bg-slate-900 border-slate-700">
                            <SelectValue placeholder="Select String" />
                        </SelectTrigger>
                        <SelectContent>
                            {tubingStrings.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                        </SelectContent>
                    </Select>

                    <div className="h-5 w-px bg-slate-800" />

                    <Select value={activeLoadCaseId?.toString()} onValueChange={(v) => setActiveLoadCaseId(parseInt(v))}>
                        <SelectTrigger className="w-[200px] h-7 text-xs bg-slate-900 border-slate-700">
                            <SelectValue placeholder="Select Load Case" />
                        </SelectTrigger>
                        <SelectContent>
                            {loadCases.map(lc => <SelectItem key={lc.id} value={lc.id.toString()}>{lc.name} ({lc.type})</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Compare Casing</span>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`h-6 px-2 ${showCasingComparison ? 'text-lime-400 bg-lime-400/10' : 'text-slate-500'}`}
                            onClick={() => setShowCasingComparison(!showCasingComparison)}
                        >
                            {showCasingComparison ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                        </Button>
                    </div>

                    <Tabs value={viewMode} onValueChange={setViewMode} className="h-7">
                        <TabsList className="h-7 bg-slate-900 border border-slate-800 p-0">
                            <TabsTrigger value="plots" className="h-full text-xs px-3 data-[state=active]:bg-slate-800">Plots</TabsTrigger>
                            <TabsTrigger value="results" className="h-full text-xs px-3 data-[state=active]:bg-slate-800">Results</TabsTrigger>
                            <TabsTrigger value="flow" className="h-full text-xs px-3 data-[state=active]:bg-slate-800">Flow</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
                
                {/* Left Panel: String Management */}
                <div className="w-[280px] flex flex-col border-r border-slate-800 bg-slate-950/50 py-0">
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
                        <TubingStringList selectedId={selectedStringId} onSelect={setSelectedStringId} />
                        <div className="space-y-4">
                            <TubingSectionsTable stringId={selectedStringId} />
                            <CompletionComponentsList stringId={selectedStringId} />
                        </div>
                    </div>
                </div>

                {/* Center Panel: Plots/Analysis */}
                <div className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-hidden">
                    {/* Top Summary */}
                    <div className="px-4 py-1 border-b border-slate-800 bg-slate-900/20">
                        <TubingDesignSummary results={detailedResults} flowAnalysis={flowData} />
                    </div>

                    {/* Warnings Banner if any */}
                    {activeWarnings.length > 0 && (
                        <div className="px-4 py-1 bg-slate-900/50 border-b border-slate-800 flex flex-wrap gap-2">
                            {activeWarnings.map((w, i) => (
                                <div key={i} className={`flex items-center text-[10px] px-2 py-0.5 rounded border ${w.type === 'critical' ? 'bg-red-900/20 border-red-800 text-red-200' : 'bg-amber-900/20 border-amber-800 text-amber-200'}`}>
                                    <ShieldAlert className="w-3 h-3 mr-1.5" />
                                    {w.msg}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto pt-0 px-4 pb-0 custom-scrollbar">
                        {viewMode === 'plots' && (
                            <div className="grid grid-cols-12 gap-4 h-full pt-4">
                                <div className="col-span-3 h-full border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
                                     <TubingVisualizer activeString={activeString} />
                                </div>
                                <div className="col-span-9 grid grid-cols-3 gap-4 h-full pb-4">
                                    <SafetyFactorPlot data={plotData} showCasing={showCasingComparison} />
                                    <PressurePlot data={plotData} />
                                    <AxialLoadPlot data={plotData} />
                                </div>
                            </div>
                        )}

                        {viewMode === 'results' && (
                            <div className="space-y-6 pt-4 pb-4">
                                <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/50">
                                    <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 font-bold text-xs text-slate-300">Detailed Section Analysis</div>
                                    <TubingDetailedResultsTable results={detailedResults} />
                                </div>
                                
                                <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/50">
                                    <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 font-bold text-xs text-slate-300">Packer Loads Analysis</div>
                                    <PackerLoadsTable loads={packerLoadResults} />
                                </div>
                            </div>
                        )}

                        {viewMode === 'flow' && (
                            <div className="grid grid-cols-2 gap-4 pt-4 pb-4">
                                <FlowCapacityAnalysis flowData={flowData} />
                                <div className="border border-slate-800 rounded-lg bg-slate-900/50 p-4">
                                    <h4 className="text-xs font-bold text-slate-400 mb-4">Pressure Traverse Estimate</h4>
                                    <div className="h-48 flex items-end space-x-1 px-4 pb-2 border-b border-l border-slate-700">
                                        {/* Mock bars for profile visualization */}
                                        {[80, 75, 70, 65, 60, 55, 50, 45, 40, 35].map((h, i) => (
                                            <div key={i} className="flex-1 bg-blue-500/30 hover:bg-blue-500/50 transition-all rounded-t" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                        <span>BHP</span>
                                        <span>Surface</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Configuration */}
                <div className="w-[300px] border-l border-slate-800 bg-slate-950/50 flex flex-col overflow-y-auto custom-scrollbar py-0">
                    <div className="p-4 space-y-4">
                        <PackerConfigPanel />
                        
                        {/* Quick Calculations Log */}
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center">
                                <FileText className="w-3 h-3 mr-2" /> Calculation Log
                            </h4>
                            <div className="text-[10px] font-mono text-slate-500 space-y-1">
                                <div>&gt; Load Case: {activeLoadCase?.name}</div>
                                <div>&gt; Density: {activeLoadCase?.internal_fluid_density} ppg</div>
                                <div>&gt; Analysis Mode: Phase 4 Enhanced</div>
                                <div className="text-emerald-500">&gt; Safety Factors Updated</div>
                                {activeWarnings.length > 0 && <div className="text-amber-500">&gt; Warnings Detected ({activeWarnings.length})</div>}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TubingDesignTab;