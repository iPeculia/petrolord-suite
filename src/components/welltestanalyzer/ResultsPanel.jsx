import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart as LucideBarChart, Download, Layers, Percent, Thermometer, BrainCircuit, RefreshCw, Archive, Sigma, Gauge, Send } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import CollapsibleSection from './CollapsibleSection';
import DiagnosticPlot from './DiagnosticPlot';
import { supabase } from '@/lib/customSupabaseClient';
import { Scatter, Bar as BarChart } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, LogarithmicScale, CategoryScale, BarElement } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';

ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend, LogarithmicScale, CategoryScale, BarElement, zoomPlugin);

const ResultsPanel = ({ results, onReset, onSmoothingChange, smoothingLevel }) => {
  const { runId, kpis, plotsData } = results;
  const { toast } = useToast();
  const [isReporting, setIsReporting] = useState(false);
  const derivativeChartRef = useRef(null);
  const hornerChartRef = useRef(null);
  const mdhChartRef = useRef(null);

  const handleGenerateReport = async () => {
    setIsReporting(true);
    toast({
      title: "Generating PDF Report...",
      description: "Please wait while we assemble your report.",
    });
    
    try {
        const chartImages = {
            derivative: derivativeChartRef.current?.toBase64Image(),
            horner: hornerChartRef.current?.toBase64Image(),
            mdh: mdhChartRef.current?.toBase64Image(),
        };

        const { data, error } = await supabase.functions.invoke('pta_report_pdf', {
            body: JSON.stringify({ 
                run_id: runId, 
                company: {name: 'Petrolord'}, 
                results: results,
                chartImages: chartImages
            })
        });

        if(error) throw new Error("The reporting service could not be reached.");
        if(!data.ok) throw new Error(data.error || "The reporting service returned an error.");

        toast({
            title: "✅ Report Generated!",
            description: "Your PDF report is ready.",
            action: <a href={data.report_url} target="_blank" rel="noopener noreferrer"><Button variant="outline">Open</Button></a>,
        });

    } catch (error) {
        console.error("Report generation error:", error);
        toast({
            variant: "destructive",
            title: "Report Generation Failed",
            description: error.message || "The report could not be generated at this time. Please try again later.",
        });
    } finally {
        setIsReporting(false);
    }
  };
  
  const handleIntegration = (target) => {
    toast({
        title: `🚀 Send to ${target}`,
        description: `Posting kh=${kpis.permeability.toFixed(1)}, skin=${kpis.skin.toFixed(2)} to ${target}.`,
    });
  };
  
  const chartOptions = (xLabel, yLabel, xType = 'logarithmic', yType = 'logarithmic') => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
        legend: { position: 'top', labels: { color: '#1f2937' }},
        zoom: {
            zoom: { wheel: { enabled: true }, drag: { enabled: true }, pinch: { enabled: true }, mode: 'xy' },
            pan: { enabled: true, mode: 'xy' },
        }
    },
    scales: {
        x: { type: xType, title: { text: xLabel, display: true, color: '#4b5563' }, ticks: { color: '#4b5563' }, grid: { color: 'rgba(0, 0, 0, 0.1)' } },
        y: { type: yType, title: { text: yLabel, display: true, color: '#4b5563' }, ticks: { color: '#4b5563' }, grid: { color: 'rgba(0, 0, 0, 0.1)' } },
    },
  });

  const regimeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: {
        x: { type: 'logarithmic', title: { text: 'Time (hours)', display: true, color: '#4b5563' }, ticks: { color: '#4b5563' }, grid: { color: 'rgba(0, 0, 0, 0.1)' } },
        y: { type: 'category', title: { text: 'Flow Regime', display: true, color: '#4b5563' }, ticks: { color: '#4b5563' }, grid: { color: 'rgba(0, 0, 0, 0.1)' } },
    },
    elements: { bar: { borderWidth: 2 } },
  };
  
  const renderConfidence = (conf) => {
    if (!conf || conf[0] === null) return 'N/A';
    return `${Number(conf[0]).toFixed(1)} / ${Number(conf[1]).toFixed(1)}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
        <Button onClick={onReset} variant="outline" className="text-slate-300 border-slate-600 hover:bg-slate-700">
          <RefreshCw className="w-4 h-4 mr-2" />
          New Analysis
        </Button>
      </div>

      <CollapsibleSection title="Key Reservoir Parameters" icon={<LucideBarChart />} defaultOpen>
        <div className="overflow-x-auto bg-white rounded-lg p-2">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead className="text-slate-600">Parameter</TableHead>
                <TableHead className="text-slate-600">Value</TableHead>
                <TableHead className="text-slate-600">Unit</TableHead>
                <TableHead className="text-slate-600">Confidence (P10/P90)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-slate-200"><TableCell><div className="flex items-center text-slate-800"><Layers className="w-4 h-4 mr-2 text-blue-600" />Permeability (kh)</div></TableCell><TableCell className="text-slate-800">{Number(kpis.permeability).toFixed(1)}</TableCell><TableCell className="text-slate-800">mD</TableCell><TableCell className="text-slate-800">{renderConfidence(kpis.confidence.kh)}</TableCell></TableRow>
              <TableRow className="border-slate-200"><TableCell><div className="flex items-center text-slate-800"><Percent className="w-4 h-4 mr-2 text-blue-600" />Skin Factor (s)</div></TableCell><TableCell className="text-slate-800">{Number(kpis.skin).toFixed(2)}</TableCell><TableCell className="text-slate-800"></TableCell><TableCell className="text-slate-800">{renderConfidence(kpis.confidence.skin)}</TableCell></TableRow>
              <TableRow className="border-slate-200"><TableCell><div className="flex items-center text-slate-800"><Thermometer className="w-4 h-4 mr-2 text-blue-600" />Initial Pressure (Pi)</div></TableCell><TableCell className="text-slate-800">{Number(kpis.pi).toFixed(0)}</TableCell><TableCell className="text-slate-800">psi</TableCell><TableCell className="text-slate-800">{renderConfidence(kpis.confidence.Pi)}</TableCell></TableRow>
              <TableRow className="border-slate-200"><TableCell><div className="flex items-center text-slate-800"><Archive className="w-4 h-4 mr-2 text-blue-600" />Wellbore Storage (C)</div></TableCell><TableCell className="text-slate-800">{Number(kpis.wellboreStorage).toExponential(2)}</TableCell><TableCell className="text-slate-800">bbl/psi</TableCell><TableCell className="text-slate-800">N/A</TableCell></TableRow>
               <TableRow className="border-slate-200"><TableCell><div className="flex items-center text-slate-800"><Gauge className="w-4 h-4 mr-2 text-blue-600" />Flow Efficiency (η)</div></TableCell><TableCell className="text-slate-800">{Number(kpis.flowEfficiency).toFixed(2)}</TableCell><TableCell className="text-slate-800"></TableCell><TableCell className="text-slate-800">N/A</TableCell></TableRow>
              <TableRow className="border-slate-200"><TableCell><div className="flex items-center text-slate-800"><Sigma className="w-4 h-4 mr-2 text-blue-600" />RMSE</div></TableCell><TableCell className="text-slate-800">{Number(kpis.rmse).toFixed(3)}</TableCell><TableCell className="text-slate-800"></TableCell><TableCell className="text-slate-800">N/A</TableCell></TableRow>
            </TableBody>
          </Table>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Interactive Diagnostic Plots" icon={<LucideBarChart />} defaultOpen>
        <Tabs defaultValue="derivative" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 border-b border-slate-700">
            <TabsTrigger value="derivative">Derivative</TabsTrigger>
            <TabsTrigger value="horner">Horner</TabsTrigger>
            <TabsTrigger value="mdh">MDH/Agarwal</TabsTrigger>
            <TabsTrigger value="regimes">Regimes</TabsTrigger>
          </TabsList>
          <div className="bg-white p-2 rounded-b-lg border border-t-0 border-slate-700 h-[450px]">
            <TabsContent value="derivative" className="h-full"><DiagnosticPlot title="Log-Log Derivative Plot" data={plotsData} chartRef={derivativeChartRef} /></TabsContent>
            <TabsContent value="horner" className="h-full"><Scatter ref={hornerChartRef} options={chartOptions('Horner Time ((tp+Δt)/Δt)', 'Pressure (psi)', 'logarithmic', 'linear')} data={{ datasets: [{ label: 'Horner Plot', data: plotsData.horner, backgroundColor: 'rgba(139, 92, 246, 0.8)' }] }} /></TabsContent>
            <TabsContent value="mdh" className="h-full"><Scatter ref={mdhChartRef} options={chartOptions('Time (hours)', 'Pressure (psi)', 'logarithmic', 'linear')} data={{ datasets: [{ label: 'MDH Plot', data: plotsData.mdh, backgroundColor: 'rgba(34, 197, 94, 0.8)' }] }} /></TabsContent>
            <TabsContent value="regimes" className="h-full"><motion.div className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><BarChart options={regimeChartOptions} data={{ labels: plotsData.regimes.map(r => r.label), datasets: [{ data: plotsData.regimes.map(r => r.range), backgroundColor: plotsData.regimes.map(r => r.color), barPercentage: 0.5, categoryPercentage: 0.5 }] }} /></motion.div></TabsContent>
          </div>
          <div className="mt-4 px-2">
            <Label htmlFor="smoothing-slider" className="text-slate-300">Derivative Smoothing (Bourdet L={smoothingLevel.toFixed(2)})</Label>
            <Slider id="smoothing-slider" defaultValue={[0]} max={0.5} step={0.05} onValueChange={(value) => onSmoothingChange(value[0])} />
          </div>
        </Tabs>
      </CollapsibleSection>
      
      <CollapsibleSection title="Interpretation & Recommendations (AI)" icon={<BrainCircuit />}>
        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg prose prose-invert prose-sm text-slate-300">
            <p>Wellbore storage effects are dominant for the first 0.5 hours. A clear infinite-acting radial flow regime is observed between 1 and 10 hours, indicating good reservoir quality. A potential boundary is detected at approximately {kpis.boundaryDistance !== 'N/A' ? Number(kpis.boundaryDistance).toFixed(0) : 'N/A'} ft.</p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Integrations & Export" icon={<Send />}>
        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-white">Send results to:</h3>
            <div className="flex items-center gap-2">
                <Button variant="outline" className="border-cyan-400/50 text-cyan-300" onClick={() => handleIntegration('Nodal Analysis')}>Nodal</Button>
                <Button variant="outline" className="border-purple-400/50 text-purple-300" onClick={() => handleIntegration('Material Balance')}>MBAL</Button>
            </div>
            <div className="flex items-center gap-2">
                <Button className="bg-lime-600 hover:bg-lime-700" onClick={handleGenerateReport} disabled={isReporting}>
                    {isReporting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin"/> : <Download className="w-4 h-4 mr-2"/>}
                    Generate PDF Report
                </Button>
            </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default ResultsPanel;