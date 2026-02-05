import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, FlaskConical, AlertTriangle, Play, TestTube, SlidersHorizontal, Check, X, Send, Plus, Library, ChevronsRight, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";
import { useReservoir } from '@/contexts/ReservoirContext';
import { supabase } from '@/lib/customSupabaseClient';
import { v4 as uuidv4 } from 'uuid';

const NewReservoirModal = ({ onReservoirCreated, onOpenChange, open, triggerButton }) => {
  const [formData, setFormData] = useState({ name: '', basin: '', field: '', country: '', operator: '', fluid: 'oil', drive: 'solution_gas', unit_system: 'FIELD' });
  const { toast } = useToast();
  const handleSubmit = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('reservoir-engine', { body: { action: 'create', payload: formData } });
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
          {Object.keys(formData).map(key => (<div className="grid grid-cols-4 items-center gap-4" key={key}><Label htmlFor={key} className="text-right capitalize">{key.replace('_', ' ')}</Label><Input id={key} name={key} value={formData[key]} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value })} className="col-span-3 bg-slate-800 border-slate-600" /></div>))}
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
          <div className="mt-4 flex justify-center"><NewReservoirModal onReservoirCreated={handleReservoirCreatedAndSelect} open={isNewReservoirModalOpen} onOpenChange={setIsNewReservoirModalOpen} triggerButton={<Button><Plus className="w-4 h-4 mr-2" />Create New Reservoir</Button>} /></div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const SendToScenarioModal = ({ open, onOpenChange, eorData, reservoir, onSuccessfulSend }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [scenarioConfig, setScenarioConfig] = useState({
    start_date: new Date().toISOString().split('T')[0], months: 120, oil_usd_per_bbl: 80, gas_usd_per_mscf: 3.5, oil_capacity_bpd: 50000, water_capacity_bpd: 80000,
    chem_per_bbl_inj_water_usd: 0,
    co2_purchase_price_per_mcf: 0, co2_recycle_cost_per_mcf: 0,
  });

  useEffect(() => {
    if(eorData?.economics){
      setScenarioConfig(prev => ({
        ...prev,
        chem_per_bbl_inj_water_usd: eorData.economics.chem_cost_per_bbl_inj_water_usd || 0,
        co2_purchase_price_per_mcf: eorData.economics.co2_purchase_cost_per_mcf || 0,
        co2_recycle_cost_per_mcf: eorData.economics.co2_recycle_cost_per_mcf || 0,
      }));
    }
  }, [eorData]);

  const handleConfigChange = (field, value) => setScenarioConfig(prev => ({ ...prev, [field]: value }));
  
  const handleRunScenario = async () => {
    setLoading(true);
    
    // Create the well profile based on EOR design
    const newWell = { 
      id: uuidv4(),
      name: `EOR-${eorData.eor_method}-Pattern-1`, 
      start_date: scenarioConfig.start_date, 
      decline: { 
        model: 'EXP', 
        qi_bpd: eorData.details.injection_rate_bpd_per_injector || 2000, // use a sensible default
        Di_per_day: 0.001,
        b: null,
        econ_limit_bpd: 10,
      }, 
      ramp_months: 2, 
      uptime_frac: 0.98, 
      gor_scf_per_stb: 800, 
      wor_model: { type: 'watercut_fixed_frac', value: 0.1 }, 
      capex_override_usd: null, 
      enabled: true 
    };

    // Construct the payload for a new project and case
    const casePayload = {
      id: uuidv4(),
      name: "Base Case (from EOR)",
      payload: {
        reservoir_id: reservoir.id,
        base_case: {
          setup: { start_date: scenarioConfig.start_date, months: scenarioConfig.months, curtailment: 'none' },
          price_deck: { oil_usd_per_bbl: scenarioConfig.oil_usd_per_bbl, gas_usd_per_mscf: scenarioConfig.gas_usd_per_mscf },
          facility: { oil_capacity_bpd: scenarioConfig.oil_capacity_bpd, water_capacity_bpd: scenarioConfig.water_capacity_bpd, global_uptime_frac: 0.95 },
          costs: { 
            chem_per_bbl_inj_water_usd: scenarioConfig.chem_per_bbl_inj_water_usd, 
            co2_purchase_price_per_mcf: scenarioConfig.co2_purchase_price_per_mcf, 
            co2_recycle_cost_per_mcf: scenarioConfig.co2_recycle_cost_per_mcf, 
            opex_oil_usd_per_bbl: 5, 
            opex_water_usd_per_bbl: 2, 
            fixed_opex_usd_per_month: 100000, 
            royalty_frac: 0.125, 
            tax_rate: 0.35, 
            discount_rate_annual: 0.1 
          },
          wells: [newWell]
        }
      },
      results: null,
      mc_results: null,
      created_at: new Date().toISOString(),
    };
    
    const projectPayload = {
      id: uuidv4(),
      name: `${eorData.eor_method} Forecast`,
      reservoir_id: reservoir.id,
      cases: [casePayload],
      created_at: new Date().toISOString(),
    };
    
    try {
      // We pass the full new project to the callback
      onSuccessfulSend(projectPayload);
      toast({ title: "Scenario Created!", description: `Redirecting to new project in Scenario Planner...` });
      navigate(`/dashboard/reservoir/scenario?reservoir_id=${reservoir.id}`);
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 text-white border-slate-700 max-w-lg">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Send /> Send EOR Design to Scenario Planner</DialogTitle><DialogDescription>Configure and run a new economic forecast based on the <span className="font-bold text-amber-400">{eorData?.eor_method}</span> design.</DialogDescription></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Start Date</Label><Input type="date" value={scenarioConfig.start_date} onChange={e => handleConfigChange('start_date', e.target.value)} /></div>
            <div><Label>Months</Label><Input type="number" value={scenarioConfig.months} onChange={e => handleConfigChange('months', Number(e.target.value))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Oil Price ($/bbl)</Label><Input type="number" value={scenarioConfig.oil_usd_per_bbl} onChange={e => handleConfigChange('oil_usd_per_bbl', Number(e.target.value))} /></div>
            <div><Label>Gas Price ($/Mscf)</Label><Input type="number" value={scenarioConfig.gas_usd_per_mscf} onChange={e => handleConfigChange('gas_usd_per_mscf', Number(e.target.value))} /></div>
          </div>
          <div className="p-3 bg-gray-800 rounded-md">
            <h4 className="font-semibold text-amber-300 mb-2">EOR Costs (from Design)</h4>
            <div className="grid grid-cols-2 gap-4">
              {eorData?.economics?.chem_cost_per_bbl_inj_water_usd > 0 && (<div><Label>Chem Cost ($/bbl inj)</Label><Input type="number" value={scenarioConfig.chem_per_bbl_inj_water_usd} onChange={e => handleConfigChange('chem_per_bbl_inj_water_usd', Number(e.target.value))} /></div>)}
              {eorData?.economics?.co2_purchase_cost_per_mcf > 0 && (<><div><Label>CO2 Purchase ($/Mcf)</Label><Input type="number" value={scenarioConfig.co2_purchase_price_per_mcf} onChange={e => handleConfigChange('co2_purchase_price_per_mcf', Number(e.target.value))} /></div><div><Label>CO2 Recycle ($/Mcf)</Label><Input type="number" value={scenarioConfig.co2_recycle_cost_per_mcf} onChange={e => handleConfigChange('co2_recycle_cost_per_mcf', Number(e.target.value))} /></div></>)}
            </div>
             {eorData?.economics?.chem_cost_per_bbl_inj_water_usd === 0 && eorData?.economics?.co2_purchase_cost_per_mcf === 0 && <p className="text-sm text-slate-400">No specific EOR costs for this method.</p>}
          </div>
        </div>
        <Button onClick={handleRunScenario} disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">{loading ? 'Creating Scenario...' : 'Create & Go to Planner'}</Button>
      </DialogContent>
    </Dialog>
  );
};


const EorDesigner = () => {
  const { toast } = useToast();
  const { reservoir, setReservoir, isReady } = useReservoir();
  const [activeStage, setActiveStage] = useState(1);
  const [screenLoading, setScreenLoading] = useState(false);
  const [designLoading, setDesignLoading] = useState(false);
  const [screenResults, setScreenResults] = useState(null);
  const [designResults, setDesignResults] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [isNewReservoirModalOpen, setIsNewReservoirModalOpen] = useState(false);
  const [screenInputs, setScreenInputs] = useState({ rock_type: 'sandstone', api: 30, oil_visc_cP: 10, temp_F: 180, depth_ft: 8000, perm_md: 100, netpay_ft: 50, poro_frac: 0.2, sw_frac: 0.2, salinity_ppm: 50000 });
  const [designInputs, setDesignInputs] = useState({ pattern_kind: '5-spot', spacing_acres: 40 });

  const handleScreenInputChange = (field, value) => setScreenInputs(prev => ({ ...prev, [field]: value }));
  const handleDesignInputChange = (field, value) => setDesignInputs(prev => ({ ...prev, [field]: value }));

  const requireRid = () => {
    if (reservoir?.id) return true;
    toast({ title: "Reservoir Needed", description: "Select or create a reservoir first.", variant: "destructive" });
    return false;
  };

  const runScreening = async () => {
    if (!requireRid()) return;
    setScreenLoading(true);
    setScreenResults(null);
    setDesignResults(null);
    setSelectedMethod('');
    setActiveStage(1);
    
    try {
      const { data, error } = await supabase.functions.invoke('eor-engine', { body: { action: 'screen', payload: screenInputs } });
      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      setScreenResults(data);
      setActiveStage(2);
      toast({ title: "Screening Complete!", description: "EOR methods have been ranked. Select one to proceed." });
    } catch (err) {
      toast({ title: "Screening Error", description: err.message, variant: "destructive" });
    } finally {
      setScreenLoading(false);
    }
  };
  
  const selectAndDesign = async (method) => {
    setSelectedMethod(method);
    await runDesign(method);
  };
  
  const runDesign = async (method) => {
    if (!requireRid()) return;
    if (!method) { toast({ title: "No Method Selected", description: "Please select an EOR method from the screening results.", variant: "destructive" }); return; }
    setDesignLoading(true);
    setDesignResults(null);
    const payload = { eor_method: method, reservoir_params: screenInputs, design_params: designInputs };
    try {
      const { data, error } = await supabase.functions.invoke('eor-engine', { body: { action: 'design', payload } });
      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);
      setDesignResults(data);
      setActiveStage(3);
      toast({ title: "Design Complete!", description: "Conceptual design has been generated." });
    } catch (err) {
      toast({ title: "Design Error", description: err.message, variant: "destructive" });
    } finally {
      setDesignLoading(false);
    }
  };
  
  const renderValue = (value) => {
      if (typeof value === 'number') return value.toFixed(2);
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      return String(value);
  }

  const handleSuccessfulSend = (projectData) => {
    const existingProjects = JSON.parse(localStorage.getItem('scenario_planner_projects') || '[]');
    const updatedProjects = [...existingProjects, projectData];
    localStorage.setItem('scenario_planner_projects', JSON.stringify(updatedProjects));
  };


  return (
    <>
      <Helmet><title>EOR Designer - Petrolord</title></Helmet>
      <div className="p-4 sm:p-6 bg-gray-900 text-white min-h-screen">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard/reservoir"><Button variant="outline" size="sm" className="border-amber-400/50 text-amber-300 hover:bg-amber-500/20"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button></Link>
            <div className="flex items-center space-x-3"><div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-2 rounded-lg"><FlaskConical className="w-6 h-6" /></div><div><h1 className="text-2xl font-bold">EOR Designer</h1><p className="text-amber-300">{reservoir?.id ? `For Reservoir: ${reservoir.name}` : "No reservoir selected"}</p></div></div>
          </div>
        </motion.div>

        {!isReady ? (
            <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lime-400"></div></div>
        ) : !reservoir?.id ? (
          <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-200 p-4 rounded-lg mb-6 flex items-center justify-center gap-4">
            <AlertTriangle className="w-6 h-6" /><span className="text-lg font-semibold">No Reservoir Selected. Please select or create one to begin.</span>
            <SelectReservoirDrawer onSelectReservoir={setReservoir} onReservoirCreated={setReservoir} />
            <NewReservoirModal onReservoirCreated={setReservoir} open={isNewReservoirModalOpen} onOpenChange={setIsNewReservoirModalOpen} triggerButton={<Button><Plus className="w-4 h-4 mr-2" />Create</Button>} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0, transition: {delay: 0.1} }} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><SlidersHorizontal className="text-amber-400"/>1. Screening Inputs</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Rock Type</Label><Select value={screenInputs.rock_type} onValueChange={v => handleScreenInputChange('rock_type', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="sandstone">Sandstone</SelectItem><SelectItem value="carbonate">Carbonate</SelectItem></SelectContent></Select></div>
                  <div><Label>API Gravity</Label><Input type="number" value={screenInputs.api} onChange={e => handleScreenInputChange('api', Number(e.target.value))} /></div>
                  <div><Label>Oil Viscosity (cP)</Label><Input type="number" value={screenInputs.oil_visc_cP} onChange={e => handleScreenInputChange('oil_visc_cP', Number(e.target.value))} /></div>
                  <div><Label>Temperature (°F)</Label><Input type="number" value={screenInputs.temp_F} onChange={e => handleScreenInputChange('temp_F', Number(e.target.value))} /></div>
                  <div><Label>Depth (ft)</Label><Input type="number" value={screenInputs.depth_ft} onChange={e => handleScreenInputChange('depth_ft', Number(e.target.value))} /></div>
                  <div><Label>Permeability (mD)</Label><Input type="number" value={screenInputs.perm_md} onChange={e => handleScreenInputChange('perm_md', Number(e.target.value))} /></div>
                  <div><Label>Salinity (ppm)</Label><Input type="number" value={screenInputs.salinity_ppm} onChange={e => handleScreenInputChange('salinity_ppm', Number(e.target.value))} /></div>
                  <div><Label>Porosity (fraction)</Label><Input type="number" step="0.01" value={screenInputs.poro_frac} onChange={e => handleScreenInputChange('poro_frac', Number(e.target.value))} /></div>
                </div>
                <Button onClick={runScreening} disabled={screenLoading} className="w-full mt-6 bg-gradient-to-r from-amber-600 to-yellow-600">{screenLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><Play className="mr-2 h-4 w-4"/>Run Screening</>}</Button>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: screenResults ? 1 : 0.5, x: 0, transition: {delay: 0.2} }} className={`bg-slate-800/50 p-6 rounded-xl border border-slate-700 ${!screenResults && 'opacity-50 pointer-events-none'}`}>
                 <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><TestTube className="text-purple-400"/>2. Design Inputs</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <div><Label>Pattern</Label><Select value={designInputs.pattern_kind} onValueChange={v => handleDesignInputChange('pattern_kind', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="5-spot">5-Spot</SelectItem><SelectItem value="7-spot">7-Spot</SelectItem><SelectItem value="line-drive">Line Drive</SelectItem></SelectContent></Select></div>
                    <div><Label>Spacing (acres)</Label><Input type="number" value={designInputs.spacing_acres} onChange={e => handleDesignInputChange('spacing_acres', Number(e.target.value))} /></div>
                 </div>
                 <p className="text-sm text-slate-400 mt-4">Select a method from the screening results to generate a design.</p>
              </motion.div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              {screenLoading && <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-24 w-24 border-b-4 border-amber-400"></div><p className="ml-4 text-xl">Screening...</p></div>}
              {!screenLoading && !screenResults && (
                <div className="h-96 bg-slate-800/30 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-400">
                    <FlaskConical size={48} className="mb-4 text-slate-500"/>
                    <h3 className="text-xl font-semibold">Ready for EOR Analysis</h3>
                    <p>Enter reservoir parameters and run screening to begin.</p>
                </div>
              )}
              {screenResults && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4">Screening Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {screenResults.ranked.map(r => (
                        <button key={r.method} onClick={() => selectAndDesign(r.method)} disabled={designLoading} className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${selectedMethod === r.method ? 'border-purple-500 bg-purple-900/50' : 'border-slate-700 bg-slate-900/50 hover:border-amber-500'}`}>
                          <div className="flex justify-between items-center mb-1"><span className="font-bold text-lg text-white">{r.method}</span><span className="font-mono text-amber-300 bg-amber-900/50 px-2 py-1 rounded">{r.score.toFixed(2)}</span></div>
                          <Progress value={r.score * 100} className="h-2 [&>*]:bg-gradient-to-r [&>*]:from-amber-500 [&>*]:to-yellow-400" />
                          <p className="text-xs text-slate-300 mt-2">{r.reason}</p>
                        </button>
                      ))}
                    </div>
                     {screenResults.gating_notes.length > 0 && (<div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg"><h4 className="font-bold text-red-300 mb-2">Gating Notes</h4><ul className="list-disc list-inside text-red-200 text-sm space-y-1">{screenResults.gating_notes.map((note, i) => <li key={i}>{note}</li>)}</ul></div>)}
                </motion.div>
              )}
              
              {designLoading && <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-24 w-24 border-b-4 border-purple-400"></div><p className="ml-4 text-xl">Generating Design...</p></div>}
              {designResults && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">Conceptual Design: <span className="text-purple-400">{designResults.eor_method}</span></h3>
                        <Button onClick={() => setIsScenarioModalOpen(true)} className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"><Send className="w-4 h-4 mr-2" />Forecast Economics</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(designResults.summary).map(([key, value]) => (<div key={key} className="bg-slate-900/50 p-4 rounded-lg"><p className="text-sm text-slate-400 capitalize">{key.replace(/_/g, ' ')}</p><p className="text-xl font-bold text-white">{renderValue(value)}</p></div>))}
                    </div>
                    <div className="mt-6">
                        <h4 className="font-bold text-lg text-white mb-2 flex items-center gap-2"><FileText/>Design Details</h4>
                        <div className="bg-slate-900/50 p-4 rounded-lg space-y-2">
                           {Object.entries(designResults.details).map(([key, value]) => (<div key={key} className="flex justify-between text-sm"><span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}:</span><span className="font-mono text-white">{renderValue(value)}</span></div>))}
                        </div>
                    </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
      {reservoir && designResults && <SendToScenarioModal open={isScenarioModalOpen} onOpenChange={setIsScenarioModalOpen} eorData={designResults} reservoir={reservoir} onSuccessfulSend={handleSuccessfulSend} />}
    </>
  );
};

export default EorDesigner;