import React, { useState } from 'react';
    import { Helmet } from 'react-helmet';
    import { motion } from 'framer-motion';
    import { useToast } from '@/components/ui/use-toast';
    import { generateFlowAssuranceData } from '@/utils/flowAssuranceCalculations';
    import InputPanel from '@/components/flowassurance/InputPanel';
    import ResultsPanel from '@/components/flowassurance/ResultsPanel';
    import EmptyState from '@/components/flowassurance/EmptyState';
    import { Button } from '@/components/ui/button';
    import { ArrowLeft } from 'lucide-react';
    import { Link } from 'react-router-dom';

    const FlowAssuranceMonitor = () => {
      const [results, setResults] = useState(null);
      const [inputs, setInputs] = useState(null);
      const [loading, setLoading] = useState(false);
      const { toast } = useToast();

      const handleAnalyze = (analysisInputs) => {
        setLoading(true);
        setResults(null);
        setInputs(analysisInputs);

        setTimeout(() => {
          try {
            const analysisResults = generateFlowAssuranceData(analysisInputs);
            setResults(analysisResults);
            toast({
              title: "Analysis Complete!",
              description: "Flow assurance risks have been calculated.",
            });
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Analysis Failed",
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

      return (
        <>
          <Helmet>
            <title>Flow Assurance Predictor - Petrolord Suite</title>
            <meta name="description" content="Proactively monitor and mitigate hydrate, wax, scale, and corrosion risks." />
          </Helmet>
          <div className="flex flex-col h-screen bg-slate-900 text-white">
            <header className="flex-shrink-0 bg-slate-900/70 backdrop-blur-lg border-b border-white/10 p-2 flex items-center justify-between">
              <Link to="/dashboard/production">
                  <Button variant="outline" size="sm" className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20">
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
                  {!results && !loading && (
                    <EmptyState onAnalyze={() => handleAnalyze({
                      projectName: "Gas Condensate Pipeline Integrity",
                      pipelineLength: 10000,
                      inletPressure: 2000,
                      inletTemperature: 150,
                      outletPressure: 1000,
                      ambientTemperature: 40,
                      apiGravity: 45,
                      gor: 2500,
                      waterCut: 10,
                      co2: 2.5,
                      h2s: 0.1,
                    })} />
                  )}
                  {loading && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lime-400 mx-auto"></div>
                            <p className="text-white mt-4 text-lg">Predicting Flow Assurance Risks...</p>
                            <p className="text-lime-300">Please wait while we run thermodynamic models.</p>
                        </div>
                    </div>
                  )}
                  {results && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <ResultsPanel results={results} inputs={inputs} />
                    </motion.div>
                  )}
                </main>
            </div>
          </div>
        </>
      );
    };

    export default FlowAssuranceMonitor;