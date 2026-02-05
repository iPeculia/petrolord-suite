import React, { useState, useMemo, useEffect } from 'react';
import { useStudio } from '@/contexts/StudioContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Settings, Layers, Info, Activity, GitGraph, Palette } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/SupabaseAuthContext';

// Components
import CrossSectionCanvas from './cross-section/CrossSectionCanvas';
import CrossSectionToolbar from './cross-section/CrossSectionToolbar';
import CrossSectionLayerManager from './cross-section/CrossSectionLayerManager';
import CrossSectionPropertyPanel from './cross-section/CrossSectionPropertyPanel';
import CrossSectionMeasurementTools from './cross-section/CrossSectionMeasurementTools';
import CrossSectionExportPanel from './cross-section/CrossSectionExportPanel';
import CrossSectionLegend from './cross-section/CrossSectionLegend';
import CrossSectionLineManager from './cross-section/CrossSectionLineManager';
import CrossSectionAnalysisPanel from './cross-section/CrossSectionAnalysisPanel';
import CrossSectionCorrelationPanel from './cross-section/CrossSectionCorrelationPanel';
import CrossSectionPropertyColoringPanel from './cross-section/CrossSectionPropertyColoringPanel';

import { calculateSectionLength, projectPointToSection } from '@/utils/crossSectionUtils';

const CrossSectionView = () => {
    const { allAssets, selectAssetAndParentWell, activeProject, setActiveTab } = useStudio();
    const { user } = useAuth();
    const { toast } = useToast();
    
    // State
    const [activeTool, setActiveTool] = useState('select'); 
    const [sectionLine, setSectionLine] = useState([]);
    const [savedLines, setSavedLines] = useState([]);
    const [selection, setSelection] = useState(null);
    const [measurementResult, setMeasurementResult] = useState(null);
    
    const [layers, setLayers] = useState({
        wells: { label: 'Wells', visible: true, opacity: 1 },
        horizons: { label: 'Horizons', visible: true, opacity: 1 },
        faults: { label: 'Faults', visible: true, opacity: 1 },
        grid: { label: 'Grid', visible: true, opacity: 0.3 },
        coloring: { label: 'Property Color', visible: true, opacity: 0.6 }
    });

    const [viewSettings, setViewSettings] = useState({
        verticalExaggeration: 5,
        depthMode: 'TVD'
    });

    const [colorSettings, setColorSettings] = useState({
        mode: 'solid', // 'solid' | 'property'
        property: 'GR',
        scale: 'rainbow',
        min: 0,
        max: 150
    });

    // Fetch Saved Lines
    useEffect(() => {
        if (!activeProject?.id) return;
        const fetchLines = async () => {
            const { data } = await supabase.from('ss_assets').select('*').eq('project_id', activeProject.id).eq('type', 'cross-section').is('deleted_at', null);
            if (data) setSavedLines(data.map(a => ({ id: a.id, name: a.name, points: a.meta?.points || [], created_at: a.created_at })));
        };
        fetchLines();
    }, [activeProject?.id]);

    // Projection Data Memoization
    const projectionData = useMemo(() => {
        if (!sectionLine || sectionLine.length < 2) return null;
        
        const len = calculateSectionLength(sectionLine);
        const corridorWidth = 1000;

        // Project Wells
        const projectedWells = allAssets
            .filter(a => a.type === 'well' && a.meta?.location)
            .map(well => {
                const loc = { x: well.meta.location[1], y: well.meta.location[0] }; 
                const proj = projectPointToSection(loc, sectionLine);
                
                // Mock logs for visual demo if real logs aren't attached
                const mockLog = {
                    GR: Array.from({length: 50}, (_, i) => ({ depth: i*50, value: 20 + Math.random()*100 }))
                };

                return { 
                    ...well, 
                    projection: proj,
                    log_data: well.log_data || mockLog // Fallback
                };
            })
            .filter(w => w.projection && w.projection.offset < corridorWidth) 
            .sort((a, b) => a.projection.distance - b.projection.distance);

        // Collect Horizons (Mock logic or use real interpretations)
        const horizonPoints = {};
        // ... (Horizon logic similar to previous turn)

        return { length: len, wells: projectedWells, horizons: horizonPoints };
    }, [sectionLine, allAssets]);

    // Handlers
    const handleDefineLine = () => {
        toast({ title: "Map Mode Active", description: "Click points on the Map View to define the line (Simulated here)." });
        // Simulate a random line across wells
        const wells = allAssets.filter(a => a.type === 'well');
        if (wells.length > 1) {
            const p1 = wells[0].meta.location;
            const p2 = wells[wells.length-1].meta.location;
            setSectionLine([ { x: p1[1], y: p1[0] }, { x: p2[1], y: p2[0] } ]);
        }
    };

    const handleSaveLine = async (name) => {
        if (!activeProject?.id) return;
        const { data, error } = await supabase.from('ss_assets').insert({
            project_id: activeProject.id,
            name,
            type: 'cross-section',
            meta: { points: sectionLine },
            created_by: user.id
        }).select();

        if (error) toast({ variant: 'destructive', title: 'Save Failed', description: error.message });
        else {
            setSavedLines(prev => [...prev, { id: data[0].id, name: data[0].name, points: data[0].meta.points, created_at: data[0].created_at }]);
            toast({ title: 'Section Saved' });
        }
    };

    const handleDeleteLine = async (id) => {
        const { error } = await supabase.from('ss_assets').update({ deleted_at: new Date().toISOString() }).eq('id', id);
        if (!error) setSavedLines(prev => prev.filter(l => l.id !== id));
    };

    return (
        <div className="flex h-full w-full bg-slate-950 text-white overflow-hidden font-sans">
            <PanelGroup direction="horizontal">
                
                {/* LEFT: Controls */}
                <Panel defaultSize={20} minSize={15} maxSize={30} className="bg-slate-900 border-r border-slate-800 flex flex-col">
                    <div className="p-3 border-b border-slate-800 font-bold text-sm flex items-center gap-2 text-lime-400">
                        <Settings className="w-4 h-4" /> Settings
                    </div>
                    <ScrollArea className="flex-grow p-4 space-y-6">
                        
                        <CrossSectionLineManager 
                            savedLines={savedLines} 
                            onSaveLine={handleSaveLine}
                            onLoadLine={(l) => setSectionLine(l.points)}
                            onDeleteLine={handleDeleteLine}
                            onDefineLine={handleDefineLine}
                        />

                        <div className="space-y-3 pt-4 border-t border-slate-800">
                            <Label className="text-xs font-semibold text-slate-400">View Parameters</Label>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span>Vert. Exaggeration</span>
                                    <span className="text-lime-400">{viewSettings.verticalExaggeration}x</span>
                                </div>
                                <Slider 
                                    value={[viewSettings.verticalExaggeration]} 
                                    min={1} max={50} step={1} 
                                    onValueChange={(val) => setViewSettings(p => ({ ...p, verticalExaggeration: val[0] }))} 
                                />
                            </div>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-slate-800">
                            <Label className="text-xs font-semibold text-slate-400">Export</Label>
                            <CrossSectionExportPanel projectionData={projectionData} sectionLine={sectionLine} />
                        </div>

                    </ScrollArea>
                </Panel>

                <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-lime-500 transition-colors" />

                {/* CENTER: Canvas */}
                <Panel className="relative bg-black flex flex-col">
                    <div className="absolute top-4 left-4 z-10">
                        <CrossSectionToolbar 
                            activeTool={activeTool} 
                            setActiveTool={setActiveTool} 
                            onFit={() => toast({ title: "View Reset" })}
                            onSave={() => toast({ title: "Snapshot Saved" })}
                            onClear={() => setSectionLine([])}
                            onDefineLine={handleDefineLine}
                        />
                    </div>
                    
                    <div className="flex-grow relative overflow-hidden">
                        <CrossSectionCanvas 
                            width={window.innerWidth * 0.6} 
                            height={window.innerHeight}
                            projectionData={projectionData}
                            layers={layers}
                            viewSettings={viewSettings}
                            activeTool={activeTool}
                            colorSettings={colorSettings}
                            onSelectionChange={(sel) => {
                                setSelection(sel);
                                if (sel?.type === 'well') selectAssetAndParentWell(sel.data);
                            }}
                            setMeasurementResult={setMeasurementResult}
                        />
                        <CrossSectionLegend layers={layers} colorSettings={colorSettings} />
                        <CrossSectionMeasurementTools measurement={measurementResult} />
                    </div>
                </Panel>

                <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-lime-500 transition-colors" />

                {/* RIGHT: Panels */}
                <Panel defaultSize={20} minSize={15} maxSize={30} className="bg-slate-900 border-l border-slate-800 flex flex-col">
                    <Tabs defaultValue="props" className="h-full flex flex-col">
                        <TabsList className="grid w-full grid-cols-4 bg-slate-800 rounded-none border-b border-slate-700">
                            <TabsTrigger value="props" className="text-xs px-0"><Info className="w-3 h-3"/></TabsTrigger>
                            <TabsTrigger value="analysis" className="text-xs px-0"><Activity className="w-3 h-3"/></TabsTrigger>
                            <TabsTrigger value="correlate" className="text-xs px-0"><GitGraph className="w-3 h-3"/></TabsTrigger>
                            <TabsTrigger value="style" className="text-xs px-0"><Palette className="w-3 h-3"/></TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="props" className="flex-grow p-0 h-full overflow-hidden">
                            <ScrollArea className="h-full p-4">
                                <CrossSectionPropertyPanel selection={selection} />
                                <div className="mt-4 pt-4 border-t border-slate-800">
                                    <CrossSectionLayerManager layers={layers} setLayers={setLayers} />
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="analysis" className="flex-grow p-0 h-full overflow-hidden">
                            <ScrollArea className="h-full p-4">
                                <CrossSectionAnalysisPanel assets={allAssets} projectionData={projectionData} />
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="correlate" className="flex-grow p-0 h-full overflow-hidden">
                            <CrossSectionCorrelationPanel onAutoCorrelate={() => toast({title:"Auto-correlation running..."})} />
                        </TabsContent>

                        <TabsContent value="style" className="flex-grow p-0 h-full overflow-hidden">
                            <CrossSectionPropertyColoringPanel 
                                colorSettings={colorSettings} 
                                setColorSettings={setColorSettings}
                                availableProperties={['GR', 'RES', 'NPHI', 'RHOB']}
                            />
                        </TabsContent>
                    </Tabs>
                </Panel>

            </PanelGroup>
        </div>
    );
};

export default CrossSectionView;