import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { generateLogData } from '@/utils/logDataGenerator';
import InputPanel from '@/components/logdataviz/InputPanel';
import ResultsPanel from '@/components/logdataviz/ResultsPanel';
import EmptyState from '@/components/logdataviz/EmptyState';

const LogDataQCViz = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = (inputs) => {
    setLoading(true);
    setResults(null);

    setTimeout(() => {
      try {
        const generatedResults = generateLogData(inputs);
        setResults(generatedResults);
        toast({
          title: "QC & Visualization Complete!",
          description: "Your well log data is processed and ready for review.",
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
    }, 2500);
  };

  const initialInputs = {
    projectName: "Block X Appraisal Campaign",
    wellName: "Well A-1",
    startDepth: 2000,
    endDepth: 2500,
  };

  return (
    <>
      <Helmet>
        <title>Log Data QC & Viz - Petrolord Suite</title>
        <meta name="description" content="Quality control and visualization for well log data." />
      </Helmet>
      <div className="flex h-full">
        <div className="w-full md:w-2/5 xl:w-1/3 p-6 bg-slate-900/50 backdrop-blur-lg border-r border-white/10 overflow-y-auto">
          <InputPanel onGenerate={handleGenerate} loading={loading} initialInputs={initialInputs} />
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          {!results && !loading && (
            <EmptyState onGenerate={() => handleGenerate(initialInputs)} />
          )}
          {loading && (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lime-400 mx-auto"></div>
                    <p className="text-white mt-4 text-lg">Processing LAS file...</p>
                    <p className="text-lime-300">Running QC checks and generating plots.</p>
                </div>
            </div>
          )}
          {results && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              <ResultsPanel results={results} />
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default LogDataQCViz;