import React, { useState } from 'react';
import { 
  Calculator, Save, PieChart, Target, Layers, Box, GitBranch, 
  Users, FileText, Sigma, GitMerge
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';

// Import Components
import DeterministicPanel from '@/components/quickvol/DeterministicPanel';
import InputPanel from '@/components/quickvol/InputPanel'; // Probabilistic Input
import ResultsPanel from '@/components/quickvol/ResultsPanel'; // Probabilistic Results
import OptimizationPanel from '@/components/quickvol/OptimizationPanel';
import WhatIfAnalysis from '@/components/quickvol/WhatIfAnalysis';
import ReportBuilder from '@/components/quickvol/ReportBuilder'; // NEW Report Builder
import { runProbabilisticSimulation, runMapBasedCalculation } from '@/utils/quickvolCalculations';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const QuickVol = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('deterministic');
  const [loading, setLoading] = useState(false);
  
  // --- STATE MANAGEMENT ---

  // 1. Deterministic State
  const [surfaces, setSurfaces] = useState([]);
  const [surfaceInputs, setSurfaceInputs] = useState({
      top_grid: null,
      base_grid: null,
      avg_thickness: 50,
      porosity_pct: 20,
      sw_pct: 30,
      net_to_gross: 0.85,
      fv_factor: 1.2,
      fv_factor_gas: 0.004,
      owc: 5500,
      goc: 5000,
      gwc: 5600
  });
  const [mapResults, setMapResults] = useState(null);

  // 2. Probabilistic State
  const [stochasticInputs, setStochasticInputs] = useState({
    unit_system: 'field', 
    phase: 'oil',
    n_sim: 5000,
    area: { dist: 'triangular', min: 800, mode: 1000, max: 1200, p10: 900, p50: 1000, p90: 1100 },
    thickness: { dist: 'triangular', min: 40, mode: 50, max: 60, p10: 45, p50: 50, p90: 55 },
    porosity_pct: { dist: 'normal', mean: 20, stdDev: 2, p10: 18, p50: 20, p90: 22 },
    sw_pct: { dist: 'normal', mean: 30, stdDev: 5, p10: 25, p50: 30, p90: 35 },
    fv_factor: { dist: 'uniform', min: 1.1, max: 1.3, p50: 1.2 },
    fv_factor_gas: { dist: 'constant', p50: 0.004 },
    recovery_pct: { dist: 'triangular', min: 10, mode: 30, max: 45, p10: 20, p50: 30, p90: 40 },
    net_to_gross: { dist: 'constant', p50: 85 },
  });
  const [stochasticResults, setStochasticResults] = useState(null);

  // 3. Scenario State
  const [scenarios, setScenarios] = useState([]);

  // --- HANDLERS ---

  // Deterministic Runner
  const handleRunMapCalc = (unitSystem, mode, phase) => {
      setLoading(true);
      setTimeout(() => {
          try {
              const res = runMapBasedCalculation({ ...surfaceInputs, unit_system: unitSystem, mode, phase });
              setMapResults(res);
              toast({ title: "Calculation Complete", description: "Deterministic volumes updated." });
          } catch (e) {
              console.error(e);
              toast({ title: "Calculation Error", description: e.message, variant: "destructive" });
          } finally {
              setLoading(false);
          }
      }, 500);
  };

  // Probabilistic Runner
  const handleProbabilisticRun = () => {
      setLoading(true);
      setTimeout(() => {
          try {
              const res = runProbabilisticSimulation(stochasticInputs);
              setStochasticResults(res);
              toast({ title: "Simulation Complete", description: `Successfully ran ${stochasticInputs.n_sim} iterations.` });
          } catch (e) {
              console.error(e);
              toast({ title: "Simulation Error", description: e.message, variant: "destructive" });
          } finally {
              setLoading(false);
          }
      }, 100);
  };

  // Probabilistic Input Handlers
  const handleStochasticInputChange = (param, field, value) => {
      setStochasticInputs(prev => ({
          ...prev,
          [param]: { ...prev[param], [field]: value }
      }));
  };
  const handleStochasticControlChange = (field, value) => {
      setStochasticInputs(prev => ({ ...prev, [field]: value }));
  };

  // Optimization Handlers
  const applyOptimizedParams = (optimized) => {
      setStochasticInputs(prev => ({
          ...prev,
          area: { ...prev.area, p50: optimized.area, mode: optimized.area },
          porosity_pct: { ...prev.porosity_pct, p50: optimized.porosity, mean: optimized.porosity },
          sw_pct: { ...prev.sw_pct, p50: optimized.sw, mean: optimized.sw }
      }));
      toast({ title: "Optimization Applied", description: "Parameters updated from optimization engine." });
      setActiveTab('probabilistic');
  };

  const saveScenario = (params) => {
      const newScenario = {
          id: Date.now(),
          name: `Scenario ${scenarios.length + 1}`,
          timestamp: new Date(),
          params: params,
          status: 'draft'
      };
      setScenarios(prev => [...prev, newScenario]);
      toast({ title: "Scenario Saved", description: "Available in Optimization tab." });
  };

  const formatNum = (n) => {
    if (n === undefined || n === null) return '-';
    if (n === 0) return '0';
    if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2) + ' B';
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + ' MM';
    if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(2) + ' M';
    return n.toFixed(1);
  };

  return (
    <div className="w-full h-full min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-6 flex flex-col overflow-hidden">
      <Helmet>
        <title>QuickVol Pro - Advanced Volumetrics</title>
        <meta name="description" content="QuickVol Pro - Integrated Deterministic & Probabilistic Volumetrics" />
      </Helmet>

      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4 flex-none">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                QuickVol <span className="text-lime-400">Pro</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1">Integrated Deterministic & Probabilistic Volumetrics</p>
        </div>
        <div className="flex gap-2">
             <Badge variant="outline" className="hidden md:flex border-slate-700 text-slate-400 px-3 py-1 gap-2">
                <GitBranch className="w-3 h-3" />
                {scenarios.length} Scenarios
             </Badge>
             <Button variant="outline" className="border-slate-700 text-slate-300"><Save className="w-4 h-4 mr-2"/> Save Project</Button>
        </div>
      </div>

      {/* Main Workflow Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="w-full flex-none">
            <TabsList className="bg-slate-900/50 border border-slate-800 p-1 w-full justify-start md:w-auto mb-2">
                <TabsTrigger value="deterministic" className="data-[state=active]:bg-cyan-600"><Calculator className="w-4 h-4 mr-2" /> Deterministic</TabsTrigger>
                <TabsTrigger value="probabilistic" className="data-[state=active]:bg-lime-600"><Sigma className="w-4 h-4 mr-2" /> Probabilistic</TabsTrigger>
                <TabsTrigger value="visualizations" className="data-[state=active]:bg-indigo-600"><Box className="w-4 h-4 mr-2" /> Visualizations</TabsTrigger>
                <TabsTrigger value="optimization" className="data-[state=active]:bg-purple-600"><Target className="w-4 h-4 mr-2" /> Optimization</TabsTrigger>
                <TabsTrigger value="collaboration"><Users className="w-4 h-4 mr-2" /> Collaboration</TabsTrigger>
                <TabsTrigger value="results" className="data-[state=active]:bg-orange-600"><FileText className="w-4 h-4 mr-2" /> Report Builder Pro</TabsTrigger>
            </TabsList>
        </ScrollArea>

        {/* 1. DETERMINISTIC TAB */}
        <TabsContent value="deterministic" className="flex-1 min-h-0 overflow-hidden data-[state=active]:flex flex-col">
             <DeterministicPanel 
                surfaceInputs={surfaceInputs}
                setSurfaceInputs={setSurfaceInputs}
                surfaces={surfaces}
                setSurfaces={setSurfaces}
                onRunMapCalc={handleRunMapCalc}
                mapResults={mapResults}
                loading={loading}
             />
        </TabsContent>

        {/* 2. PROBABILISTIC TAB */}
        <TabsContent value="probabilistic" className="flex-1 min-h-0 overflow-hidden data-[state=active]:flex flex-col">
             <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full overflow-hidden">
                 {/* Left: Inputs */}
                 <div className="xl:col-span-4 h-full overflow-hidden">
                    <InputPanel 
                        inputs={stochasticInputs} 
                        onInputChange={handleStochasticInputChange} 
                        onControlChange={handleStochasticControlChange}
                        onRun={handleProbabilisticRun}
                        loading={loading}
                    />
                 </div>
                 
                 {/* Right: Dashboard & Results */}
                 <div className="xl:col-span-8 h-full overflow-y-auto space-y-6 pr-2">
                    {/* Mini Dashboard */}
                     <div className="grid grid-cols-2 gap-4">
                         <Card className="bg-slate-900/50 border-slate-800">
                             <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-400">Current P50</CardTitle></CardHeader>
                             <CardContent>
                                 <div className="text-2xl font-bold text-white">{stochasticResults ? formatNum(stochasticResults.in_place?.p50 || stochasticResults.in_place?.oil?.p50) : '-'} <span className="text-xs text-slate-500">{stochasticResults?.unit_label || ''}</span></div>
                             </CardContent>
                         </Card>
                         <Card className="bg-slate-900/50 border-slate-800">
                             <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-400">Simulations</CardTitle></CardHeader>
                             <CardContent>
                                 <div className="text-2xl font-bold text-lime-400">{stochasticResults ? stochasticInputs.n_sim.toLocaleString() : '-'}</div>
                             </CardContent>
                         </Card>
                     </div>
                     
                     {/* Main Results View */}
                     {!stochasticResults ? (
                         <div className="flex h-64 items-center justify-center text-slate-500 border border-dashed border-slate-800 rounded-lg">
                             Run a Monte Carlo simulation to view probabilistic results
                         </div>
                     ) : (
                         <ResultsPanel results={stochasticResults} />
                     )}
                 </div>
             </div>
        </TabsContent>

        {/* 3. VISUALIZATIONS TAB */}
        <TabsContent value="visualizations" className="flex-1 min-h-0 relative">
             <div className="absolute inset-0 bg-black rounded-lg border border-slate-800 flex flex-col items-center justify-center text-slate-600">
                 <Box className="w-16 h-16 mb-4 opacity-20" />
                 <p className="text-lg font-medium">3D Visualization Engine Pro</p>
                 <p className="text-sm">Interactive reservoir models and cross-sections will appear here.</p>
                 <div className="mt-8 p-4 border border-slate-800 rounded bg-slate-900/50 max-w-md text-center text-xs text-slate-500">
                    Requires active Deterministic Surface models to generate 3D views.
                 </div>
            </div>
        </TabsContent>

        {/* 4. OPTIMIZATION TAB */}
        <TabsContent value="optimization" className="flex-1 min-h-0 overflow-hidden">
            <Tabs defaultValue="whatif" className="h-full flex flex-col">
                 <div className="border-b border-slate-800 mb-4">
                     <TabsList className="w-full justify-start bg-transparent p-0 h-10">
                        <TabsTrigger value="whatif" className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent">
                            What-If Analysis Pro
                        </TabsTrigger>
                        <TabsTrigger value="auto" className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-400 data-[state=active]:bg-transparent">
                            Auto-Optimizer Pro
                        </TabsTrigger>
                        <TabsTrigger value="compare" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-400 data-[state=active]:bg-transparent">
                            Scenario Comparison Pro
                        </TabsTrigger>
                     </TabsList>
                 </div>
                 
                 <TabsContent value="whatif" className="flex-1 min-h-0">
                    <WhatIfAnalysis baseInputs={stochasticInputs} onSaveScenario={saveScenario} />
                 </TabsContent>
                 <TabsContent value="auto" className="flex-1 min-h-0">
                    <OptimizationPanel baseInputs={stochasticInputs} onApplyOptimized={applyOptimizedParams} />
                 </TabsContent>
                 <TabsContent value="compare" className="flex-1 min-h-0 p-1">
                    <Card className="bg-slate-900/50 border-slate-800 h-full">
                        <CardHeader>
                            <CardTitle>Scenario Comparison Pro</CardTitle>
                            <CardDescription>Compare saved What-If scenarios against Base Case</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {scenarios.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-slate-500 border-2 border-dashed border-slate-800 rounded-lg">
                                    <GitMerge className="w-12 h-12 mb-2 opacity-20" />
                                    <p>No scenarios saved yet.</p>
                                    <p className="text-sm">Use "What-If Analysis Pro" to create scenario branches.</p>
                                </div>
                            ) : (
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={scenarios.map((s, i) => ({
                                            name: s.name,
                                            vol: (7758 * s.params.area * s.params.h * (s.params.phi/100) * (1 - s.params.sw/100) / 1.2) / 1e6
                                        }))}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <XAxis dataKey="name" stroke="#94a3b8" />
                                            <YAxis stroke="#94a3b8" label={{ value: 'MMbbl', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                                            <Tooltip contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155'}} />
                                            <Bar dataKey="vol" fill="#06b6d4" name="STOOIP (MMbbl)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                 </TabsContent>
            </Tabs>
        </TabsContent>

        {/* 5. COLLABORATION TAB */}
        <TabsContent value="collaboration" className="flex-1 min-h-0">
            <div className="flex items-center justify-center h-full text-slate-500 border-2 border-dashed border-slate-800 rounded-lg">
                <div className="text-center">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-lg font-medium">Team Collaboration Pro</p>
                    <p className="text-sm">Share projects, comments, and approvals (Coming Soon).</p>
                </div>
            </div>
        </TabsContent>

        {/* 6. REPORT BUILDER TAB */}
        <TabsContent value="results" className="flex-1 min-h-0 overflow-hidden">
             <ReportBuilder 
                mapResults={mapResults}
                stochasticResults={stochasticResults}
                surfaceInputs={surfaceInputs}
                stochasticInputs={stochasticInputs}
                validationResults={[]} // Placeholder for validation integration
             />
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default QuickVol;