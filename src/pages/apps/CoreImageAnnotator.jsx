import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { generateCoreAnnotations } from '@/utils/coreAnnotatorGenerator';
import InputPanel from '@/components/coreannotator/InputPanel';
import ResultsPanel from '@/components/coreannotator/ResultsPanel';
import EmptyState from '@/components/coreannotator/EmptyState';

const CoreImageAnnotator = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = (inputs) => {
    setLoading(true);
    setResults(null);

    setTimeout(() => {
      try {
        const generatedResults = generateCoreAnnotations(inputs);
        setResults(generatedResults);
        toast({
          title: "Analysis Complete!",
          description: "AI annotations and strip log are ready for review.",
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
    projectName: "Deepwater Basin Core Study",
    wellName: "Well X-1 Core 2",
    topDepth: 3000,
    baseDepth: 3050,
  };

  return (
    <>
      <Helmet>
        <title>Core-Image Annotator - Petrolord Suite</title>
        <meta name="description" content="AI-powered core image annotation and strip log generation." />
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
                    <p className="text-white mt-4 text-lg">Analyzing Core Images...</p>
                    <p className="text-lime-300">Applying CV models to detect lithofacies.</p>
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

export default CoreImageAnnotator;