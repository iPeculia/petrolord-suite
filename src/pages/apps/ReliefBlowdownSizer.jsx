import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Flame, Calculator, Zap, FileText, Sun, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculatePsvSizing, calculateDepressuring, calculateRadiation } from '@/utils/reliefCalculations';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Link, useLocation } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ReliefBlowdownSizer = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('psv-sizing');
  
  const [psvResults, setPsvResults] = useState(null);
  const [depressuringResults, setDepressuringResults] = useState(null);
  const [radiationResults, setRadiationResults] = useState(null);

  const [psvInputs, setPsvInputs] = useState({
    scenario: 'gasVapor', flowRate: 100000, pressure: 1000, temperature: 150, mw: 20, z: 0.95, k: 1.2, density: 50, inletPressure: 1000, outletPressure: 0, heatInput: 1000000, latentHeat: 200,
  });

  const [depressuringInputs, setDepressuringInputs] = useState({
    vesselVolume: 1000, initialPressure: 1500, initialTemperature: 200, finalPressure: 100, fluidMW: 22, fluidK: 1.25, fluidZ: 0.9, orificeDiameter: 1.0,
  });

  const [radiationInputs, setRadiationInputs] = useState({
    heatRelease: 50, distance: 100, fractionRadiated: 0.2, transmissivity: 0.8,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState(null);
  
  useEffect(() => {
    if (location.state?.loadedProject) {
      const { project_data, project_name, id } = location.state.loadedProject;
      setPsvInputs(project_data.inputs_data.psv);
      setDepressuringInputs(project_data.inputs_data.depressuring);
      setRadiationInputs(project_data.inputs_data.radiation);
      setPsvResults(project_data.results_data.psv);
      setDepressuringResults(project_data.results_data.depressuring);
      setRadiationResults(project_data.results_data.radiation);
      setProjectName(project_name);
      setProjectId(id);
      toast({ title: "Project Loaded", description: `Successfully loaded "${project_name}".` });
    }
  }, [location.state, toast]);

  const handlePsvInputChange = (field, value) => setPsvInputs(prev => ({ ...prev, [field]: value }));
  const handleDepressuringInputChange = (field, value) => setDepressuringInputs(prev => ({ ...prev, [field]: value }));
  const handleRadiationInputChange = (field, value) => setRadiationInputs(prev => ({ ...prev, [field]: value }));

  const handleCalculate = () => {
    setPsvResults(null);
    setDepressuringResults(null);
    setRadiationResults(null);
    try {
      if (activeTab === 'psv-sizing') {
        const sizingResults = calculatePsvSizing(psvInputs);
        setPsvResults(sizingResults);
        toast({ title: "✅ PSV Sizing Complete", description: `Required area: ${sizingResults.requiredArea.toFixed(4)} in².`, className: "bg-green-500 text-white" });
      } else if (activeTab === 'depressuring') {
        const blowdownResults = calculateDepressuring(depressuringInputs);
        setDepressuringResults(blowdownResults);
        toast({ title: "✅ Depressuring Simulation Complete", description: `Time to target pressure: ${blowdownResults.timeToFinalPressure.toFixed(2)} seconds.`, className: "bg-green-500 text-white" });
      } else if (activeTab === 'radiation') {
        const radResults = calculateRadiation(radiationInputs);
        setRadiationResults(radResults);
        toast({ title: "✅ Radiation Check Complete", description: `Radiation at target: ${radResults.radiationIntensity.toFixed(2)} kW/m².`, className: "bg-green-500 text-white" });
      }
    } catch (error) {
      toast({ title: "❌ Calculation Error", description: error.message, variant: "destructive" });
    }
  };

  const handleSaveProject = async () => {
    if (!projectName) {
      toast({ variant: 'destructive', title: 'Project name is required.' });
      return;
    }
    setIsSaving(true);
    
    const projectData = {
      user_id: user.id,
      project_name: projectName,
      inputs_data: { psv: psvInputs, depressuring: depressuringInputs, radiation: radiationInputs },
      results_data: { psv: psvResults, depressuring: depressuringResults, radiation: radiationResults }
    };
    
    let response;
    if (projectId) {
        response = await supabase.from('saved_relief_projects').update(projectData).eq('id', projectId).select();
    } else {
        response = await supabase.from('saved_relief_projects').insert(projectData).select();
    }

    const { data, error } = response;

    setIsSaving(false);
    setShowSaveDialog(false);

    if (error) {
      toast({ variant: 'destructive', title: 'Error saving project', description: error.message });
    } else {
      toast({ title: 'Project Saved!', description: `"${projectName}" has been saved successfully.` });
      if (data && data[0]) {
        setProjectId(data[0].id);
      }
    }
  };


  const InputField = ({ id, label, unit, value, onChange, type = "number" }) => (
    <div className="grid grid-cols-2 gap-2 items-center">
      <Label htmlFor={id} className="text-sm">{label}</Label>
      <div className="flex">
        <Input id={id} type={type} value={value} onChange={e => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)} className="rounded-r-none bg-slate-700 border-slate-600 focus:ring-lime-500" />
        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-slate-600 bg-slate-700 text-sm">{unit}</span>
      </div>
    </div>
  );

  const PsvSizingPanel = () => (
    <div className="space-y-4">
      <Select value={psvInputs.scenario} onValueChange={val => handlePsvInputChange('scenario', val)}>
        <SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue placeholder="Select a scenario" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="gasVapor">Gas / Vapor Relief (API 520)</SelectItem>
          <SelectItem value="liquid">Liquid Relief (API 520)</SelectItem>
          <SelectItem value="fireVapor">Fire (Vapor Generation, API 521)</SelectItem>
        </SelectContent>
      </Select>
      {psvInputs.scenario === 'gasVapor' && <div className="space-y-3 p-3 border border-slate-700 rounded-md">
        <InputField id="flowRate" label="Flow Rate (W)" value={psvInputs.flowRate} onChange={val => handlePsvInputChange('flowRate', val)} unit="lb/hr" />
        <InputField id="pressure" label="Relieving Pressure (P1)" value={psvInputs.pressure} onChange={val => handlePsvInputChange('pressure', val)} unit="psig" />
        <InputField id="temperature" label="Relieving Temp (T)" value={psvInputs.temperature} onChange={val => handlePsvInputChange('temperature', val)} unit="F" />
        <InputField id="mw" label="Molecular Weight (MW)" value={psvInputs.mw} onChange={val => handlePsvInputChange('mw', val)} />
        <InputField id="z" label="Compressibility (Z)" value={psvInputs.z} onChange={val => handlePsvInputChange('z', val)} />
        <InputField id="k" label="Cp/Cv Ratio (k)" value={psvInputs.k} onChange={val => handlePsvInputChange('k', val)} />
      </div>}
      {psvInputs.scenario === 'liquid' && <div className="space-y-3 p-3 border border-slate-700 rounded-md">
         <InputField id="flowRate" label="Flow Rate (Q)" value={psvInputs.flowRate} onChange={val => handlePsvInputChange('flowRate', val)} unit="gpm" />
         <InputField id="density" label="Density (G)" value={psvInputs.density} onChange={val => handlePsvInputChange('density', val)} unit="lb/ft3" />
         <InputField id="inletPressure" label="Inlet Pressure (P1)" value={psvInputs.inletPressure} onChange={val => handlePsvInputChange('inletPressure', val)} unit="psig" />
         <InputField id="outletPressure" label="Outlet Pressure (P2)" value={psvInputs.outletPressure} onChange={val => handlePsvInputChange('outletPressure', val)} unit="psig" />
      </div>}
       {psvInputs.scenario === 'fireVapor' && <div className="space-y-3 p-3 border border-slate-700 rounded-md">
         <InputField id="heatInput" label="Heat Input (Q)" value={psvInputs.heatInput} onChange={val => handlePsvInputChange('heatInput', val)} unit="BTU/hr" />
         <InputField id="latentHeat" label="Latent Heat (L)" value={psvInputs.latentHeat} onChange={val => handlePsvInputChange('latentHeat', val)} unit="BTU/lb" />
         <InputField id="temperature" label="Relieving Temp (T)" value={psvInputs.temperature} onChange={val => handlePsvInputChange('temperature', val)} unit="F" />
         <InputField id="mw" label="Molecular Weight (MW)" value={psvInputs.mw} onChange={val => handlePsvInputChange('mw', val)} />
         <InputField id="k" label="Cp/Cv Ratio (k)" value={psvInputs.k} onChange={val => handlePsvInputChange('k', val)} />
         <InputField id="z" label="Compressibility (Z)" value={psvInputs.z} onChange={val => handlePsvInputChange('z', val)} />
      </div>}
    </div>
  );

  const DepressuringPanel = () => (
      <div className="space-y-3 p-3 border border-slate-700 rounded-md">
        <h4 className="text-lime-300 font-semibold">Vessel & Fluid</h4>
        <InputField id="vesselVolume" label="Vessel Volume" value={depressuringInputs.vesselVolume} onChange={val => handleDepressuringInputChange('vesselVolume', val)} unit="ft³" />
        <InputField id="initialPressure" label="Initial Pressure" value={depressuringInputs.initialPressure} onChange={val => handleDepressuringInputChange('initialPressure', val)} unit="psig" />
        <InputField id="initialTemperature" label="Initial Temperature" value={depressuringInputs.initialTemperature} onChange={val => handleDepressuringInputChange('initialTemperature', val)} unit="°F" />
        <InputField id="fluidMW" label="Fluid MW" value={depressuringInputs.fluidMW} onChange={val => handleDepressuringInputChange('fluidMW', val)} />
        <InputField id="fluidK" label="Fluid k (Cp/Cv)" value={depressuringInputs.fluidK} onChange={val => handleDepressuringInputChange('fluidK', val)} />
        <InputField id="fluidZ" label="Fluid Z (Avg)" value={depressuringInputs.fluidZ} onChange={val => handleDepressuringInputChange('fluidZ', val)} />
        <h4 className="text-lime-300 font-semibold pt-2">Blowdown Conditions</h4>
        <InputField id="finalPressure" label="Final Pressure Target" value={depressuringInputs.finalPressure} onChange={val => handleDepressuringInputChange('finalPressure', val)} unit="psig" />
        <InputField id="orificeDiameter" label="Orifice Diameter" value={depressuringInputs.orificeDiameter} onChange={val => handleDepressuringInputChange('orificeDiameter', val)} unit="in" />
      </div>
  );

  const RadiationPanel = () => (
    <div className="space-y-3 p-3 border border-slate-700 rounded-md">
      <h4 className="text-lime-300 font-semibold">Flare & Environment</h4>
      <InputField id="heatRelease" label="Flare Heat Release" value={radiationInputs.heatRelease} onChange={val => handleRadiationInputChange('heatRelease', val)} unit="MW" />
      <InputField id="distance" label="Distance from Flare Base" value={radiationInputs.distance} onChange={val => handleRadiationInputChange('distance', val)} unit="m" />
      <InputField id="fractionRadiated" label="Fraction of Heat Radiated (F)" value={radiationInputs.fractionRadiated} onChange={val => handleRadiationInputChange('fractionRadiated', val)} unit="0.0-1.0" />
      <InputField id="transmissivity" label="Atmospheric Transmissivity (τ)" value={radiationInputs.transmissivity} onChange={val => handleRadiationInputChange('transmissivity', val)} unit="0.0-1.0" />
    </div>
  );

  const InputPanel = () => (
    <Card className="bg-white/5 border-white/10 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Calculator className="w-6 h-6 text-lime-400" />Input Parameters</CardTitle>
        <CardDescription>Define system conditions and relief scenarios.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="psv-sizing">PSV Sizing</TabsTrigger>
            <TabsTrigger value="depressuring">Depressuring</TabsTrigger>
            <TabsTrigger value="radiation">Radiation</TabsTrigger>
          </TabsList>
          <TabsContent value="psv-sizing" className="mt-4"><PsvSizingPanel /></TabsContent>
          <TabsContent value="depressuring" className="mt-4"><DepressuringPanel /></TabsContent>
          <TabsContent value="radiation" className="mt-4"><RadiationPanel /></TabsContent>
        </Tabs>
        <div className="flex gap-2 mt-6">
            <Button onClick={handleCalculate} className="w-full bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600">
                <Zap className="w-4 h-4 mr-2" />
                Calculate
            </Button>
            <Button variant="outline" onClick={() => setShowSaveDialog(true)} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {projectId ? 'Save' : 'Save As'}
            </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ResultsPanel = () => {
    const chartOptions = {
        responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#e2e8f0' } } },
        scales: {
          x: { title: { display: true, text: 'Time (seconds)', color: '#94a3b8' }, ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.1)' } },
          y: { title: { display: true, text: 'Pressure (psia) / Temperature (°R)', color: '#94a3b8' }, ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.1)' } }
        }
    };
    const depressuringChartData = depressuringResults ? {
      labels: depressuringResults.timeData,
      datasets: [
        { label: 'Pressure (psia)', data: depressuringResults.pressureData, borderColor: '#84cc16', backgroundColor: '#a3e635' },
        { label: 'Temperature (°R)', data: depressuringResults.temperatureData, borderColor: '#f97316', backgroundColor: '#fb923c' }
      ],
    } : { labels: [], datasets: [] };
      
    return (
    <Card className="bg-white/5 border-white/10 text-white min-h-[400px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="w-6 h-6 text-lime-400" />Results & Analysis</CardTitle>
        <CardDescription>Review calculated specifications and process profiles.</CardDescription>
      </CardHeader>
      <CardContent className="py-8">
        {!psvResults && !depressuringResults && !radiationResults ? (
          <div className="text-center text-slate-400">Results will be displayed here after calculation.</div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {psvResults && <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-slate-800/50 p-4 rounded-lg"><p className="text-sm text-lime-300">Required Relief Area</p><p className="text-3xl font-bold">{psvResults.requiredArea.toFixed(4)} <span className="text-lg font-normal">in²</span></p></div>
              <div className="bg-slate-800/50 p-4 rounded-lg"><p className="text-sm text-lime-300">Selected Orifice</p><p className="text-3xl font-bold">{psvResults.selectedOrifice.orifice}</p></div>
              <div className="bg-slate-800/50 p-4 rounded-lg"><p className="text-sm text-lime-300">Orifice Area</p><p className="text-3xl font-bold">{psvResults.selectedOrifice.area.toFixed(4)} <span className="text-lg font-normal">in²</span></p></div>
              <div className="bg-slate-800/50 p-4 rounded-lg"><p className="text-sm text-lime-300">Mass Flux (G)</p><p className="text-3xl font-bold">{psvResults.massFlux ? psvResults.massFlux.toFixed(2) : 'N/A'} <span className="text-lg font-normal">lb/s/ft²</span></p></div>
            </div>}
            {depressuringResults && <div className="space-y-6">
               <div className="bg-slate-800/50 p-4 rounded-lg text-center"><p className="text-sm text-lime-300">Time to Reach Target Pressure</p><p className="text-4xl font-bold">{depressuringResults.timeToFinalPressure.toFixed(2)} <span className="text-xl font-normal">seconds</span></p></div>
               <div className="h-80 w-full"><Line options={chartOptions} data={depressuringChartData} /></div>
            </div>}
            {radiationResults && <div className="space-y-6 text-center">
              <div className={`p-6 rounded-lg border-2 ${radiationResults.levelColor}`}>
                <p className="text-sm uppercase tracking-wider">{radiationResults.level}</p>
                <p className="text-5xl font-bold my-2">{radiationResults.radiationIntensity.toFixed(2)} <span className="text-2xl font-normal">kW/m²</span></p>
                <p className="text-sm">{radiationResults.description}</p>
              </div>
              <div className="text-left bg-slate-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-lime-300 mb-2">API 521 Radiation Limits</h4>
                <ul className="text-sm space-y-1 text-slate-300">
                  <li><span className="font-bold text-white">1.58 kW/m²:</span> Continuous exposure, no time limit.</li>
                  <li><span className="font-bold text-white">4.73 kW/m²:</span> Emergency actions, escape enabled.</li>
                  <li><span className="font-bold text-white">6.31 kW/m²:</span> High hazard, immediate escape required.</li>
                  <li><span className="font-bold text-white">9.46 kW/m²:</span> Significant risk of fatality.</li>
                </ul>
              </div>
            </div>}
          </motion.div>
        )}
      </CardContent>
    </Card>
  )};

  return (
    <>
      <Helmet>
        <title>Relief & Blowdown Sizer - Petrolord Suite</title>
        <meta name="description" content="Size pressure safety valves (PSV), model system depressuring, and run fire/thermal case analyses according to API 520/521/2000." />
      </Helmet>
      <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-900 to-green-900/50 min-h-screen text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-xl"><Flame className="w-8 h-8 text-white" /></div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">Relief & Blowdown Sizer</h1>
                <p className="text-orange-200 text-base sm:text-lg">PSV sizing, system depressuring, and fire case analysis</p>
              </div>
            </div>
            <Link to="/dashboard/facilities">
              <Button variant="outline" className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Facilities
              </Button>
            </Link>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div className="lg:col-span-1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}><InputPanel /></motion.div>
          <motion.div className="lg:col-span-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}><ResultsPanel /></motion.div>
        </div>
      </div>
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Save Project</DialogTitle>
                <DialogDescription>Enter a name for your project to save the current inputs and results.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="project-name" className="text-right">Name</Label>
                    <Input id="project-name" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <Button variant="ghost" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
                <Button onClick={handleSaveProject} disabled={isSaving}>
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save'}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReliefBlowdownSizer;