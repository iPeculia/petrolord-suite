import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { generateNodalData } from '@/utils/nodalCalculations';
import InputPanel from '@/components/nodaloptimizer/InputPanel';
import ResultsPanel from '@/components/nodaloptimizer/ResultsPanel';
import EmptyState from '@/components/nodaloptimizer/EmptyState';

const NodalPerformanceOptimizer = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleOptimize = (inputs) => {
    setLoading(true);
    setResults(null);

    setTimeout(() => {
      try {
        const analysisResults = generateNodalData(inputs);
        setResults(analysisResults);
        toast({
          title: "Optimization Complete!",
          description: "Nodal analysis and optimization finished successfully.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Optimization Failed",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Real-Time Nodal Performance Optimizer - Petrolord Suite</title>
        <meta name="description" content="Real-time nodal analysis and production optimization to maximize revenue and efficiency." />
      </Helmet>
      <div className="flex h-full">
        <div className="w-full md:w-1/3 xl:w-1/4 p-6 bg-slate-900/50 backdrop-blur-lg border-r border-white/10 overflow-y-auto">
          <InputPanel onOptimize={handleOptimize} loading={loading} />
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          {!results && !loading && (
            <EmptyState onOptimize={() => handleOptimize({
              projectName: "Central Field Optimization",
              wellName: "Well-12",
              iprModel: "Vogel",
              aofp: 10000,
              reservoirPressure: 3000,
              skin: 5,
              tubingID: 3.5,
              tubingLength: 8000,
              vlpCorrelation: "Hagedorn & Brown",
              optimizationGoal: "Maximize Oil Rate",
            })} />
          )}
          {loading && (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lime-400 mx-auto"></div>
                    <p className="text-white mt-4 text-lg">Running Nodal Optimization...</p>
                    <p className="text-lime-300">Please wait while we calculate IPR and OPR curves.</p>
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
              <ResultsPanel results={results} />
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default NodalPerformanceOptimizer;