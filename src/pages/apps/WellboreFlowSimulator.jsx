import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import InputPanel from '@/components/wellboreflow/InputPanel';
import ResultsPanel from '@/components/wellboreflow/ResultsPanel';
import EmptyState from '@/components/wellboreflow/EmptyState';
import { generateWellboreFlowData } from '@/utils/wellboreFlowCalculations';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const WellboreFlowSimulator = () => {
  const [results, setResults] = useState(null);
  const [inputs, setInputs] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = (analysisInputs) => {
    setLoading(true);
    setResults(null);
    setInputs(analysisInputs);

    toast({
      title: "Simulation Started",
      description: "Running high-fidelity transient simulation...",
    });

    setTimeout(() => {
      try {
        const analysisResults = generateWellboreFlowData(analysisInputs);
        setResults(analysisResults);
        toast({
          title: "Simulation Complete!",
          description: "Transient wellbore flow analysis is ready.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Simulation Failed",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    }, 2500); 
  };

  const handleProjectLoad = (project) => {
    setInputs(project.inputs_data);
    setResults(project.results_data);
    toast({
        title: "Project Loaded",
        description: `Successfully loaded "${project.project_name}".`
    });
  };

  const runDefaultSimulation = () => {
    const defaultInputs = {
      projectName: 'Deepwater Well Start-up',
      simulationType: 'Start-up',
      simulationTime: 120, // minutes
      wellDepth: 12000, // ft
      tubingID: 4.5, // inches
      casingID: 7, // inches
      geothermalGradient: 1.5, // °F/100ft
      surfaceTemp: 60, // °F
      seabedTemp: 40, // °F
      waterDepth: 3000, // ft
      inflowRate: 5000, // bbl/d
      gasOilRatio: 1200, // scf/stb
      waterCut: 15, // %
      sandProduction: 10, // lb/1000bbl
    };
    handleAnalyze(defaultInputs);
  };

  return (
    <>
      <Helmet>
        <title>Wellbore Flow Simulator - Petrolord Suite</title>
        <meta name="description" content="High-fidelity, transient simulation of multiphase flow and thermal dynamics within the wellbore." />
      </Helmet>
      <div className="flex flex-col h-screen bg-slate-900 text-white">
        <header className="flex-shrink-0 bg-slate-900/70 backdrop-blur-lg border-b border-white/10 p-2 flex items-center justify-between">
          <Link to="/dashboard/production">
              <Button variant="outline" size="sm" className="border-red-500/50 text-red-300 hover:bg-red-500/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Production
              </Button>
          </Link>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-full md:w-1/3 xl:w-1/4 p-6 bg-slate-900/50 backdrop-blur-lg border-r border-white/10 overflow-y-auto">
            <InputPanel onAnalyze={handleAnalyze} loading={loading} onProjectLoad={handleProjectLoad} initialInputs={inputs} />
          </div>
          <main className="flex-1 p-6 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto"></div>
                      <p className="text-white mt-4 text-lg">Running Transient Simulation...</p>
                      <p className="text-red-300">This high-fidelity model may take a moment.</p>
                  </div>
              </div>
            ) : results ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ResultsPanel results={results} inputs={inputs} />
              </motion.div>
            ) : (
              <EmptyState onAnalyze={runDefaultSimulation} />
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default WellboreFlowSimulator;