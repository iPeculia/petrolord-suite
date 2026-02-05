import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import InputPanel from '@/components/frac/InputPanel';
import ResultsPanel from '@/components/frac/ResultsPanel';
import EmptyState from '@/components/frac/EmptyState';
import { runFracSimulation } from '@/utils/fracCalculations';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const FracCompletionApp = () => {
  const [results, setResults] = useState(null);
  const [inputs, setInputs] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCalculate = (analysisInputs) => {
    setLoading(true);
    setResults(null);
    setInputs(analysisInputs);

    toast({
      title: "Simulation Started",
      description: "Running frac & completion simulation...",
    });

    setTimeout(() => {
        try {
            const analysisResults = runFracSimulation(analysisInputs);
            setResults(analysisResults);
            toast({
              title: "Simulation Complete!",
              description: "Frac & completion analysis is ready.",
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
    }, 1500);
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
        projectName: 'Wolfcamp Shale Well 4H',
        wellName: 'Well 4H',
        lateralLength: 9500,
        stages: 50,
        clustersPerStage: 4,
        pumpRate: 85,
        fluidSystem: 'Slickwater',
        proppantType: '40/70 Northern White',
        proppantConcentration: 1.5,
        totalFluidVolume: 25000,
    };
    handleCalculate(defaultInputs);
  };

  return (
    <>
      <Helmet>
        <title>Frac & Completion Designer - Petrolord Suite</title>
        <meta name="description" content="Design, simulate, and analyze hydraulic fracturing and completion jobs." />
      </Helmet>
      <div className="flex flex-col h-screen bg-slate-900 text-white">
        <header className="flex-shrink-0 bg-slate-900/70 backdrop-blur-lg border-b border-white/10 p-2 flex items-center justify-between">
            <Link to="/dashboard/drilling">
                <Button variant="outline" size="sm" className="border-rose-500/50 text-rose-300 hover:bg-rose-500/20">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Drilling
                </Button>
            </Link>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-full md:w-1/3 xl:w-1/4 p-4 bg-slate-900/50 backdrop-blur-lg border-r border-white/10 overflow-y-auto">
            <InputPanel onCalculate={handleCalculate} loading={loading} onProjectLoad={handleProjectLoad} initialInputs={inputs} />
          </div>
          <main className="flex-1 p-6 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-500 mx-auto"></div>
                      <p className="text-white mt-4 text-lg">Simulating Frac Job...</p>
                      <p className="text-rose-300">Modeling fracture geometry and proppant transport.</p>
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

export default FracCompletionApp;