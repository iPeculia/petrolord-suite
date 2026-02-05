import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Zap, ArrowLeft } from 'lucide-react';
import InputPanel from '@/components/rto/InputPanel';
import ResultsPanel from '@/components/rto/ResultsPanel';
import EmptyState from '@/components/rto/EmptyState';
// Note: This is a placeholder for a future simulation function
const runRtoSimulation = (inputs) => {
  return new Promise(resolve => {
    setTimeout(() => {
        const liveData = {
            latest_sample: {
                depth_m: 2500.5,
                rop_m_hr: 15.2,
                wob_klbf: 35.1,
                rpm: 120,
                hookload_klbf: 180.4,
                ecd_sg: 1.25,
            },
            history: [
                { x: [1,2,3,4,5], y: [14.8, 15.1, 15.2, 15.5, 15.2], name: 'ROP' },
                { x: [1,2,3,4,5], y: [34.5, 35.0, 35.1, 35.5, 34.9], name: 'WOB' },
            ],
        };
        const recommendation = {
            wob_klbf: 36.0,
            rpm: 125,
            reason: "Optimizing for ROP while maintaining stability.",
        };
        const alerts = [
            { id: 1, message: 'Vibration levels approaching threshold in BHA.'}
        ];
        const connections = [
            {id: 1, start_ts: new Date().toISOString(), conn_time_sec: 125}
        ];
      resolve({ liveData, recommendation, alerts, connections });
    }, 1500);
  });
};

const RtoDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [inputs, setInputs] = useState(null);

  const handleCalculate = async (analysisInputs) => {
    setLoading(true);
    setResults(null);
    setInputs(analysisInputs);

    toast({
      title: "Connecting to Live Rig Data... 📡",
      description: "Initializing RTO engine and fetching parameters.",
    });

    try {
      const simulationResults = await runRtoSimulation(analysisInputs);
      setResults(simulationResults);
      toast({
        title: "Connection Successful! ✅",
        description: `Live data stream is active for ${analysisInputs.wellName}.`,
      });
    } catch (error) {
      console.error("RTO Error:", error);
      toast({
        title: "Connection Failed",
        description: "An error occurred while connecting to the RTO service.",
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
        projectName: 'Deepwater Driller X-9',
        wellName: 'Well DW-34H',
        wob_min_klbf: 20,
        wob_max_klbf: 60,
        rpm_min: 80,
        rpm_max: 150,
        td_warn_klbf: 220,
        td_crit_klbf: 240,
        enabled: true,
    };
    handleCalculate(defaultInputs);
  };


  return (
    <>
      <Helmet>
        <title>Real-Time Drilling Optimization - Petrolord Suite</title>
        <meta name="description" content="Live parameter optimization using machine learning." />
      </Helmet>
      <div className="flex flex-col h-screen bg-slate-900 text-white">
        <header className="flex-shrink-0 bg-slate-900/70 backdrop-blur-lg border-b border-white/10 p-2 flex items-center justify-between">
            <Link to="/dashboard/drilling">
                <Button variant="outline" size="sm" className="border-lime-500/50 text-lime-300 hover:bg-lime-500/20">
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
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto"></div>
                  <p className="text-white mt-4 text-lg">Connecting...</p>
                  <p className="text-lime-300">Establishing link to WITSML server.</p>
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

export default RtoDashboard;