import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Wind, Thermometer, ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const HeatExchangerSizer = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('shell-tube');
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  
  // S&T State
  const [stInputs, setStInputs] = useState({
    method: 'lmtd',
    thi: '250',
    tho: '150',
    tci: '100',
    tco: '125',
    u: '150',
    q: '1000000',
    hotFluidFlow: '10000',
    hotFluidCp: '1.0',
    coldFluidFlow: '8000',
    coldFluidCp: '0.5',
    effectiveness: '80',
    flowArrangement: 'counter-current',
    foulingHot: '0.001',
    foulingCold: '0.002',
    lmtdCorrection: '0.95',
  });
  const [stResults, setStResults] = useState(null);

  // Air Cooler State
  const [acInputs, setAcInputs] = useState({
    processFluidIn: '200',
    processFluidOut: '120',
    airIn: '95',
    airOut: '115',
    u: '50',
    q: '500000',
    pressureDrop: '0.5',
    fanEfficiency: '65',
  });
  const [acResults, setAcResults] = useState(null);

  const handleStChange = (name, value) => {
    setStInputs(prev => ({ ...prev, [name]: value }));
    setStResults(null);
  };
  
  const handleAcChange = (name, value) => {
    setAcInputs(prev => ({ ...prev, [name]: value }));
    setAcResults(null);
  };

  const calculateShellTubeSizing = () => {
    if (stInputs.method === 'lmtd') {
      const { thi, tho, tci, tco, u, q, flowArrangement, foulingHot, foulingCold, lmtdCorrection } = stInputs;
      const Th_in = parseFloat(thi);
      const Th_out = parseFloat(tho);
      const Tc_in = parseFloat(tci);
      const Tc_out = parseFloat(tco);
      const U_clean = parseFloat(u);
      const Q = parseFloat(q);
      const Fh = parseFloat(foulingHot);
      const Fc = parseFloat(foulingCold);
      const Ft = parseFloat(lmtdCorrection);

      if ([Th_in, Th_out, Tc_in, Tc_out, U_clean, Q, Fh, Fc, Ft].some(isNaN) || Ft <= 0 || Ft > 1) {
        toast({ variant: "destructive", title: "Invalid Input", description: "Please check all LMTD inputs. LMTD Correction Factor must be > 0 and <= 1." });
        return;
      }
      
      let dt1, dt2;
      if (flowArrangement === 'counter-current') {
        dt1 = Th_in - Tc_out;
        dt2 = Th_out - Tc_in;
      } else { // co-current
        dt1 = Th_in - Tc_in;
        dt2 = Th_out - Tc_out;
      }

      if (dt1 <= 0 || dt2 <= 0 || dt1 === dt2) {
        toast({ variant: "destructive", title: "Invalid Temperatures", description: "Temperature cross-over or equal delta T detected. Check inputs." });
        return;
      }

      const lmtd = (dt1 - dt2) / Math.log(dt1 / dt2);
      const correctedLMTD = lmtd * Ft;
      const U_dirty = 1 / (1 / U_clean + Fh + Fc);
      const area = Q / (U_dirty * correctedLMTD);
      
      setStResults({
        method: 'lmtd',
        lmtd: lmtd.toFixed(1),
        correctedLMTD: correctedLMTD.toFixed(1),
        area: area.toFixed(1),
        u_dirty: U_dirty.toFixed(1),
      });
      toast({ title: "LMTD Calculation Complete" });

    } else { // NTU Method
      const { hotFluidFlow, hotFluidCp, coldFluidFlow, coldFluidCp, u, effectiveness, thi, tci, foulingHot, foulingCold } = stInputs;
      const m_h = parseFloat(hotFluidFlow);
      const Cp_h = parseFloat(hotFluidCp);
      const m_c = parseFloat(coldFluidFlow);
      const Cp_c = parseFloat(coldFluidCp);
      const U_clean = parseFloat(u);
      const eff = parseFloat(effectiveness) / 100;
      const Th_in = parseFloat(thi);
      const Tc_in = parseFloat(tci);
      const Fh = parseFloat(foulingHot);
      const Fc = parseFloat(foulingCold);

      if ([m_h, Cp_h, m_c, Cp_c, U_clean, eff, Th_in, Tc_in, Fh, Fc].some(isNaN)) {
        toast({ variant: "destructive", title: "Invalid Input", description: "Please check all ε-NTU inputs." });
        return;
      }

      const C_h = m_h * Cp_h;
      const C_c = m_c * Cp_c;
      const C_min = Math.min(C_h, C_c);
      const C_max = Math.max(C_h, C_c);
      const C_r = C_min / C_max;

      const Q_max = C_min * (Th_in - Tc_in);
      const Q_actual = Q_max * eff;

      let ntu;
      if (C_r === 0) {
        ntu = -Math.log(1 - eff);
      } else {
        ntu = (1 / (C_r - 1)) * Math.log((eff - 1) / (eff * C_r - 1));
      }

      const U_dirty = 1 / (1 / U_clean + Fh + Fc);
      const area = (ntu * C_min) / U_dirty;

      setStResults({
        method: 'ntu',
        q_actual: Q_actual.toFixed(0),
        ntu: ntu.toFixed(2),
        area: area.toFixed(1),
        c_r: C_r.toFixed(2),
        u_dirty: U_dirty.toFixed(1),
      });
      toast({ title: "ε-NTU Calculation Complete" });
    }
  };
  
  const calculateAirCoolerSizing = () => {
    const { processFluidIn, processFluidOut, airIn, airOut, u, q, pressureDrop, fanEfficiency } = acInputs;
    const T1 = parseFloat(processFluidIn);
    const T2 = parseFloat(processFluidOut);
    const t1 = parseFloat(airIn);
    const t2 = parseFloat(airOut);
    const U = parseFloat(u);
    const Q = parseFloat(q);
    const deltaP = parseFloat(pressureDrop);
    const fanEff = parseFloat(fanEfficiency) / 100;
    
    if ([T1, T2, t1, t2, U, Q, deltaP, fanEff].some(isNaN) || fanEff <= 0) {
      toast({ variant: "destructive", title: "Invalid Input", description: "Please check all air cooler inputs. Fan efficiency must be > 0." });
      return;
    }
    
    const dt1 = T1 - t2;
    const dt2 = T2 - t1;

    if (dt1 <= 0 || dt2 <= 0 || t2 <= t1) {
      toast({ variant: "destructive", title: "Invalid Temperatures", description: "Temperature cross-over or invalid air temps detected. Check inputs." });
      return;
    }

    const lmtd = (dt1 - dt2) / Math.log(dt1 / dt2);
    const area = Q / (U * lmtd);

    const cp_air = 0.24;
    const rho_air = 0.075;
    const air_mass_flow = Q / (cp_air * (t2 - t1));
    const air_vol_flow_cfm = (air_mass_flow / rho_air) / 60;
    const fan_power_hp = (air_vol_flow_cfm * deltaP) / (6356 * fanEff);
    
    setAcResults({
      lmtd: lmtd.toFixed(1),
      area: area.toFixed(1),
      fan_power: fan_power_hp.toFixed(1),
    });
    toast({ title: "Air Cooler Calculation Complete" });
  };

  const handleSaveProject = async () => {
    if (!projectName) {
      toast({ variant: "destructive", title: "Project Name Required", description: "Please enter a name for your project." });
      return;
    }
    if (!user) {
      toast({ variant: "destructive", title: "Not Logged In", description: "You must be logged in to save a project." });
      return;
    }

    const inputs_data = {
      shellTube: stInputs,
      airCooler: acInputs,
    };

    const results_data = {
      shellTube: stResults,
      airCooler: acResults,
    };

    const { error } = await supabase
      .from('saved_heat_exchanger_projects')
      .insert([{ 
        user_id: user.id, 
        project_name: projectName, 
        inputs_data, 
        results_data 
      }]);

    if (error) {
      toast({ variant: "destructive", title: "Save Failed", description: error.message });
    } else {
      toast({ title: "Project Saved!", description: `"${projectName}" has been saved successfully.` });
      setIsSaveDialogOpen(false);
      setProjectName('');
    }
  };

  const LMTDInputs = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Flow Arrangement</Label>
          <Select value={stInputs.flowArrangement} onValueChange={v => handleStChange('flowArrangement', v)}>
            <SelectTrigger className="bg-slate-900 border-slate-600"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="counter-current">Counter-Current</SelectItem>
              <SelectItem value="co-current">Co-Current</SelectItem>
            </SelectContent>
          </Select>
        </div>
         <div className="space-y-2">
          <Label>Heat Duty (BTU/hr)</Label>
          <Input value={stInputs.q} onChange={e => handleStChange('q', e.target.value)} placeholder="e.g., 1,000,000" />
        </div>
        <div className="space-y-2">
          <Label>Hot Fluid In Temp (°F)</Label>
          <Input value={stInputs.thi} onChange={e => handleStChange('thi', e.target.value)} placeholder="e.g., 250" />
        </div>
        <div className="space-y-2">
          <Label>Hot Fluid Out Temp (°F)</Label>
          <Input value={stInputs.tho} onChange={e => handleStChange('tho', e.target.value)} placeholder="e.g., 150" />
        </div>
        <div className="space-y-2">
          <Label>Cold Fluid In Temp (°F)</Label>
          <Input value={stInputs.tci} onChange={e => handleStChange('tci', e.target.value)} placeholder="e.g., 100" />
        </div>
        <div className="space-y-2">
          <Label>Cold Fluid Out Temp (°F)</Label>
          <Input value={stInputs.tco} onChange={e => handleStChange('tco', e.target.value)} placeholder="e.g., 125" />
        </div>
        <div className="space-y-2">
          <Label>Clean U-Value (BTU/hr.ft².°F)</Label>
          <Input value={stInputs.u} onChange={e => handleStChange('u', e.target.value)} placeholder="e.g., 150" />
        </div>
        <div className="space-y-2">
            <Label>LMTD Correction Factor (F<sub>t</sub>)</Label>
            <Input value={stInputs.lmtdCorrection} onChange={e => handleStChange('lmtdCorrection', e.target.value)} placeholder="e.g., 0.95" />
        </div>
        <div className="space-y-2">
            <Label>Hot Fluid Fouling Factor (R<sub>fh</sub>)</Label>
            <Input value={stInputs.foulingHot} onChange={e => handleStChange('foulingHot', e.target.value)} placeholder="e.g., 0.001" />
        </div>
        <div className="space-y-2">
            <Label>Cold Fluid Fouling Factor (R<sub>fc</sub>)</Label>
            <Input value={stInputs.foulingCold} onChange={e => handleStChange('foulingCold', e.target.value)} placeholder="e.g., 0.002" />
        </div>
      </div>
    </div>
  );
  
  const NTUInputs = () => (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label>Required Effectiveness (%)</Label>
            <Input value={stInputs.effectiveness} onChange={e => handleStChange('effectiveness', e.target.value)} placeholder="e.g., 80" />
        </div>
        <div className="space-y-2">
            <Label>Clean U-Value (BTU/hr.ft².°F)</Label>
            <Input value={stInputs.u} onChange={e => handleStChange('u', e.target.value)} placeholder="e.g., 150" />
        </div>
        <div className="space-y-2">
            <Label>Hot Fluid In Temp (°F)</Label>
            <Input value={stInputs.thi} onChange={e => handleStChange('thi', e.target.value)} placeholder="e.g., 250" />
        </div>
        <div className="space-y-2">
            <Label>Cold Fluid In Temp (°F)</Label>
            <Input value={stInputs.tci} onChange={e => handleStChange('tci', e.target.value)} placeholder="e.g., 100" />
        </div>
        <div className="space-y-2">
            <Label>Hot Fluid Flow Rate (lb/hr)</Label>
            <Input value={stInputs.hotFluidFlow} onChange={e => handleStChange('hotFluidFlow', e.target.value)} placeholder="e.g., 10000" />
        </div>
        <div className="space-y-2">
            <Label>Hot Fluid Specific Heat (Cp)</Label>
            <Input value={stInputs.hotFluidCp} onChange={e => handleStChange('hotFluidCp', e.target.value)} placeholder="e.g., 1.0" />
        </div>
        <div className="space-y-2">
            <Label>Cold Fluid Flow Rate (lb/hr)</Label>
            <Input value={stInputs.coldFluidFlow} onChange={e => handleStChange('coldFluidFlow', e.target.value)} placeholder="e.g., 8000" />
        </div>
        <div className="space-y-2">
            <Label>Cold Fluid Specific Heat (Cp)</Label>
            <Input value={stInputs.coldFluidCp} onChange={e => handleStChange('coldFluidCp', e.target.value)} placeholder="e.g., 0.5" />
        </div>
        <div className="space-y-2">
            <Label>Hot Fluid Fouling Factor (R<sub>fh</sub>)</Label>
            <Input value={stInputs.foulingHot} onChange={e => handleStChange('foulingHot', e.target.value)} placeholder="e.g., 0.001" />
        </div>
        <div className="space-y-2">
            <Label>Cold Fluid Fouling Factor (R<sub>fc</sub>)</Label>
            <Input value={stInputs.foulingCold} onChange={e => handleStChange('foulingCold', e.target.value)} placeholder="e.g., 0.002" />
        </div>
    </div>
  );

  const ShellTubeSizer = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Calculation Method</Label>
        <Select value={stInputs.method} onValueChange={v => handleStChange('method', v)}>
          <SelectTrigger className="bg-slate-900 border-slate-600"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="lmtd">LMTD Method</SelectItem>
            <SelectItem value="ntu">ε-NTU Method</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {stInputs.method === 'lmtd' ? <LMTDInputs /> : <NTUInputs />}
      <Button onClick={calculateShellTubeSizing} className="w-full bg-sky-600 hover:bg-sky-700 mt-4">
        Calculate S&T Exchanger
      </Button>
    </div>
  );

  const AirCoolerSizer = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Heat Duty (BTU/hr)</Label>
        <Input value={acInputs.q} onChange={e => handleAcChange('q', e.target.value)} placeholder="e.g., 500,000" />
      </div>
      <div className="space-y-2">
        <Label>Overall U-Value (BTU/hr.ft².°F)</Label>
        <Input value={acInputs.u} onChange={e => handleAcChange('u', e.target.value)} placeholder="e.g., 50" />
      </div>
      <div className="space-y-2">
        <Label>Process Fluid In Temp (°F)</Label>
        <Input value={acInputs.processFluidIn} onChange={e => handleAcChange('processFluidIn', e.target.value)} placeholder="e.g., 200" />
      </div>
      <div className="space-y-2">
        <Label>Process Fluid Out Temp (°F)</Label>
        <Input value={acInputs.processFluidOut} onChange={e => handleAcChange('processFluidOut', e.target.value)} placeholder="e.g., 120" />
      </div>
      <div className="space-y-2">
        <Label>Ambient Air In Temp (°F)</Label>
        <Input value={acInputs.airIn} onChange={e => handleAcChange('airIn', e.target.value)} placeholder="e.g., 95" />
      </div>
      <div className="space-y-2">
        <Label>Heated Air Out Temp (°F)</Label>
        <Input value={acInputs.airOut} onChange={e => handleAcChange('airOut', e.target.value)} placeholder="e.g., 115" />
      </div>
      <div className="space-y-2">
        <Label>Air Pressure Drop (in H₂O)</Label>
        <Input value={acInputs.pressureDrop} onChange={e => handleAcChange('pressureDrop', e.target.value)} placeholder="e.g., 0.5" />
      </div>
      <div className="space-y-2">
        <Label>Fan Efficiency (%)</Label>
        <Input value={acInputs.fanEfficiency} onChange={e => handleAcChange('fanEfficiency', e.target.value)} placeholder="e.g., 65" />
      </div>
      <div className="col-span-2">
        <Button onClick={calculateAirCoolerSizing} className="w-full bg-sky-600 hover:bg-sky-700 mt-4">
          Calculate Air Cooler
        </Button>
      </div>
    </div>
  );

  const ResultsDisplay = () => {
    const results = activeTab === 'shell-tube' ? stResults : acResults;
    if (!results) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-10">
          <Thermometer className="w-16 h-16 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Results will appear here</h3>
          <p>Enter your inputs and click calculate to see the required heat exchanger area and performance.</p>
        </div>
      );
    }

    if (activeTab === 'shell-tube') {
      return (
        <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold text-sky-300">{results.method.toUpperCase()} Method Results</h3>
            <div className="p-6 bg-slate-900/50 rounded-lg">
                <h3 className="text-sm font-medium text-slate-400">Required Heat Transfer Area</h3>
                <p className="text-4xl font-bold text-white">{results.area} <span className="text-xl">ft²</span></p>
            </div>
             <div className="p-4 bg-slate-900/50 rounded-lg">
                <h3 className="text-sm font-medium text-slate-400">Design U-Value (with Fouling)</h3>
                <p className="text-3xl font-bold text-sky-200">{results.u_dirty} <span className="text-lg">BTU/hr.ft².°F</span></p>
            </div>
            {results.method === 'lmtd' ? (
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-900/50 rounded-lg">
                        <h3 className="text-sm font-medium text-slate-400">Ideal LMTD</h3>
                        <p className="text-2xl font-bold text-sky-200">{results.lmtd} <span className="text-lg">°F</span></p>
                    </div>
                     <div className="p-4 bg-slate-900/50 rounded-lg">
                        <h3 className="text-sm font-medium text-slate-400">Corrected LMTD</h3>
                        <p className="text-2xl font-bold text-sky-200">{results.correctedLMTD} <span className="text-lg">°F</span></p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-900/50 rounded-lg">
                        <h3 className="text-sm font-medium text-slate-400">Actual Heat Duty</h3>
                        <p className="text-2xl font-bold text-sky-200">{results.q_actual} <span className="text-base">BTU/hr</span></p>
                    </div>
                     <div className="p-4 bg-slate-900/50 rounded-lg">
                        <h3 className="text-sm font-medium text-slate-400">NTU</h3>
                        <p className="text-2xl font-bold text-sky-200">{results.ntu}</p>
                    </div>
                </div>
            )}
        </div>
      )
    }

    if (activeTab === 'air-cooler') {
        return (
            <div className="space-y-4 text-center">
                <h3 className="text-lg font-semibold text-sky-300">Air Cooler (Fin Fan) Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-900/50 rounded-lg">
                        <h3 className="text-sm font-medium text-slate-400">Required Bare Tube Area</h3>
                        <p className="text-4xl font-bold text-white">{results.area} <span className="text-xl">ft²</span></p>
                    </div>
                    <div className="p-6 bg-slate-900/50 rounded-lg">
                        <h3 className="text-sm font-medium text-slate-400">Required Fan Power</h3>
                        <p className="text-4xl font-bold text-white">{results.fan_power} <span className="text-xl">HP</span></p>
                    </div>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg">
                    <h3 className="text-sm font-medium text-slate-400">Log Mean Temp. Difference (LMTD)</h3>
                    <p className="text-3xl font-bold text-sky-200">{results.lmtd} <span className="text-lg">°F</span></p>
                </div>
                <p className="text-xs text-slate-500 pt-2">Note: Area is bare tube area. Total finned surface area will be larger. Fan power is brake horsepower.</p>
            </div>
        )
    }
  }

  return (
    <>
      <Helmet>
        <title>Heat Exchanger Sizer - Petrolord</title>
        <meta name="description" content="Size shell & tube exchangers or air coolers using LMTD and e-NTU methods, including fouling and TEMA factors." />
      </Helmet>
      <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 to-indigo-900/50 text-white p-4 sm:p-6 lg:p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-sky-500 to-cyan-400 p-3 rounded-lg">
                <Wind className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold">Heat Exchanger & Air Cooler Sizer</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setIsSaveDialogOpen(true)} disabled={!stResults && !acResults}>
                <Save className="mr-2 h-4 w-4" />
                Save Project
              </Button>
              <Button asChild variant="outline">
                <Link to="/dashboard/facilities">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Facilities
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="bg-slate-800/50 border-slate-700 h-full">
              <CardHeader>
                <CardTitle className="text-white">Sizing Inputs</CardTitle>
                <CardDescription className="text-slate-400">Select exchanger type and provide conditions.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={v => { setActiveTab(v); setStResults(null); setAcResults(null); }} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-900/80">
                    <TabsTrigger value="shell-tube">Shell & Tube</TabsTrigger>
                    <TabsTrigger value="air-cooler">Air Cooler</TabsTrigger>
                  </TabsList>
                  <TabsContent value="shell-tube" className="mt-4">
                    <ShellTubeSizer />
                  </TabsContent>
                  <TabsContent value="air-cooler" className="mt-4">
                    <AirCoolerSizer />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="bg-slate-800/50 border-slate-700 h-full">
              <CardHeader>
                <CardTitle className="text-white">Sizing Results</CardTitle>
                <CardDescription className="text-slate-400">Calculated area, LMTD, and other key parameters.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResultsDisplay />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Save Project</DialogTitle>
            <DialogDescription>Enter a name for your project to save the current inputs and results.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Project Name</Label>
              <Input id="name" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="col-span-3 bg-slate-900 border-slate-600" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveProject} className="bg-sky-600 hover:bg-sky-700">Save Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HeatExchangerSizer;