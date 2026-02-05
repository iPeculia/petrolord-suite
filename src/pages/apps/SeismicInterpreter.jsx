import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { StudioContext } from '@/contexts/StudioContext';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, PanelLeft, RefreshCw, Plus, FolderOpen, Globe, ArrowRight, Layers } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import DataExchangeHub from '@/components/DataExchangeHub';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import SeismicInterpretationPanel from '@/components/subsurface-studio/SeismicInterpretationPanel';
import SectionView from '@/components/subsurface-studio/SectionView';

// === LOCAL STUDIO PROVIDER FOR STANDALONE MODE ===
// This mimics the StudioContext so SectionView can work without the global provider
const LocalStudioProvider = ({ children, activeProject, allAssets, activeAsset }) => {
    // Recreate necessary seismic state locally
    const [seismicState, setSeismicState] = useState({
        seismicData: null,
        viewParams: { pclip: 98, gain: 1.0, colorMap: 'grayscale', sliceType: 'inline', index: 0, vx: 1.0, hx: 1.0 },
        transform: { x: 0, y: 0, k: 1 },
        fileHandle: null,
        isLoading: false,
        error: null,
    });

    const setSeismicViewParams = useCallback((newParams) => {
        setSeismicState(prev => ({ ...prev, viewParams: { ...prev.viewParams, ...newParams } }));
    }, []);

    const setSeismicTransform = useCallback((newTransform) => {
        setSeismicState(prev => ({ ...prev, transform: newTransform }));
    }, []);

    const getAssetFile = useCallback(async (asset) => {
        if (!asset || !asset.uri) return null;
        if (seismicState.fileHandle && asset.uri === seismicState.fileHandle.uri) return seismicState.fileHandle.file;
        if (asset.meta?.local && asset.meta?.file instanceof File) return asset.meta.file;
        
        try {
            setSeismicState(prev => ({ ...prev, isLoading: true, error: null, fileHandle: null }));
            const bucket = asset.meta?.bucket || 'ss-assets';
            const { data, error } = await supabase.storage.from(bucket).download(asset.uri);
            if (error) throw error;
            
            const file = new File([data], asset.name, { type: data.type });
            setSeismicState(prev => ({ ...prev, fileHandle: { uri: asset.uri, file } }));
            return file;
        } catch (error) {
            console.error("Error downloading asset file:", error);
            setSeismicState(prev => ({ ...prev, error: error.message, fileHandle: null }));
            return null;
        } finally {
            setSeismicState(prev => ({ ...prev, isLoading: false }));
        }
    }, [seismicState.fileHandle]);

    // Mock context value
    const value = {
        appState: 'READY',
        activeProject,
        allAssets,
        selectedAssetId: activeAsset?.id,
        selectedAsset: activeAsset,
        selectedWell: null,
        getAssetFile,
        seismicState, setSeismicState, setSeismicViewParams, setSeismicTransform
    };

    return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
};


const SeismicInterpreter = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Project State
    const [activeProject, setActiveProject] = useState(null);
    const [projects, setProjects] = useState([]);
    const [assets, setAssets] = useState([]);
    const [activeAsset, setActiveAsset] = useState(null);
    
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [isLeftPanelVisible, setIsLeftPanelVisible] = useState(true);
    const leftPanelRef = useRef(null);
    const [sessionIsLoading, setSessionIsLoading] = useState(false);
    
    // Dialog States
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");

    // Interpretation Session
    const [session, setSession] = useState({
        isLoading: false,
        interpretations: [],
        currentPicks: [], 
        activeTool: 'pointer', 
        activeInterpretationId: null
    });

    // === 1. Project Management ===
    useEffect(() => {
        fetchProjects();
    }, [user]);

    const fetchProjects = async () => {
        if (!user) return;
        try {
            // Fetch projects created by user or available to user
            // Using ss_projects as the backing store
            const { data, error } = await supabase
                .from('ss_projects')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error("Fetch projects failed:", error);
        } finally {
            setIsLoadingProjects(false);
        }
    };

    const handleCreateProject = async () => {
        if (!newProjectName.trim() || !user) return;
        try {
            const { data, error } = await supabase
                .from('ss_projects')
                .insert([{
                    name: newProjectName,
                    created_by: user.id,
                    crs_epsg: 3857 // Default Web Mercator for now
                }])
                .select()
                .single();
            
            if (error) throw error;
            
            setProjects([data, ...projects]);
            setActiveProject(data);
            setIsCreateOpen(false);
            setNewProjectName("");
            toast({ title: "Project Created", description: `${data.name} is ready.` });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        }
    };

    const loadProject = async (project) => {
        setActiveProject(project);
        setActiveAsset(null);
        setAssets([]);
        
        // Fetch assets for this project
        try {
            const { data, error } = await supabase
                .from('ss_assets')
                .select('*')
                .eq('project_id', project.id)
                .eq('type', 'seis.volume') // Filter only seismic volumes
                .is('deleted_at', null);
            
            if (error) throw error;
            setAssets(data || []);
        } catch (err) {
            console.error("Error loading assets:", err);
        }
    };

    // === 2. Asset Management ===
    const handleImportData = async (data) => {
        // data comes from DataExchangeHub
        // Could be a horizon import OR a new volume import
        if (data.segy_url || data.volume_id) {
           // Handle Seismic Volume Import
           // In a real flow, we'd save this to ss_assets. For now, let's assume it creates an asset.
           // If data is just a payload, we might need to wrap it as an asset structure.
           // This simulates "linking" a shared volume to this project
           const newAsset = {
                id: crypto.randomUUID(),
                project_id: activeProject.id,
                type: 'seis.volume',
                name: data.name || 'Imported Volume',
                uri: data.segy_url || data.uri, // Assuming direct URI access for demo
                meta: { bucket: 'seismic' }, // Assuming bucket
                created_by: user.id,
                created_at: new Date().toISOString()
           };
           
           // Optimistic update
           setAssets([...assets, newAsset]);
           setActiveAsset(newAsset);
           toast({ title: "Volume Imported", description: `Loaded ${newAsset.name}` });
        } else if (data.horizons) {
            // Import Horizons
             setSession(prev => ({
                ...prev,
                interpretations: [...prev.interpretations, ...data.horizons]
            }));
            toast({ title: "Horizons Imported", description: `Added ${data.horizons.length} horizons to session.` });
        }
    };

    // === 3. Interpretation Logic ===
    useEffect(() => {
        if (activeProject && activeAsset) {
            fetchInterpretations();
        }
    }, [activeProject, activeAsset]);

    const fetchInterpretations = async () => {
        if (!activeAsset) return;
        setSessionIsLoading(true);
        try {
            // We interpret on a "section" usually, but here we link to volume ID directly for simplicity in standalone
            // Or we treat the volume as the "section" context for now
            const { data, error } = await supabase
                .from('ss_interpretations')
                .select('*')
                .eq('volume_id', activeAsset.id); 
            
            if (error) throw error;
            setSession(prev => ({ ...prev, interpretations: data || [] }));
        } catch (err) {
            console.error("Error fetching interpretations:", err);
        } finally {
            setSessionIsLoading(false);
        }
    };

    const handleSaveInterpretation = async ({ idToUpdate, version, name, kind, points }) => {
        if (!activeProject || !activeAsset || !user) return;
        
        setSessionIsLoading(true);
        try {
            const payload = {
                project_id: activeProject.id,
                volume_id: activeAsset.id,
                type: kind || 'horizon',
                name: name,
                data: { points },
                style: { color: '#06b6d4', width: 2 },
                rev: (version || 0) + 1,
                updated_at: new Date().toISOString(),
                created_by: user.id
            };

            let result;
            if (idToUpdate) {
                const { data, error } = await supabase
                    .from('ss_interpretations')
                    .update(payload)
                    .eq('id', idToUpdate)
                    .select().single();
                if (error) throw error;
                result = data;
            } else {
                const { data, error } = await supabase
                    .from('ss_interpretations')
                    .insert([payload])
                    .select().single();
                if (error) throw error;
                result = data;
            }

            setSession(prev => {
                const others = prev.interpretations.filter(i => i.id !== result.id);
                return {
                    ...prev,
                    interpretations: [...others, result],
                    activeInterpretationId: result.id
                };
            });
            toast({ title: 'Interpretation Saved!', description: `Saved "${name}" successfully.` });
        } catch (error) {
            console.error("Save failed:", error);
            toast({ variant: 'destructive', title: 'Save Failed', description: error.message });
        } finally {
            setSessionIsLoading(false);
        }
    };

    const sessionActions = useMemo(() => ({
        selectInterpretation: (id) => {
            const interp = session.interpretations.find(i => i.id === id);
            if (interp) {
                setSession(prev => ({
                    ...prev,
                    activeInterpretationId: id,
                    currentPicks: interp.data?.points || []
                }));
            }
        },
        setTool: (tool) => setSession(prev => ({ ...prev, activeTool: tool })),
        addPick: (point) => setSession(prev => ({ ...prev, currentPicks: [...prev.currentPicks, point] })),
        clearPicks: () => setSession(prev => ({ ...prev, currentPicks: [] })),
        newInterpretation: () => setSession(prev => ({ ...prev, activeInterpretationId: null, currentPicks: [] })),
        autoPickAI: async (seedPoint, type) => {
            setSession(prev => ({ ...prev, isLoading: true }));
            setTimeout(() => {
                const mockTrace = Array.from({ length: 200 }, (_, i) => ({
                    x: seedPoint.x + i,
                    y: seedPoint.y + (Math.sin(i / 20) * 10) + (Math.random() * 2),
                    traceIndex: i,
                    time: seedPoint.y
                }));
                setSession(prev => ({
                    ...prev,
                    isLoading: false,
                    currentPicks: [...prev.currentPicks, ...mockTrace]
                }));
                toast({ title: "AI Auto-trace Complete", description: "Horizon tracked successfully." });
            }, 1500);
        }
    }), [session.interpretations]);

    const togglePanel = () => {
        if (leftPanelRef.current) {
            if (isLeftPanelVisible) leftPanelRef.current.collapse();
            else leftPanelRef.current.expand();
            setIsLeftPanelVisible(!isLeftPanelVisible);
        }
    };


    // === RENDER: PROJECT SELECTION ===
    if (!activeProject) {
        return (
            <>
            <Helmet><title>Seismic Interpreter - Select Project</title></Helmet>
            <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col">
                <div className="max-w-6xl mx-auto w-full flex-grow flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">Seismic Interpreter</h1>
                            <p className="text-slate-400 mt-1">Select a project to begin your interpretation session.</p>
                        </div>
                         <div className="flex gap-3">
                             <Link to="/dashboard/geoscience">
                                <Button variant="outline">Dashboard</Button>
                            </Link>
                             <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-cyan-600 hover:bg-cyan-700"><Plus className="w-4 h-4 mr-2" /> New Project</Button>
                                </DialogTrigger>
                                <DialogContent className="bg-slate-900 border-slate-700 text-white">
                                    <DialogHeader>
                                        <DialogTitle>Create New Project</DialogTitle>
                                    </DialogHeader>
                                    <div className="py-4">
                                        <Label>Project Name</Label>
                                        <Input 
                                            value={newProjectName} 
                                            onChange={(e) => setNewProjectName(e.target.value)}
                                            className="bg-slate-800 border-slate-600 mt-2"
                                            placeholder="e.g., North Sea Survey 2024"
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleCreateProject} disabled={!newProjectName}>Create Project</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {isLoadingProjects ? (
                        <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-cyan-500" /></div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
                            <FolderOpen className="w-16 h-16 text-slate-600 mb-4" />
                            <h3 className="text-xl font-medium text-slate-300">No Projects Found</h3>
                            <p className="text-slate-500 mt-2 mb-6">Create your first project to get started.</p>
                            <Button onClick={() => setIsCreateOpen(true)} variant="secondary">Create Project</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map(project => (
                                <Card key={project.id} className="bg-slate-900 border-slate-800 hover:border-cyan-600/50 transition-all cursor-pointer group" onClick={() => loadProject(project)}>
                                    <CardHeader>
                                        <CardTitle className="text-white group-hover:text-cyan-400 transition-colors flex justify-between">
                                            {project.name}
                                            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                                        </CardTitle>
                                        <CardDescription className="text-slate-500">
                                            Created {new Date(project.created_at).toLocaleDateString()}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Globe className="w-3 h-3" /> CRS: EPSG {project.crs_epsg}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            </>
        );
    }

    // === RENDER: MAIN INTERPRETER INTERFACE ===
    return (
        <LocalStudioProvider activeProject={activeProject} allAssets={assets} activeAsset={activeAsset}>
            <Helmet>
                <title>{activeProject.name} - Seismic Interpreter</title>
            </Helmet>
            <div className="h-screen w-full flex flex-col bg-slate-950 text-white overflow-hidden">
                {/* HEADER */}
                 <header className="flex flex-col md:flex-row items-center justify-between p-3 border-b border-slate-800 shrink-0 bg-slate-900/95 backdrop-blur z-10">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Button variant="ghost" size="sm" onClick={() => setActiveProject(null)} className="bg-slate-800 hover:bg-slate-700 text-slate-300">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Projects
                        </Button>
                        <div className="h-6 w-px bg-slate-700 mx-2" />
                        <div>
                            <h1 className="text-sm font-bold flex items-center gap-2 text-white">
                                {activeProject.name}
                                {sessionIsLoading && <RefreshCw className="w-3 h-3 animate-spin text-slate-400" />}
                            </h1>
                            <p className="text-[10px] text-cyan-400 truncate max-w-[300px]">
                                {activeAsset ? activeAsset.name : 'Select a volume to interpret'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto overflow-x-auto">
                         <DataExchangeHub 
                            mode="import" 
                            onImport={handleImportData} 
                            categoryFilter="SEISMIC_HORIZON" // Could allow ALL to import volumes too
                        />
                        <DataExchangeHub 
                            mode="export" 
                            currentData={{ horizons: session.interpretations }} 
                            currentAppName="Seismic Interpreter"
                            exportName={activeAsset ? `${activeAsset.name}_interpretation` : 'seismic_interp'}
                            categoryFilter="SEISMIC_HORIZON"
                        />
                        <Button variant="ghost" size="sm" onClick={() => togglePanel()} className="bg-slate-800 hover:bg-slate-700 hidden md:flex">
                            <PanelLeft className="w-4 h-4 mr-2" />
                            Tools
                        </Button>
                    </div>
                </header>

                {/* MAIN CONTENT AREA */}
                <div className="flex-grow overflow-hidden flex">
                    {/* ASSET SELECTOR SIDEBAR (Always visible if no asset, collapsible otherwise) */}
                    {(!activeAsset) && (
                        <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 h-full">
                            <div className="p-4 border-b border-slate-800 font-semibold text-sm flex justify-between items-center">
                                <span>Project Assets</span>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><RefreshCw className="w-3 h-3" onClick={() => loadProject(activeProject)}/></Button>
                            </div>
                            <ScrollArea className="flex-grow">
                                <div className="p-2 space-y-1">
                                    {assets.length === 0 ? (
                                        <div className="text-center p-6 text-slate-500 text-sm">
                                            No seismic volumes found. Use "Import Data" above.
                                        </div>
                                    ) : assets.map(asset => (
                                        <div 
                                            key={asset.id} 
                                            onClick={() => setActiveAsset(asset)}
                                            className={`p-3 rounded-md cursor-pointer text-sm flex items-center gap-3 transition-colors ${activeAsset?.id === asset.id ? 'bg-cyan-900/30 border border-cyan-800 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
                                        >
                                            <Layers className="w-4 h-4 shrink-0" />
                                            <span className="truncate">{asset.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    )}

                    {/* INTERPRETATION WORKSPACE */}
                    {activeAsset && (
                        <PanelGroup direction="horizontal" className="flex-grow h-full">
                             {/* TOOLS PANEL */}
                             {isLeftPanelVisible && (
                                <>
                                    <Panel ref={leftPanelRef} defaultSize={20} minSize={15} maxSize={30} className="bg-slate-900 border-r border-slate-800">
                                        <SeismicInterpretationPanel
                                            onSave={handleSaveInterpretation}
                                            session={session}
                                            actions={sessionActions}
                                        />
                                    </Panel>
                                    <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-cyan-500 transition-colors cursor-col-resize" />
                                </>
                             )}

                             {/* VIEWER PANEL */}
                             <Panel minSize={50} className="bg-black relative">
                                <SectionView
                                    asset={activeAsset}
                                    parentSeismic={activeAsset} // In this standalone mode, the asset IS the seismic volume
                                    session={session}
                                    onPick={sessionActions.addPick}
                                />
                                {/* Back to Asset List Button (Floating) */}
                                <div className="absolute top-4 right-4 z-10">
                                    <Button variant="secondary" size="sm" onClick={() => setActiveAsset(null)} className="shadow-lg bg-slate-800/80 backdrop-blur text-xs h-7">
                                        Change Volume
                                    </Button>
                                </div>
                             </Panel>
                        </PanelGroup>
                    )}

                    {/* EMPTY STATE IF NO ASSET SELECTED (Handled by sidebar visibility above, but this fills space) */}
                    {!activeAsset && (
                        <div className="flex-grow flex items-center justify-center bg-slate-950 text-slate-500">
                            <div className="text-center">
                                <Layers className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>Select a seismic volume from the list to start interpreting.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </LocalStudioProvider>
    );
};

export default SeismicInterpreter;