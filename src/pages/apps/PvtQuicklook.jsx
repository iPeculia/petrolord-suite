import React, { useState, useEffect, useCallback } from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { Link, useLocation, useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { supabase } from '@/lib/customSupabaseClient';
    import InputPanel from '@/components/pvtquicklook/InputPanel';
    import ResultsPanel from '@/components/pvtquicklook/ResultsPanel';
    import EmptyState from '@/components/pvtquicklook/EmptyState';
    import { ArrowLeft, Beaker, AlertTriangle, Plus, Library, Save } from 'lucide-react';
    import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { useReservoir } from '@/contexts/ReservoirContext';

    const NewReservoirModal = ({ onReservoirCreated, onOpenChange, open, triggerButton }) => {
      const [formData, setFormData] = useState({ name: '', basin: '', field: '', country: '', operator: '', fluid: 'oil', drive: 'solution_gas', unit_system: 'FIELD' });
      const { toast } = useToast();
      const handleSubmit = async () => {
        try {
          const { data, error } = await supabase.functions.invoke('reservoir-engine', {
            body: { action: 'create', payload: formData },
          });
          if (error) throw new Error(error.message);
          if (data.error) throw new Error(data.error);
          toast({ title: "Success!", description: "Reservoir created." });
          onReservoirCreated({ id: data.id, name: data.name });
          onOpenChange(false);
        } catch (err) {
          toast({ title: "Error", description: err.message, variant: "destructive" });
        }
      };
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>{triggerButton}</DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-slate-900 text-white border-slate-700">
            <DialogHeader><DialogTitle>Create New Reservoir</DialogTitle><DialogDescription>Enter minimal details for a new reservoir.</DialogDescription></DialogHeader>
            <div className="grid gap-4 py-4">
              {Object.keys(formData).map(key => (
                <div className="grid grid-cols-4 items-center gap-4" key={key}><Label htmlFor={key} className="text-right capitalize">{key.replace('_', ' ')}</Label><Input id={key} name={key} value={formData[key]} onChange={e => setFormData({...formData, [e.target.name]: e.target.value})} className="col-span-3 bg-slate-800 border-slate-600" /></div>
              ))}
            </div>
            <DialogFooter><Button onClick={handleSubmit} className="bg-lime-600 hover:bg-lime-700">Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

    const SelectReservoirDrawer = ({ onSelectReservoir, onReservoirCreated }) => {
        const [open, setOpen] = useState(false);
        const [reservoirs, setReservoirs] = useState([]);
        const [isLoading, setIsLoading] = useState(false);
        const [isNewReservoirModalOpen, setIsNewReservoirModalOpen] = useState(false);
        const { toast } = useToast();
        const fetchReservoirs = useCallback(async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase.functions.invoke('reservoir-engine', { body: { action: 'list' } });
                if (error) throw error;
                if (data.error) throw new Error(data.error);
                setReservoirs(data);
            } catch (error) {
                toast({ title: "Error", description: error.message, variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        }, [toast]);
        useEffect(() => { if (open) fetchReservoirs(); }, [open, fetchReservoirs]);
        const handleSelect = (reservoir) => { onSelectReservoir(reservoir); setOpen(false); };
        const handleReservoirCreatedAndSelect = (newReservoir) => {
            onReservoirCreated(newReservoir);
            setIsNewReservoirModalOpen(false);
            setOpen(false);
        };
        return (
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild><Button variant="outline"><Library className="w-4 h-4 mr-2" />Select Reservoir</Button></DrawerTrigger>
                <DrawerContent className="bg-slate-900 text-white border-slate-700"><DrawerHeader><DrawerTitle>My Reservoirs</DrawerTitle><DrawerDescription>Select a reservoir to load its data.</DrawerDescription></DrawerHeader>
                    <div className="p-4">{isLoading ? <p>Loading...</p> : reservoirs.length > 0 ? <div className="space-y-2">{reservoirs.map((r) => (<div key={r.id} className="flex items-center justify-between p-2 rounded-md bg-slate-800 hover:bg-slate-700"><div><p className="font-semibold">{r.name}</p><p className="text-sm text-lime-300">{r.field} ({r.basin})</p></div><Button size="sm" onClick={() => handleSelect(r)}>Select</Button></div>))}</div> : <div className="text-center space-y-4"><p>You have no reservoirs yet.</p></div>}
                    <div className="mt-4 flex justify-center">
                        <NewReservoirModal onReservoirCreated={handleReservoirCreatedAndSelect} open={isNewReservoirModalOpen} onOpenChange={setIsNewReservoirModalOpen} triggerButton={<Button><Plus className="w-4 h-4 mr-2" />Create New Reservoir</Button>} />
                    </div>
                    </div>
                </DrawerContent>
            </Drawer>
        );
    };

    const PvtQuicklook = () => {
      const [results, setResults] = useState(null);
      const [loading, setLoading] = useState(false);
      const [currentInputs, setCurrentInputs] = useState(null);
      const [initialInputs, setInitialInputs] = useState(null);
      const { toast } = useToast();
      const { user } = useAuth();
      const { reservoir, setReservoir, isReady } = useReservoir();
      const [isNewReservoirModalOpen, setIsNewReservoirModalOpen] = useState(false);
      const location = useLocation();
      const navigate = useNavigate();

      useEffect(() => {
        if (location.state?.loadedProject) {
          const { inputs_data, results_data, reservoir_id } = location.state.loadedProject;
          setInitialInputs(inputs_data);
          setCurrentInputs(inputs_data);
          setResults(results_data);
          if (reservoir_id) {
            navigate(`${location.pathname}?reservoir_id=${reservoir_id}`, { replace: true });
          }
          toast({ title: "Project Loaded", description: `Successfully loaded "${location.state.loadedProject.project_name}".` });
        }
      }, [location.state, toast, navigate, location.pathname]);

      const handleCalculate = async (inputs) => {
        setLoading(true);
        setResults(null);
        setCurrentInputs(inputs);

        try {
          const { data, error } = await supabase.functions.invoke('pvt-engine', {
            body: { action: 'run_correlations', payload: inputs }
          });

          if (error) throw new Error(`Edge Function Error: ${error.message}`);
          if (data.error) throw new Error(data.error);
          
          setResults(data);
          toast({ title: "Calculation Complete!", description: "Live PVT properties have been successfully calculated." });
        } catch (error) {
          setResults(null);
          toast({ variant: "destructive", title: "Calculation Failed", description: error.message, duration: 9000 });
        } finally {
          setLoading(false);
        }
      };

      const handleSaveProject = async () => {
        if (!user) { toast({ variant: "destructive", title: "You must be logged in to save." }); return; }
        if (!results || !currentInputs) { toast({ variant: "destructive", title: "No results to save." }); return; }
        if (!reservoir?.id) { toast({ variant: "destructive", title: "Select or create a reservoir to save this run." }); return; }

        const projectName = prompt("Please enter a name for your project:", "My PVT Analysis");
        if (!projectName) return;
        
        const projectData = {
          user_id: user.id,
          project_name: projectName,
          inputs_data: currentInputs,
          results_data: results,
          reservoir_id: reservoir.id,
        };

        const { error } = await supabase.from('saved_pvt_projects').insert([projectData]);
        if (error) toast({ variant: "destructive", title: "Failed to save project", description: error.message });
        else toast({ title: "Project Saved!", description: `"${projectName}" has been saved successfully.` });
      };

      const handleRunSample = () => {
        const sampleInputs = {
          setup: { pmin_psi: 100, pmax_psi: 5000, npoints: 20 },
          oil: {
            api: 35,
            gas_sg: 0.75,
            temp_F: 200,
            rsb_scf_stb: 800,
            pb_psia: null,
            co_above_pb_per_psi: 1.5e-5,
            corr_pb: "STANDING",
          },
          gas: { gas_sg: null, temp_F: null, corr_z: "PAPAY" },
          water: { salinity_ppm: 30000, cw_per_psi: 3e-6, muw_cP_approx: 0.8 },
        };
        setInitialInputs(sampleInputs);
        setCurrentInputs(sampleInputs);
        toast({ title: "Sample Loaded", description: "Sample data has been loaded into the form." });
      };

      return (
        <>
          <Helmet><title>PVT QuickLook - Petrolord Suite</title><meta name="description" content="Rapid and comprehensive analysis of reservoir fluid properties using a live backend and industry-standard PVT correlations." /></Helmet>
          <div className="flex flex-col h-screen bg-gray-900 text-white">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-4 md:p-6 border-b border-white/10 bg-black/20 backdrop-blur-lg">
               <div className="flex items-center justify-between space-x-4 mb-4">
                 <Link to="/dashboard/reservoir"><Button variant="outline" size="sm" className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20"><ArrowLeft className="w-4 h-4 mr-2" />Back to Reservoir</Button></Link>
                 <Button onClick={handleSaveProject} variant="outline" className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20"><Save className="w-4 h-4 mr-2" />Save</Button>
               </div>
              <div className="flex items-start md:items-center space-x-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl mt-1"><Beaker className="w-6 h-6 text-white" /></div>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold text-white">PVT QuickLook</h1>
                  <p className="text-lime-200 text-sm md:text-md">{reservoir?.id ? `For Reservoir: ${reservoir.name}` : "No reservoir selected"}</p>
                </div>
              </div>
            </motion.div>
            <div className="flex-grow flex overflow-hidden">
              <div className="w-full md:w-1/3 xl:w-1/4 p-6 bg-slate-900/50 backdrop-blur-lg border-r border-white/10 overflow-y-auto">
                {!isReady ? (
                    <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400"></div></div>
                ) : (
                  <>
                    {!reservoir?.id && (
                      <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-200 p-4 rounded-lg mb-6 flex flex-col items-center justify-center gap-4 text-center">
                        <AlertTriangle className="w-8 h-8" />
                        <span className="font-semibold">No Reservoir Selected</span>
                        <p className="text-sm">Select or create a reservoir to save your analysis.</p>
                        <div className="flex gap-2">
                            <SelectReservoirDrawer onSelectReservoir={setReservoir} onReservoirCreated={setReservoir} />
                            <NewReservoirModal onReservoirCreated={setReservoir} open={isNewReservoirModalOpen} onOpenChange={setIsNewReservoirModalOpen} triggerButton={<Button size="sm"><Plus className="w-4 h-4 mr-2" />Create New</Button>} />
                        </div>
                      </div>
                    )}
                    <InputPanel onCalculate={handleCalculate} onRunSample={handleRunSample} loading={loading} hasResults={!!results} initialInputs={initialInputs} />
                  </>
                )}
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                {!results && !loading && (<EmptyState onRunSample={handleRunSample} />)}
                {loading && (<div className="flex items-center justify-center h-full"><div className="text-center"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lime-400 mx-auto"></div><p className="text-white mt-4 text-lg">Contacting AI PVT Engine...</p><p className="text-lime-300">Running advanced fluid analysis.</p></div></div>)}
                {results && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6"><ResultsPanel results={results} /></motion.div>)}
              </div>
            </div>
          </div>
        </>
      );
    };

    export default PvtQuicklook;