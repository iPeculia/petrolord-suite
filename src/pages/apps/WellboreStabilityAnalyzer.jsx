import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import InputPanel from '@/components/wellborestability/InputPanel';
import ResultsPanel from '@/components/wellborestability/ResultsPanel';
import EmptyState from '@/components/wellborestability/EmptyState';
import { runWellboreStabilitySimulation } from '@/utils/wellboreStabilityCalculations';

const WellboreStabilityAnalyzer = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [inputs, setInputs] = useState(null);

  const handleCalculate = async (analysisInputs) => {
    setLoading(true);
    setResults(null);
    setInputs(analysisInputs);

    toast({
      title: "Analyzing Wellbore Stability... 🌍",
      description: "Running geomechanical models to determine the safe mud weight window.",
    });

    try {
      const simulationResults = await runWellboreStabilitySimulation(analysisInputs);
      setResults(simulationResults);
      toast({
        title: "Analysis Complete! ✅",
        description: `Found narrowest window of ${simulationResults.summary.narrowestWindow.toFixed(2)} ppg.`,
      });
    } catch (error) {
      console.error("Wellbore Stability Error:", error);
      toast({
        title: "Analysis Failed",
        description: "An error occurred during the geomechanical simulation.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
        projectName: 'Onshore Exploration Well 002',
        wellName: 'Well A-2 (Planned)',
        tvd: 12000,
        inclination: 30,
        porePressureGradient: 0.45,
        fractureGradient: 0.85,
        ucs: 8000,
        shmin: 0.7,
        shmax: 0.9,
        overburden: 1.0,
        poisson: 0.25,
    };
    handleCalculate(defaultInputs);
  };


  return (
    <>
      <Helmet>
        <title>Wellbore Stability Analyzer - Petrolord Suite</title>
        <meta name="description" content="Geomechanical modeling to predict safe mud weight windows." />
      </Helmet>
      <div className="flex flex-col h-screen bg-slate-900 text-white">
        <header className="flex-shrink-0 bg-slate-900/70 backdrop-blur-lg border-b border-white/10 p-2 flex items-center justify-between">
            <Link to="/dashboard/drilling">
                <Button variant="outline" size="sm" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Drilling
                </Button>
            </Link>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-full md:w-1/3 xl:w-1/4 p-4 bg-slate-900/50 backdrop-blur-lg border-r border-white/10 overflow-y-auto">
            <InputPanel 
              onCalculate={handleCalculate} 
              loading={loading}
              onProjectLoad={handleProjectLoad}
              initialInputs={inputs}
            />
          </div>
          <main className="flex-1 p-6 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
                  <p className="text-white mt-4 text-lg">Calculating...</p>
                  <p className="text-purple-300">Building geomechanical model.</p>
                </div>
              </div>
            ) : results ? (
              <ResultsPanel results={results} inputs={inputs} />
            ) : (
              <EmptyState onAnalyze={runDefaultSimulation} />
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default WellboreStabilityAnalyzer;