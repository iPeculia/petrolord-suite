import React, { useState, useEffect } from 'react';
import { useCasingTubingDesign } from '../../contexts/CasingTubingDesignContext';
import CasingStringList from '../casing/CasingStringList';
import DesignResultsTable from '../casing/DesignResultsTable';
import CasingVisualizer from '../casing/CasingVisualizer';
import DesignSummary from '../casing/DesignSummary';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Wand2, Download, Upload, Layers, Activity } from 'lucide-react';
import CasingSectionsTable from '../casing/CasingSectionsTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateMargins } from '../../utils/casingCalculations';

const CasingDesignTab = () => {
    const { 
        casingStrings, 
        loadCases, 
        safetyFactors,
        addLog
    } = useCasingTubingDesign();

    const [selectedStringId, setSelectedStringId] = useState(null);
    const [activeLoadCaseId, setActiveLoadCaseId] = useState(loadCases[0]?.id || null);
    const [calculatedResults, setCalculatedResults] = useState({});
    const [designNotes, setDesignNotes] = useState('');

    // Select first string by default
    useEffect(() => {
        if (casingStrings.length > 0 && !selectedStringId) {
            setSelectedStringId(casingStrings[0].id);
        }
    }, [casingStrings, selectedStringId]);

    // Set default load case if available
    useEffect(() => {
        if (loadCases.length > 0 && !activeLoadCaseId) {
            setActiveLoadCaseId(loadCases[0].id);
        }
    }, [loadCases, activeLoadCaseId]);

    // Perform Calculations Effect
    useEffect(() => {
        if (!activeLoadCaseId) return;
        const currentLoadCase = loadCases.find(lc => lc.id === activeLoadCaseId);
        
        const newResults = {};
        casingStrings.forEach(str => {
            if (str.sections) {
                str.sections.forEach(sec => {
                    newResults[sec.id] = calculateMargins(sec, currentLoadCase, safetyFactors);
                });
            }
        });
        setCalculatedResults(newResults);
    }, [casingStrings, activeLoadCaseId, loadCases, safetyFactors]);

    const activeString = casingStrings.find(s => s.id === selectedStringId);

    const handleOptimize = () => {
        addLog("Optimization started...", "info");
        setTimeout(() => addLog("Optimization engine not connected (Stub).", "warning"), 1000);
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden m-0 p-0">
            
            {/* Toolbar */}
            <div className="flex items-center justify-between px-6 py-1.5 border-b border-slate-800 bg-slate-900/50 shrink-0 h-10 mt-0">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Active Load Case</span>
                        <Select value={activeLoadCaseId?.toString()} onValueChange={(val) => setActiveLoadCaseId(parseInt(val) || val)}>
                            <SelectTrigger className="w-[200px] h-7 bg-slate-900 border-slate-700 text-xs">
                                <SelectValue placeholder="Select Load Case" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                {loadCases.map(lc => (
                                    <SelectItem key={lc.id} value={lc.id.toString()}>{lc.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="h-6 w-px bg-slate-800 mx-2" />
                    
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                        <span className="font-semibold text-slate-500">Safety Factors:</span>
                        <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700" title="Burst">B: {safetyFactors.burst}</span>
                        <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700" title="Collapse">C: {safetyFactors.collapse}</span>
                        <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700" title="Tension">T: {safetyFactors.tension}</span>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800" onClick={handleOptimize}>
                        <Wand2 className="w-3.5 h-3.5 mr-2" /> Optimize
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                        <ImportIcon className="w-3.5 h-3.5 mr-2" /> Import
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                        <Download className="w-3.5 h-3.5 mr-2" /> Export
                    </Button>
                </div>
            </div>

            {/* Main Workspace */}
            <div className="flex flex-1 overflow-hidden">
                
                {/* Left: String Manager (25%) */}
                <div className="w-1/4 border-r border-slate-800 bg-slate-900/20 flex flex-col min-w-[300px]">
                    <div className="p-2 border-b border-slate-800">
                        <h3 className="text-xs font-semibold text-white px-2">Casing Strings</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        <CasingStringList selectedId={selectedStringId} onSelect={setSelectedStringId} />
                    </div>
                </div>

                {/* Center: Editor & Results (45%) */}
                <div className="w-2/5 border-r border-slate-800 flex flex-col bg-slate-950 min-w-[400px]">
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                        
                        {/* Sections Editor */}
                        <div>
                            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center">
                                <Layers className="w-4 h-4 mr-2 text-blue-400" />
                                Section Configuration {activeString && ` - ${activeString.name}`}
                            </h3>
                            <CasingSectionsTable stringId={selectedStringId} />
                        </div>

                        <Separator className="bg-slate-800" />

                        {/* Results Table */}
                        <div>
                            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center">
                                <Activity className="w-4 h-4 mr-2 text-lime-400" />
                                Calculation Results
                            </h3>
                            <DesignResultsTable stringId={selectedStringId} results={calculatedResults} />
                        </div>

                        {/* Notes */}
                        <div className="pt-2">
                            <h3 className="text-xs font-semibold text-slate-500 mb-2 uppercase">Design Notes</h3>
                            <Textarea 
                                value={designNotes}
                                onChange={(e) => setDesignNotes(e.target.value)}
                                placeholder="Enter design assumptions or comments..."
                                className="bg-slate-900 border-slate-800 text-xs min-h-[100px] focus:border-slate-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Right: Viz & Summary (30%) */}
                <div className="flex-1 bg-slate-900/30 flex flex-col min-w-[300px]">
                    <div className="p-4 flex flex-col h-full space-y-4">
                        <DesignSummary results={calculatedResults} />
                        
                        <Card className="flex-1 bg-slate-900 border-slate-800 flex flex-col overflow-hidden">
                            <CardHeader className="py-2 px-4 border-b border-slate-800 bg-slate-950/50">
                                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-wider">String Visualization</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 relative">
                                <CasingVisualizer activeString={activeString} />
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Helper for icon
const ImportIcon = (props) => (
    <Upload {...props} />
);

export default CasingDesignTab;