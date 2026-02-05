import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Scale } from 'lucide-react';
import DataInputPanel from '@/components/mbal/DataInputPanel';
import ResultsPanel from '@/components/mbal/ResultsPanel';
import EmptyState from '@/components/mbal/EmptyState';
import { mbalCalculations } from '@/utils/mbalCalculations';
import { sampleProductionData, samplePressureData, samplePvtData } from '@/data/sampleReservoirData';
import Papa from 'papaparse';

const SAMPLE_PROD_CSV_DATA = `Date,Pressure,Cum Oil Prod (MMSTB),Cum Gas Prod (BSCF),Cum Water Prod (MMBBL)
2020-01-01,5000,0,0,0
2020-07-01,4800,1.2,1.0,0.1
2021-01-01,4550,2.5,2.1,0.25
2021-07-01,4200,4.0,3.5,0.45
2022-01-01,3800,5.8,5.2,0.7
2022-07-01,3350,8.0,7.5,1.0
2023-01-01,2900,10.5,10.0,1.5
`;

const SAMPLE_PVT_CSV_DATA = `Pressure,Bo,Rs,Bg
5000,1.4,800,0.005
4500,1.45,750,0.006
4000,1.5,700,0.007
3500,1.4,600,0.008
3000,1.3,500,0.009
2500,1.2,400,0.01
`;

const MaterialBalanceAnalysis = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [settings, setSettings] = useState({
    projectName: 'Akpo Field Phase 1',
    initialPressure: 5000,
    reservoirTemp: 200,
    swi: 0.2,
    formationCompressibility: 4e-6,
    driveMechanisms: { solutionGas: true, gasCap: false, waterInflux: false },
    gasCapRatio: 0,
    waterInfluxModel: 'schilthuis',
  });
  const [data, setData] = useState({
    production: null,
    pvt: null,
  });

  const runAnalysis = useCallback(async (currentSettings, currentData) => {
    setLoading(true);
    setResults(null);
    try {
      if (!currentData.production?.content || !currentData.pvt?.content) {
        toast({
          title: 'Missing Data',
          description: 'Please provide both production history and PVT data.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      
      const productionData = Papa.parse(currentData.production.content, { header: true, dynamicTyping: true, skipEmptyLines: true }).data;
      const pvtData = {
          inputs: { ...currentSettings },
          pvtTable: Papa.parse(currentData.pvt.content, { header: true, dynamicTyping: true, skipEmptyLines: true }).data
      };
      const pressureData = productionData.map(p => ({ date: p.Date, pressure: p.Pressure, days: (new Date(p.Date) - new Date(productionData[0].Date)) / (1000 * 60 * 60 * 24) }));

      const analysisResults = mbalCalculations({ productionData, pressureData, pvtData, aquiferResults: null });

      if (!analysisResults || !analysisResults.plotData || analysisResults.plotData.length === 0) {
        toast({
          title: 'Analysis Failed',
          description: 'Could not process the data. Check format and values.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      const { ooip, rSquared, driveIndices, warnings, regressionLine, plotData: mbalPlotData } = analysisResults;
      
      const finalResults = {
        summary: {
          N: ooip / 1e6, // to MMSTB
          m: currentSettings.gasCapRatio,
          dominantDrive: Object.keys(driveIndices).reduce((a, b) => driveIndices[a] > driveIndices[b] ? a : b),
        },
        diagnostics: { rSquared },
        plots: {
          havlenaOdeh: [
            { x: mbalPlotData.map(p => p.Et), y: mbalPlotData.map(p => p.F), mode: 'markers', type: 'scatter', name: 'Data' },
            { x: regressionLine.x, y: regressionLine.y, mode: 'lines', type: 'scatter', name: `Fit (N=${(ooip/1e6).toFixed(2)} MMSTB)` }
          ],
          pressureVsNp: [{ x: mbalPlotData.map(p => p.Np / 1e6), y: mbalPlotData.map(p => p.pressure), mode: 'lines+markers', type: 'scatter', name: 'Pressure' }],
          driveIndices: {
            labels: ['Depletion', 'Gas Cap', 'Water Influx'],
            datasets: [{
              label: 'Drive Index',
              data: [driveIndices.DDI, driveIndices.GDI, driveIndices.WDI],
              backgroundColor: ['#4ade80', '#facc15', '#60a5fa'],
            }]
          }
        },
        interpretation: `The Havlena-Odeh plot shows a strong linear trend (R² = ${rSquared.toFixed(3)}), indicating a good quality match. The estimated Original Oil in Place (OOIP) is ${(ooip/1e6).toFixed(2)} MMSTB. The dominant drive mechanism is ${Object.keys(driveIndices).reduce((a, b) => driveIndices[a] > driveIndices[b] ? a : b)}. ${warnings.join(' ')}`,
        timeSeriesData: mbalPlotData.map(p => ({...p, ...driveIndices}))
      };

      setResults(finalResults);
      toast({
        title: 'Analysis Complete',
        description: `OOIP estimated at ${finalResults.summary.N.toFixed(2)} MMSTB.`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred during analysis.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  const handleFileUpload = useCallback((file, type) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setData(prev => ({ ...prev, [type]: { fileName: file.name, content } }));
      toast({
        title: 'File Uploaded',
        description: `${file.name} is ready for analysis.`,
      });
    };
    reader.readAsText(file);
  }, [toast]);
  
  const handleAnalyze = (newSettings) => {
    setSettings(newSettings);
    runAnalysis(newSettings, data);
  };

  const handleSampleLoad = (type, content) => {
    const newSampleData = { fileName: `sample_${type}.csv`, content };
    setData(prev => ({ ...prev, [type]: newSampleData }));
  };
  
  return (
    <>
      <Helmet>
        <title>Material Balance Analysis - Petrolord Suite</title>
        <meta name="description" content="Determine drive mechanisms and estimate original oil in place using material balance equations." />
      </Helmet>
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
        <header className="p-4 border-b border-white/10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-3">
            <Scale className="w-8 h-8 text-orange-400" />
            <h1 className="text-2xl font-bold">Material Balance Analysis</h1>
          </motion.div>
        </header>
        <div className="flex-grow grid lg:grid-cols-3 xl:grid-cols-3 gap-4 p-4 overflow-hidden">
          <aside className="lg:col-span-1 xl:col-span-1 bg-black/30 backdrop-blur-sm p-4 rounded-xl border border-white/10 overflow-y-auto">
            <DataInputPanel 
              onFileUpload={handleFileUpload} 
              onAnalyze={handleAnalyze} 
              loading={loading}
              initialSettings={settings}
              uploadedData={data}
              onSampleLoad={handleSampleLoad}
              sampleProdData={SAMPLE_PROD_CSV_DATA}
              samplePvtData={SAMPLE_PVT_CSV_DATA}
            />
          </aside>
          <main className="lg:col-span-2 xl:col-span-2 bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-white/10 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-400 mx-auto"></div>
                  <p className="mt-4 text-lg">Running Analysis...</p>
                </div>
              </div>
            ) : results ? (
              <ResultsPanel results={results} settings={settings} />
            ) : (
              <EmptyState />
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default MaterialBalanceAnalysis;