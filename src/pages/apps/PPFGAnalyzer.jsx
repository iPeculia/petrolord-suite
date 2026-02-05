import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft, Database, Play, Activity, Layers, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

// New Components
import PPFGVisualization from '@/components/ppfg/PPFGVisualization';
import ExpertModePanel from '@/components/ppfg/ExpertModePanel';
import GuidedModeFlow from '@/components/ppfg/GuidedModeFlow';
import { ModeSelector, ExportPanel } from '@/components/ppfg/SharedComponents';

// Utils
import { calculateEatonSonic, calculateOverburden, calculateNCT } from '@/utils/ppfgCalculations';

// Mock Data
import { sampleCurves } from '@/data/samplePorePressureData';

const PPFGAnalyzer = () => {
  const { toast } = useToast();
  const [mode, setMode] = useState('expert'); // 'guided' | 'expert'
  const [isProcessing, setIsProcessing] = useState(false);
  const [wellData, setWellData] = useState([]);
  
  // Calculation Config State
  const [config, setConfig] = useState({
    ppMethod: 'eaton_sonic',
    fgMethod: 'matthews_kelly',
    eatonExponent: 3.0,
    nctSlope: 0.0002,
    nctIntercept: 180, // us/ft
    bowersA: 10,
    bowersB: 0.8,
    poissonsRatio: 0.4
  });

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // Load Mock Data on Init
  useEffect(() => {
    // Transform sampleCurves into depth-indexed array for charts
    if(sampleCurves && sampleCurves.length > 0) {
       const grCurve = sampleCurves.find(c => c.mnemonic === 'GR')?.data || [];
       const dtCurve = sampleCurves.find(c => c.mnemonic === 'DT')?.data || [];
       // Mocking resistivity since sampleCurves might be limited
       const resCurve = dtCurve.map(v => 140/v * 2); // Rough anti-correlation mock
       
       // Depth step 50, start 0
       const merged = grCurve.map((gr, i) => ({
          depth: i * 50,
          gr: gr,
          dt: dtCurve[i],
          res: resCurve[i],
          // Placeholders for calculated data
          obg: null,
          pp: null,
          fg: null
       }));
       setWellData(merged);
    }
  }, []);

  const runCalculation = () => {
    setIsProcessing(true);
    toast({ title: "Running PP-FG Analysis", description: `Method: ${config.ppMethod}` });

    setTimeout(() => {
      // Perform Calculations (Frontend simulation using util)
      const depths = wellData.map(d => d.depth);
      const dts = wellData.map(d => d.dt);
      
      // 1. Overburden (Assume constant density for mock if RHOB missing)
      const rhob = depths.map(() => 2.3); // Mock density
      const sv = calculateOverburden(depths, rhob);
      const sv_ppg = sv.map(s => s.gradient_ppg);

      // 2. NCT
      const nct = calculateNCT(depths, 'linear_log', { slope: config.nctSlope, intercept: config.nctIntercept });

      // 3. PP (Eaton)
      const pp = calculateEatonSonic(dts, nct, sv_ppg, 8.5, config.eatonExponent);

      // 4. FG
      const fg = pp.map((p, i) => {
         if(!p) return null;
         // Simple FG mock: PP + k(SV-PP)
         const k = config.poissonsRatio / (1 - config.poissonsRatio); // ~0.67 for nu=0.4
         return p + k * (sv_ppg[i] - p);
      });

      // Merge back
      const newData = wellData.map((row, i) => ({
         ...row,
         dt_nct: nct[i],
         obg: sv_ppg[i],
         pp: pp[i],
         fg: fg[i]
      }));

      setWellData(newData);
      setIsProcessing(false);
      toast({ title: "Analysis Complete", description: "Results updated in visualization." });
    }, 800);
  };

  return (
    <>
      <Helmet>
        <title>PP-FG Analyzer - Geoscience</title>
      </Helmet>
      
      <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
        
        {/* Header */}
        <header className="flex-shrink-0 h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/geoscience">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-500/10 rounded-md border border-red-500/20">
                <Activity className="w-4 h-4 text-red-400" />
              </div>
              <span className="font-semibold text-sm">PP-FG Analyzer</span>
              <Badge variant="outline" className="ml-2 text-[10px] border-slate-700 text-slate-500">Enterprise</Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ModeSelector mode={mode} setMode={setMode} />
            <div className="h-6 w-px bg-slate-800 mx-2"></div>
            <ExportPanel />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden flex">
          {mode === 'guided' ? (
             <div className="w-full h-full">
                <GuidedModeFlow 
                   onComplete={() => { setMode('expert'); runCalculation(); }} 
                   setConfig={(k, v) => console.log("Region set:", v)} // Mock handler
                />
             </div>
          ) : (
             <>
                {/* Left: Expert Controls */}
                <div className="w-80 flex-shrink-0 h-full">
                   <ExpertModePanel 
                      config={config} 
                      updateConfig={updateConfig} 
                      runCalculation={runCalculation} 
                   />
                </div>

                {/* Right: Visualization */}
                <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-950">
                   {isProcessing ? (
                      <div className="flex-1 flex items-center justify-center">
                         <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-400 animate-pulse">Calculating Geopressures...</p>
                         </div>
                      </div>
                   ) : (
                      <div className="flex-1 relative">
                         {wellData.length > 0 ? (
                            <PPFGVisualization 
                               data={wellData} 
                               markers={[{ depth: 4500, type: 'LOT' }]} // Mock
                               casingPoints={[{ depth: 4400, size: 13.375 }]} // Mock
                            />
                         ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500">
                               <Database className="w-16 h-16 mb-4 opacity-20" />
                               <p>No data loaded. Import a well to begin.</p>
                            </div>
                         )}
                      </div>
                   )}
                </div>
             </>
          )}
        </main>

      </div>
    </>
  );
};

export default PPFGAnalyzer;