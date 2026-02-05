import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStudio } from '@/contexts/StudioContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Settings, Layers, Activity, Database, ClipboardCheck, Zap, Share2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

import { calculateAmplitudeStats, calculateSpectrum } from '@/utils/seismicAnalysisUtils';

// Components
import SeismicDataDisplay from './seismic/SeismicDataDisplay';
import SeismicInterpretationToolbar from './seismic/SeismicInterpretationToolbar';
import SeismicLayerManager from './seismic/SeismicLayerManager';
import HorizonPickingTools from './seismic/HorizonPickingTools';
import FaultInterpretationTools from './seismic/FaultInterpretationTools';
import SeismicToWellTie from './seismic/SeismicToWellTie';
import AmplitudeAnalysisPanel from './seismic/AmplitudeAnalysisPanel';
import FrequencyAnalysisPanel from './seismic/FrequencyAnalysisPanel';
import SeismicExportPanel from './seismic/SeismicExportPanel';
import SeismicAnalysisPanel from './seismic/SeismicAnalysisPanel';
import SeismicAttributeExtraction from './seismic/SeismicAttributeExtraction';
import SeismicQualityAssessment from './seismic/SeismicQualityAssessment';
import SeismicInterpretationDatabase from './seismic/SeismicInterpretationDatabase';

const SeismicAnalyzerView = () => {
    const { selectedAsset, allAssets, activeProject, setSeismicState, seismicState, setAllInterpretations, allInterpretations, setSeismicTransform, setSeismicViewParams, selectAssetAndParentWell } = useStudio();
    const { toast } = useToast();
    const { user } = useAuth();

    // --- STATE ---
    const [activeTool, setActiveTool] = useState('select');
    const [analysisMode, setAnalysisMode] = useState(false);
    const [activeWellTie, setActiveWellTie] = useState(false);
    
    const [layers, setLayers] = useState({
        seismic: { visible: true, opacity: 1 },
        horizons: { visible: true, opacity: 1 },
        faults: { visible: true, opacity: 1 },
        wells: { visible: true, opacity: 0.8 },
        grid: { visible: false, opacity: 0.3 }
    });

    const [displaySettings, setDisplaySettings] = useState({
        brightness: 0,
        contrast: 0,
        amplitudeScaling: 'linear' // linear, log, power
    });
    
    const [session, setSession] = useState({
        activeInterpretationId: null,
        currentPicks: [], 
        interpretations: [],
        projectedWells: [],
        history: [], // For Undo/Redo
        historyIndex: -1
    });

    const [stats, setStats] = useState({ min: 0, max: 0, avg: 0, rms: 0 });
    const [spectrum, setSpectrum] = useState([]);
    const [syntheticParams, setSyntheticParams] = useState({ timeShift: 0, frequency: 25 });
    
    // --- EFFECTS ---

    // Sync Ecosystem Selection
    useEffect(() => {
        // If a well is selected in another view (via context), ensure it's highlighted here
        if (selectedAsset?.type === 'well') {
            // Logic to center view on well or highlight well track
            const well = allAssets.find(a => a.id === selectedAsset.id);
            if (well) {
                toast({ title: "Well Selected", description: `Highlighting ${well.name} on seismic section.` });
                // In a real app, we would calc projection and pan to X
            }
        }
    }, [selectedAsset, allAssets, toast]);

    // Load Interpretations from Context
    useEffect(() => {
        setSession(prev => ({ ...prev, interpretations: allInterpretations || [] }));
    }, [allInterpretations]);

    // Project Wells (Mock)
    useEffect(() => {
        const wells = allAssets.filter(a => a.type === 'well');
        const projected = wells.map(w => ({ 
            id: w.id, 
            name: w.name, 
            x: 100 + Math.random() * 500 // Mock projection logic
        }));
        setSession(prev => ({ ...prev, projectedWells: projected }));
    }, [allAssets]);

    // Update Stats & Spectrum
    useEffect(() => {
        if (seismicState.seismicData && analysisMode) {
            const traceIndex = Math.floor(seismicState.seismicData.traces.length / 2);
            const traceData = seismicState.seismicData.traces[traceIndex];
            if(traceData) {
                const newStats = calculateAmplitudeStats(traceData, 0, traceData.length);
                setStats(newStats);
                const spec = calculateSpectrum(traceData, seismicState.seismicData.dt_ms || 2);
                setSpectrum(spec);
            }
        }
    }, [seismicState.seismicData, analysisMode]);

    // --- HANDLERS ---

    const addToHistory = (newPicks) => {
        setSession(prev => {
            const newHistory = prev.history.slice(0, prev.historyIndex + 1);
            newHistory.push(newPicks);
            return {
                ...prev,
                currentPicks: newPicks,
                history: newHistory,
                historyIndex: newHistory.length - 1
            };
        });
    };

    const handleUndo = () => {
        if (session.historyIndex > 0) {
            setSession(prev => ({
                ...prev,
                historyIndex: prev.historyIndex - 1,
                currentPicks: prev.history[prev.historyIndex - 1]
            }));
        } else if (session.historyIndex === 0) {
             setSession(prev => ({ ...prev, historyIndex: -1, currentPicks: [] }));
        }
    };

    const handleRedo = () => {
        if (session.historyIndex < session.history.length - 1) {
            setSession(prev => ({
                ...prev,
                historyIndex: prev.historyIndex + 1,
                currentPicks: prev.history[prev.historyIndex + 1]
            }));
        }
    };

    const handlePick = (point) => {
        if (activeTool === 'horizon' || activeTool === 'fault') {
            const newPicks = [...session.currentPicks, point];
            addToHistory(newPicks);
        }
        // Ecosystem: If clicking near a well, select it
        if (activeTool === 'select') {
            // Mock well click detection
            // const nearestWell = findNearestWell(point.x);
            // if (nearestWell) selectAssetAndParentWell(nearestWell);
        }
    };

    const handleAutoTrack = (mode) => {
        if (session.currentPicks.length === 0) {
            toast({ title: "No seed point", description: "Please pick a starting point first." });
            return;
        }
        const seed = session.currentPicks[session.currentPicks.length - 1];
        // Mock Auto-tracking
        const newPoints = [...session.currentPicks];
        for(let i=1; i<50; i++) {
            newPoints.push({ x: seed.x + i, y: seed.y + Math.sin(i/5)*2 }); 
            newPoints.unshift({ x: seed.x - i, y: seed.y + Math.sin(-i/5)*2 });
        }
        addToHistory(newPoints);
        toast({ title: "Auto-track Complete", description: `Tracked ${newPoints.length} points.` });
    };

    const handleSaveInterpretation = async () => {
        if (session.currentPicks.length === 0) {
            // Also support saving session state without picks
            const meta = { viewParams: seismicState.viewParams, layers };
            const { error } = await supabase.from('ss_assets').insert({
                project_id: activeProject.id,
                name: `Seismic Session ${new Date().toLocaleTimeString()}`,
                type: 'seismic-session',
                meta,
                created_by: user.id
            });
            if(!error) toast({ title: "Session Saved", description: "View settings saved." });
            return;
        }
        
        const kind = activeTool === 'fault' ? 'fault' : 'horizon';
        const name = `New ${kind} ${new Date().toLocaleTimeString()}`;
        
        const { data, error } = await supabase.from('ss_interpretations').insert({
            project_id: activeProject.id,
            kind,
            name,
            data: { points: session.currentPicks },
            created_by: user.id
        }).select();

        if (!error) {
            setAllInterpretations(prev => [...prev, data[0]]);
            setSession(prev => ({ ...prev, currentPicks: [], history: [], historyIndex: -1 }));
            toast({ title: "Saved", description: `${kind} saved successfully.` });
        } else {
            toast({ variant: "destructive", title: "Error", description: error.message });
        }
    };

    const handleAttributeGenerated = (newSeismicData, attributeName) => {
        // In a real app, this would add a new layer or replace current data
        setSeismicState(prev => ({ ...prev, seismicData: newSeismicData }));
        // Optionally save attribute as new asset
    };

    const handleLoadSession = (sessionMeta) => {
        if (sessionMeta.viewParams) setSeismicViewParams(sessionMeta.viewParams);
        if (sessionMeta.layers) setLayers(sessionMeta.layers);
    };

    const handleZoom = (direction) => {
        setSeismicTransform(prev => ({
            ...prev,
            k: direction === 'in' ? prev.k * 1.2 : prev.k * 0.8
        }));
    };

    const handleReset = () => {
        setSeismicTransform({ x: 0, y: 0, k: 1 });
        setSeismicViewParams(p => ({ ...p, index: 0 }));
    };

    return (
        <div className="flex h-full w-full bg-slate-950 text-white overflow-hidden font-sans flex-col">
            <SeismicInterpretationToolbar 
                activeTool={activeTool} 
                setActiveTool={setActiveTool}
                analysisMode={analysisMode}
                setAnalysisMode={setAnalysisMode}
                onZoomIn={() => handleZoom('in')}
                onZoomOut={() => handleZoom('out')}
                onReset={handleReset}
                onFit={handleReset}
                onExport={(fmt) => toast({ title: `Exporting ${fmt}...` })}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={session.historyIndex >= 0}
                canRedo={session.historyIndex < session.history.length - 1}
            />

            <PanelGroup direction="horizontal" className="flex-grow">
                {/* Left Controls */}
                <Panel defaultSize={20} minSize={18} maxSize={30} className="bg-slate-900 border-r border-slate-800 flex flex-col">
                    <ScrollArea className="h-full">
                        <Accordion type="multiple" defaultValue={['display', 'layers', 'tools']} className="w-full">
                            
                            <AccordionItem value="display">
                                <AccordionTrigger className="px-4 py-3 text-xs font-bold text-slate-300 hover:bg-slate-800/50">
                                    <div className="flex items-center"><Settings className="w-3 h-3 mr-2"/> Display & Attributes</div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 py-2 bg-slate-950/30 space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] text-slate-400"><span>Brightness</span><span>{displaySettings.brightness}</span></div>
                                        <Slider min={-100} max={100} step={1} value={[displaySettings.brightness]} onValueChange={([v]) => setDisplaySettings(p => ({...p, brightness: v}))} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] text-slate-400"><span>Contrast</span><span>{displaySettings.contrast}</span></div>
                                        <Slider min={-100} max={100} step={1} value={[displaySettings.contrast]} onValueChange={([v]) => setDisplaySettings(p => ({...p, contrast: v}))} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs text-slate-400">Log Scaling</Label>
                                        <Switch checked={displaySettings.amplitudeScaling === 'log'} onCheckedChange={(v) => setDisplaySettings(p => ({...p, amplitudeScaling: v ? 'log' : 'linear'}))} className="scale-75" />
                                    </div>
                                    
                                    <Separator className="bg-slate-800" />
                                    <SeismicAttributeExtraction 
                                        seismicData={seismicState.seismicData} 
                                        onAttributeGenerated={handleAttributeGenerated} 
                                    />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="layers">
                                <AccordionTrigger className="px-4 py-3 text-xs font-bold text-slate-300 hover:bg-slate-800/50">
                                    <div className="flex items-center"><Layers className="w-3 h-3 mr-2"/> Layer Manager</div>
                                </AccordionTrigger>
                                <AccordionContent className="px-0 py-0 bg-slate-950/30">
                                    <SeismicLayerManager layers={layers} setLayers={setLayers} />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="tools">
                                <AccordionTrigger className="px-4 py-3 text-xs font-bold text-slate-300 hover:bg-slate-800/50">
                                    Interpretation
                                </AccordionTrigger>
                                <AccordionContent className="px-4 py-2 bg-slate-950/30 space-y-4">
                                    {activeTool === 'horizon' && (
                                        <HorizonPickingTools 
                                            activeHorizon={session.activeInterpretationId} 
                                            setActiveHorizon={(id) => setSession(p => ({...p, activeInterpretationId: id}))}
                                            onAutoTrack={handleAutoTrack}
                                            onClear={() => setSession(p => ({...p, currentPicks: [], history: [], historyIndex: -1}))}
                                            horizons={session.interpretations.filter(i => i.kind === 'horizon')}
                                            onUndo={handleUndo}
                                            canUndo={session.historyIndex >= 0}
                                            onSmooth={() => toast({title: "Smoothing applied"})}
                                        />
                                    )}
                                    {activeTool === 'fault' && (
                                        <FaultInterpretationTools 
                                            onNewFault={() => setSession(p => ({...p, currentPicks: [], history: [], historyIndex: -1}))}
                                            onValidate={() => toast({title: "Fault Validated"})}
                                        />
                                    )}
                                    <SeismicToWellTie 
                                        active={activeWellTie || activeTool === 'well-tie'}
                                        onToggle={(v) => setActiveWellTie(v)}
                                        wells={allAssets.filter(a => a.type === 'well')}
                                        selectedWellId={null}
                                        onWellSelect={() => {}}
                                        timeShift={syntheticParams.timeShift}
                                        setTimeShift={(v) => setSyntheticParams(p => ({...p, timeShift: v}))}
                                        onGenerateSynthetic={() => toast({title: "Synthetic Updated"})}
                                    />
                                </AccordionContent>
                            </AccordionItem>

                        </Accordion>
                    </ScrollArea>
                </Panel>

                <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-cyan-500 transition-colors" />

                {/* Center Display */}
                <Panel className="relative bg-black flex flex-col">
                    <div className="flex-grow relative">
                        <SeismicDataDisplay 
                            asset={selectedAsset}
                            parentSeismic={allAssets.find(a => a.type === 'seis.volume' && a.id === selectedAsset?.parent_id)}
                            session={{...session, activeTool}}
                            onPick={handlePick}
                            layers={layers}
                            displaySettings={displaySettings}
                        />
                    </div>
                </Panel>

                <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-cyan-500 transition-colors" />

                {/* Right Analysis Panel */}
                <Panel defaultSize={25} minSize={20} maxSize={35} collapsible={true} className="bg-slate-900 border-l border-slate-800">
                    <ScrollArea className="h-full">
                        <Accordion type="multiple" defaultValue={['analysis', 'quality', 'db', 'export']} className="w-full">
                            <AccordionItem value="analysis">
                                <AccordionTrigger className="px-4 py-3 text-xs font-bold text-slate-300 hover:bg-slate-800/50">
                                    <div className="flex items-center"><Activity className="w-3 h-3 mr-2 text-blue-400"/> Analytics</div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 py-2 bg-slate-950/30">
                                    <SeismicAnalysisPanel stats={stats} horizonStats={[]} />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="quality">
                                <AccordionTrigger className="px-4 py-3 text-xs font-bold text-slate-300 hover:bg-slate-800/50">
                                    <div className="flex items-center"><ClipboardCheck className="w-3 h-3 mr-2 text-teal-400"/> QC Report</div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 py-2 bg-slate-950/30">
                                    <SeismicQualityAssessment />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="db">
                                <AccordionTrigger className="px-4 py-3 text-xs font-bold text-slate-300 hover:bg-slate-800/50">
                                    <div className="flex items-center"><Database className="w-3 h-3 mr-2 text-indigo-400"/> Session Database</div>
                                </AccordionTrigger>
                                <AccordionContent className="px-0 py-0 bg-slate-950/30 h-64">
                                    <SeismicInterpretationDatabase onLoadSession={handleLoadSession} />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="export">
                                <AccordionTrigger className="px-4 py-3 text-xs font-bold text-slate-300 hover:bg-slate-800/50">
                                    <div className="flex items-center"><Share2 className="w-3 h-3 mr-2 text-green-400"/> Export</div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 py-2 bg-slate-950/30">
                                    <SeismicExportPanel onSaveSession={handleSaveInterpretation} currentSessionData={session} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </ScrollArea>
                </Panel>
            </PanelGroup>
        </div>
    );
};

export default SeismicAnalyzerView;