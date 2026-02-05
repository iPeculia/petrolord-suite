import React, { useState, useEffect, useMemo } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Helmet } from 'react-helmet';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ZoomIn, ZoomOut, RotateCcw, Save, Layers } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';

// Components
import LogCanvas from '@/components/well-log/LogCanvas';
import {
    CurveDisplayPanel,
    PetrophysicsPanel,
    LogQualityPanel,
    StatisticsPanel,
    CorrelationPanel,
    InterpretationPanel,
    ExportPanel
} from '@/components/well-log/WellLogSidebars';

// Utils
import { 
    generateSyntheticLogs, 
    calculatePetrophysics, 
    calculateCorrelationMatrix, 
    detectAnomalies 
} from '@/utils/wellLogUtils';

const WellLogAnalyzer = () => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('curves');
    const [data, setData] = useState([]);
    
    // State
    const [depthRange, setDepthRange] = useState([1000, 1200]); // Initial zoom
    const [fullDepthRange, setFullDepthRange] = useState([1000, 1500]);
    const [activeTool, setActiveTool] = useState(null);
    const [picks, setPicks] = useState([]);
    const [showGrid, setShowGrid] = useState(true);
    
    // Petrophysics Params
    const [petroParams, setPetroParams] = useState({
        a: 1, m: 2, n: 2, Rw: 0.05, matrixRho: 2.65, fluidRho: 1.0
    });

    // Analysis State
    const [qualityReport, setQualityReport] = useState(null);
    const [correlationData, setCorrelationData] = useState([]);

    // Tracks Configuration
    const [tracks, setTracks] = useState([
        { 
            id: 'track1', title: 'Lithology', visible: true, 
            curves: [{ name: 'GR', color: '#22c55e', min: 0, max: 150 }] 
        },
        { 
            id: 'track2', title: 'Resistivity', visible: true, 
            curves: [{ name: 'RES', color: '#ef4444', min: 0.2, max: 2000, scale: 'log' }] 
        },
        { 
            id: 'track3', title: 'Porosity', visible: true, 
            curves: [
                { name: 'NPHI', color: '#3b82f6', min: 0.45, max: -0.15 }, 
                { name: 'RHOB', color: '#ef4444', min: 1.95, max: 2.95 }
            ] 
        },
        { 
            id: 'track4', title: 'Sonic', visible: true, 
            curves: [{ name: 'DT', color: '#a855f7', min: 140, max: 40 }] 
        }
    ]);

    // Initial Data Load
    useEffect(() => {
        const logs = generateSyntheticLogs(1000, 1500, 0.5);
        setData(logs);
        
        // Initial Calcs
        const qc = detectAnomalies(logs, 'GR');
        setQualityReport(qc);
        
        const curves = ['GR', 'RES', 'NPHI', 'RHOB', 'DT'];
        setCorrelationData(calculateCorrelationMatrix(logs, curves));
    }, []);

    // Handlers
    const handleZoom = (factor) => {
        const mid = (depthRange[0] + depthRange[1]) / 2;
        const span = (depthRange[1] - depthRange[0]) * factor;
        setDepthRange([Math.max(fullDepthRange[0], mid - span/2), Math.min(fullDepthRange[1], mid + span/2)]);
    };

    const handleCalculatePetrophysics = () => {
        const newData = calculatePetrophysics(data, petroParams);
        setData(newData);
        
        // Add new track if not exists
        if (!tracks.find(t => t.id === 'calc_track')) {
            setTracks(prev => [...prev, {
                id: 'calc_track', title: 'Results', visible: true,
                curves: [
                    { name: 'SW_CALC', color: '#0ea5e9', min: 0, max: 1 },
                    { name: 'PHI_CALC', color: '#eab308', min: 0, max: 0.5 }
                ]
            }]);
        }
        toast({ title: "Calculation Complete", description: "Derived curves (PHI_CALC, SW_CALC) added to new track." });
    };

    const handlePick = (depth) => {
        setPicks(prev => [...prev, { 
            depth, 
            name: `Horizon ${prev.length + 1}`, 
            type: 'horizon',
            color: '#facc15' 
        }].sort((a,b) => a.depth - b.depth));
        toast({ description: `Picked horizon at ${depth.toFixed(1)}m` });
    };

    const handleUpdateCurve = (trackId, curveIdx, field, value) => {
        setTracks(prev => prev.map(t => {
            if (t.id !== trackId) return t;
            const newCurves = [...t.curves];
            newCurves[curveIdx] = { ...newCurves[curveIdx], [field]: value };
            return { ...t, curves: newCurves };
        }));
    };

    const handleExport = (type) => {
        if (type === 'json') {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ picks, tracks }));
            const link = document.createElement('a');
            link.href = dataStr;
            link.download = "well_project.json";
            link.click();
        } else if (type === 'csv') {
            // Simple CSV export logic
            const header = Object.keys(data[0]).join(',');
            const rows = data.map(row => Object.values(row).join(',')).join('\n');
            const blob = new Blob([header + '\n' + rows], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = "log_data.csv";
            link.click();
        } else {
            toast({ description: `${type.toUpperCase()} export feature placeholder.` });
        }
    };

    return (
        <div className="h-screen w-full flex flex-col bg-slate-950 text-slate-200 overflow-hidden font-sans">
            <Helmet>
                <title>Well Log Analyzer - Petrolord</title>
            </Helmet>

            {/* Header */}
            <div className="h-14 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center justify-between px-4 shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center shadow-lg">
                        <Layers className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-white tracking-wide">Well Log Analyzer</h1>
                        <p className="text-[10px] text-slate-400">Exploration & Appraisal Module</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex bg-slate-800 rounded p-1 gap-1 border border-slate-700">
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-slate-700" onClick={() => handleZoom(0.8)}><ZoomIn className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-slate-700" onClick={() => handleZoom(1.2)}><ZoomOut className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-slate-700" onClick={() => setDepthRange(fullDepthRange)}><RotateCcw className="w-4 h-4" /></Button>
                    </div>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-2 h-8 text-xs ml-2">
                        <Save className="w-3.5 h-3.5" /> Save Project
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                <PanelGroup direction="horizontal">
                    {/* Left Sidebar: Controls */}
                    <Panel defaultSize={25} minSize={20} maxSize={35} className="bg-slate-900 border-r border-slate-800 flex flex-col z-10">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                            <div className="px-2 pt-2 pb-0">
                                <TabsList className="w-full bg-slate-800 h-9">
                                    <TabsTrigger value="curves" className="flex-1 text-[10px] h-7">Display</TabsTrigger>
                                    <TabsTrigger value="petro" className="flex-1 text-[10px] h-7">Calc</TabsTrigger>
                                    <TabsTrigger value="analysis" className="flex-1 text-[10px] h-7">Analysis</TabsTrigger>
                                    <TabsTrigger value="export" className="flex-1 text-[10px] h-7">Export</TabsTrigger>
                                </TabsList>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <ErrorBoundary>
                                    <TabsContent value="curves" className="mt-0">
                                        <CurveDisplayPanel 
                                            tracks={tracks} 
                                            onToggleTrack={(id) => setTracks(t => t.map(x => x.id === id ? {...x, visible: !x.visible} : x))} 
                                            onUpdateCurve={handleUpdateCurve}
                                        />
                                        <div className="px-4 pb-4 border-t border-slate-800 pt-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-400">Show Grid</span>
                                                <input type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)} />
                                            </div>
                                        </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="petro" className="mt-0">
                                        <PetrophysicsPanel 
                                            params={petroParams} 
                                            setParams={setPetroParams} 
                                            onCalculate={handleCalculatePetrophysics} 
                                        />
                                        <InterpretationPanel 
                                            picks={picks} 
                                            onRemovePick={(idx) => setPicks(p => p.filter((_, i) => i !== idx))}
                                            activeTool={activeTool}
                                            setActiveTool={setActiveTool}
                                        />
                                    </TabsContent>
                                    
                                    <TabsContent value="analysis" className="mt-0">
                                        <div className="space-y-4">
                                            <LogQualityPanel qualityReport={qualityReport} />
                                            <StatisticsPanel logData={data} curves={['GR', 'NPHI', 'RHOB', 'DT']} />
                                            <CorrelationPanel correlationMatrix={correlationData} />
                                        </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="export" className="mt-0">
                                        <ExportPanel onExport={handleExport} />
                                    </TabsContent>
                                </ErrorBoundary>
                            </div>
                        </Tabs>
                    </Panel>

                    <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-emerald-500 transition-colors" />

                    {/* Canvas Area */}
                    <Panel className="bg-slate-950 relative overflow-hidden">
                         <ErrorBoundary>
                             <LogCanvas 
                                data={data}
                                tracks={tracks}
                                depthRange={depthRange}
                                onDepthSelect={handlePick}
                                activeTool={activeTool}
                                interpretations={picks}
                                showGrid={showGrid}
                             />
                         </ErrorBoundary>
                         
                         {/* Overlay Info */}
                         <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded border border-slate-800 pointer-events-none">
                             <div className="text-[10px] font-mono text-slate-400">
                                 Depth: {depthRange[0].toFixed(0)} - {depthRange[1].toFixed(0)} m
                             </div>
                         </div>
                         
                         {activeTool === 'picker' && (
                             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-emerald-900/80 text-emerald-200 px-4 py-2 rounded-full text-xs border border-emerald-500/50 animate-pulse pointer-events-none">
                                 Picking Mode Active: Click track to add horizon
                             </div>
                         )}
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    );
};

export default WellLogAnalyzer;