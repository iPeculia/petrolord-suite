import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { generateCompetitorData } from '@/utils/competitorIntelligenceCalculations';
import InputPanel from '@/components/competitorintelligence/InputPanel';
import Dashboard from '@/components/competitorintelligence/Dashboard';
import EmptyState from '@/components/competitorintelligence/EmptyState';

const CompetitorIntelligenceHub = () => {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalysis = (inputs) => {
    setLoading(true);
    setAnalysisResults(null);

    setTimeout(() => {
      try {
        const results = generateCompetitorData(inputs);
        setAnalysisResults(results);
        toast({
          title: "Intelligence Report Generated!",
          description: "Your competitor analysis dashboard is ready.",
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
    competitors: [
      { name: 'Shell', type: 'Major IOC', regions: 'Global, Niger Delta (Nigeria)' },
      { name: 'ExxonMobil', type: 'Major IOC', regions: 'Global, Permian Basin' },
      { name: 'Chevron', type: 'Major IOC', regions: 'Global, Permian Basin' },
    ],
    strategicKeywords: 'decarbonization, LNG expansion, carbon capture, new energy',
    operationalKeywords: 'kick, loss, drill rig, FPSO deployment',
  };

  return (
    <>
      <Helmet>
        <title>Competitor Intelligence Hub - Petrolord Suite</title>
        <meta name="description" content="Aggregate and analyze competitor activity, performance, and strategic moves." />
      </Helmet>
      <div className="flex h-full">
        <div className="w-full md:w-2/5 xl:w-1/3 p-6 bg-slate-900/50 backdrop-blur-lg border-r border-white/10 overflow-y-auto">
          <InputPanel onAnalyze={handleAnalysis} loading={loading} initialInputs={initialInputs} />
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          {!analysisResults && !loading && (
            <EmptyState onAnalyze={() => handleAnalysis(initialInputs)} />
          )}
          {loading && (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lime-400 mx-auto"></div>
                    <p className="text-white mt-4 text-lg">Analyzing Competitor Data...</p>
                    <p className="text-lime-300">Aggregating news, filings, and reports.</p>
                </div>
            </div>
          )}
          {analysisResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              <Dashboard results={analysisResults} />
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompetitorIntelligenceHub;