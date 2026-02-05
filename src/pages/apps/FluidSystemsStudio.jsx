import React, { useState, useEffect } from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { Link, useSearchParams } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useReservoir } from '@/contexts/ReservoirContext';
    import { ArrowLeft, FlaskConical, Play, Loader2, Save, FolderKanban, AlertTriangle } from 'lucide-react';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
    import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import FluidStudioInput from '@/components/fluidstudio/FluidStudioInput';
    import FluidStudioResults from '@/components/fluidstudio/FluidStudioResults';
    import FluidStudioEmptyState from '@/components/fluidstudio/FluidStudioEmptyState';

    const samplePreset = {
      streamA: {
        blackOil: { api: 32, gor: 650, gasSg: 0.75, temp: 190, pb: 2100, salinity: 35000 },
        composition: { model: 'pr', raw: "N2, 0.5\nCO2, 1.5\nC1, 35.0\nC2, 8.0\nC3, 5.0\niC4, 2.0\nnC4, 3.0\niC5, 1.5\nnC5, 2.5\nC6, 4.0\nC7+, 37.0" },
      },
      streamB: {
        blackOil: { api: 22, gor: 200, gasSg: 0.85, temp: 150, pb: 1500, salinity: 10000 },
        composition: { model: 'pr', raw: "" },
      },
      blending: {
        enabled: false,
        streamB_fraction: 50,
      },
      batchRun: {
        enabled: false,
        variable: 'api',
        min: 20,
        max: 40,
        steps: 5,
      },
      separatorTrain: { stages: [ { pressure: 450, temperature: 120, enabled: true }, { pressure: 200, temperature: 100, enabled: true }, { pressure: 14.7, temperature: 60, enabled: false } ] },
      flowAssurance: { flowline: { length: 2500, diameter: 3, outletPressure: 200, ambientTemp: 85 }, inhibitors: [] },
      ptProfile: { raw: "3000, 180\n2500, 165\n2000, 140\n1500, 110\n1000, 80\n500, 50" },
    };

    const SaveProjectModal = ({ open, onOpenChange, inputs, results, reservoirId }) => {
        const [projectName, setProjectName] = useState('');
        const { toast } = useToast();
        const { user } = useAuth();

        const handleSave = async () => {
            if (!projectName) {
                toast({ variant: "destructive", title: "Project name is required." });
                return;
            }
            try {
                const { error } = await supabase.functions.invoke('fluid-studio-engine', {
                    body: { action: 'save_project', payload: { userId: user.id, reservoirId, projectName, inputs, results } }
                });
                if (error) throw error;
                toast({ title: "Project Saved!", description: `"${projectName}" has been saved.` });
                onOpenChange(false);
                setProjectName('');
            } catch (error) {
                toast({ variant: "destructive", title: "Save Failed", description: error.message });
            }
        };

        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px] bg-slate-900 text-white border-slate-700">
                    <DialogHeader><DialogTitle>Save Project</DialogTitle><DialogDescription>Enter a name for your project.</DialogDescription></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Label htmlFor="name" className="text-right">Project Name</Label>
                        <Input id="name" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="col-span-3 bg-slate-700 border-slate-600" />
                    </div>
                    <DialogFooter><Button onClick={handleSave} className="bg-lime-600 hover:bg-lime-700">Save Project</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        );
    };

    const LoadProjectsDrawer = ({ open, onOpenChange, onSelectProject }) => {
        const [projects, setProjects] = useState([]);
        const [loading, setLoading] = useState(false);
        const { toast } = useToast();
        const { user } = useAuth();

        useEffect(() => {
            if (open && user) {
                const fetchProjects = async () => {
                    setLoading(true);
                    try {
                        const { data, error } = await supabase.functions.invoke('fluid-studio-engine', { body: { action: 'load_projects', payload: { userId: user.id } } });
                        if (error) throw error;
                        setProjects(data);
                    } catch (error) {
                        toast({ variant: "destructive", title: "Failed to load projects", description: error.message });
                    } finally {
                        setLoading(false);
                    }
                };
                fetchProjects();
            }
        }, [open, user, toast]);

        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="bg-slate-900 text-white border-slate-700">
                    <DrawerHeader><DrawerTitle>Load Project</DrawerTitle><DrawerDescription>Select a saved project to load its data.</DrawerDescription></DrawerHeader>
                    <div className="p-4">
                        {loading ? <p>Loading...</p> : projects.length > 0 ? (
                            <div className="space-y-2">
                                {projects.map((p) => (
                                    <div key={p.id} className="flex items-center justify-between p-2 rounded-md bg-slate-800 hover:bg-slate-700">
                                        <div>
                                            <p className="font-semibold">{p.project_name}</p>
                                            <p className="text-sm text-lime-300">Saved: {new Date(p.created_at).toLocaleString()}</p>
                                        </div>
                                        <Button size="sm" onClick={() => { onSelectProject(p); onOpenChange(false); }}>Load</Button>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="text-center">No saved projects found.</p>}
                    </div>
                </DrawerContent>
            </Drawer>
        );
    };

    const FluidSystemsStudio = () => {
      const [results, setResults] = useState(null);
      const [loading, setLoading] = useState(false);
      const [inputs, setInputs] = useState(samplePreset);
      const { toast } = useToast();
      const { user } = useAuth();
      const { reservoir, setReservoir, isReady } = useReservoir();
      const [searchParams] = useSearchParams();
      const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
      const [isLoadDrawerOpen, setIsLoadDrawerOpen] = useState(false);

      useEffect(() => {
        const reservoirId = searchParams.get('reservoir_id');
        if (reservoirId && !reservoir?.id) {
          setReservoir({ id: reservoirId, name: 'Loading...' });
        }
      }, [searchParams, reservoir, setReservoir]);

      const handleCalculate = async () => {
        setLoading(true);
        setResults(null);
        const action = inputs.batchRun.enabled ? 'run_batch_analysis' : 'run_analysis';
        try {
          const { data, error } = await supabase.functions.invoke('fluid-studio-engine', { body: { action, payload: inputs } });
          if (error) throw new Error(`Edge Function Error: ${error.message}`);
          if (data.error) throw new Error(data.error);
          setResults(data);
          toast({ title: "Analysis Complete!", description: `Fluid system properties have been successfully calculated. ${inputs.batchRun.enabled ? `(${data.batchSummary.length} runs)` : ''}` });
        } catch (error) {
          setResults(null);
          toast({ variant: "destructive", title: "Analysis Failed", description: error.message, duration: 9000 });
        } finally {
          setLoading(false);
        }
      };

      const handleSaveProject = () => {
        if (!results) {
            toast({ variant: "destructive", title: "No results to save", description: "Please run an analysis first." });
            return;
        }
        setIsSaveModalOpen(true);
      };

      const handleLoadProject = (project) => {
        setInputs(project.inputs);
        setResults(project.results);
        toast({ title: "Project Loaded", description: `"${project.project_name}" has been loaded.` });
      };

      const handleRunSample = () => {
        setInputs(samplePreset);
        toast({ title: "Sample Loaded", description: "Sample data has been loaded into the form." });
      };

      const getButtonText = () => {
        if (inputs.batchRun.enabled) {
            return results ? 'Re-run Batch' : 'Run Batch Analysis';
        }
        return results ? 'Re-run Analysis' : 'Run Analysis';
      };

      return (
        <>
          <Helmet>
            <title>Fluid Systems Studio - Petrolord Suite</title>
            <meta name="description" content="Advanced PVT, flow assurance, and separator modeling from reservoir to stock tank." />
          </Helmet>
          <div className="flex flex-col h-screen bg-gray-900 text-white">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-4 md:p-6 border-b border-white/10 bg-black/20 backdrop-blur-lg">
              <div className="flex items-center justify-between space-x-4 mb-4">
                <Link to="/dashboard/reservoir"><Button variant="outline" size="sm" className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20"><ArrowLeft className="w-4 h-4 mr-2" />Back to Reservoir</Button></Link>
                <div className="flex items-center space-x-2">
                  <Button onClick={() => setIsLoadDrawerOpen(true)} variant="outline" className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20"><FolderKanban className="w-4 h-4 mr-2" />Load</Button>
                  <Button onClick={handleSaveProject} variant="outline" className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20"><Save className="w-4 h-4 mr-2" />Save</Button>
                </div>
              </div>
              <div className="flex items-start md:items-center space-x-4">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-3 rounded-xl mt-1"><FlaskConical className="w-6 h-6 text-white" /></div>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold text-white">Fluid Systems & Flow Behavior Studio</h1>
                  <p className="text-cyan-200 text-sm md:text-md">{reservoir?.id ? `For Reservoir: ${reservoir.name}` : "No reservoir selected"}</p>
                </div>
              </div>
            </motion.div>
            <div className="flex-grow flex overflow-hidden">
              <div className="w-full md:w-1/3 xl:w-1/4 p-6 bg-slate-900/50 backdrop-blur-lg border-r border-white/10 flex flex-col">
                {!isReady ? (
                  <div className="flex items-center justify-center h-full"><Loader2 className="h-12 w-12 animate-spin text-lime-400" /></div>
                ) : (
                  <>
                    <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                      {!reservoir?.id && (
                        <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-200 p-4 rounded-lg mb-6 flex items-center gap-4 text-center">
                          <AlertTriangle className="w-8 h-8" />
                          <span className="font-semibold">Select a reservoir to save your work.</span>
                        </div>
                      )}
                      <FluidStudioInput inputs={inputs} setInputs={setInputs} />
                    </div>
                    <div className="pt-4 mt-auto flex-shrink-0">
                      <Button onClick={handleCalculate} disabled={loading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-3 text-lg">
                        {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Play className="w-5 h-5 mr-2" />}
                        {getButtonText()}
                      </Button>
                    </div>
                  </>
                )}
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                {!results && !loading && (<FluidStudioEmptyState onRunSample={handleRunSample} />)}
                {loading && (<div className="flex items-center justify-center h-full"><div className="text-center"><Loader2 className="h-16 w-16 animate-spin text-cyan-400 mx-auto" /><p className="text-white mt-4 text-lg">Running Advanced Fluid Simulation...</p><p className="text-cyan-300">Please wait while the AI engine processes your request.</p></div></div>)}
                {results && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}><FluidStudioResults results={results} batchRunSettings={inputs.batchRun} inputs={inputs} /></motion.div>)}
              </div>
            </div>
            <SaveProjectModal open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen} inputs={inputs} results={results} reservoirId={reservoir?.id} />
            <LoadProjectsDrawer open={isLoadDrawerOpen} onOpenChange={setIsLoadDrawerOpen} onSelectProject={handleLoadProject} />
          </div>
        </>
      );
    };

    export default FluidSystemsStudio;