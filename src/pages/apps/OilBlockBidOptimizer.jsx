import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { generateBidStrategy } from '@/utils/bidOptimizerCalculations';
import InputPanel from '@/components/bidoptimizer/InputPanel';
import ResultsPanel from '@/components/bidoptimizer/ResultsPanel';
import EmptyState from '@/components/bidoptimizer/EmptyState';

const OilBlockBidOptimizer = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = (inputs) => {
    setLoading(true);
    setResults(null);

    setTimeout(() => {
      try {
        const analysisResults = generateBidStrategy(inputs);
        setResults(analysisResults);
        toast({
          title: "Optimization Complete!",
          description: "Optimal bid strategy has been calculated.",
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
    }, 2000);
  };
  
  const initialInputs = {
    bidRoundName: "Senegal Offshore Bid Round 2024",
    totalBidBudget: 200, // $MM
    riskTolerance: 'Medium',
    objectives: ['Maximize EMV'],
    blocks: [
      {
        id: 1,
        name: 'Block A-1',
        posg: 30,
        oil_p10: 100, oil_p50: 250, oil_p90: 500,
        capex_p10: 800, capex_p50: 1000, capex_p90: 1300,
        opex_p10: 8, opex_p50: 10, opex_p90: 12,
        bidAmount: 50,
      },
      {
        id: 2,
        name: 'Block B-2',
        posg: 25,
        oil_p10: 150, oil_p50: 350, oil_p90: 700,
        capex_p10: 1200, capex_p50: 1500, capex_p90: 2000,
        opex_p10: 7, opex_p50: 9, opex_p90: 11,
        bidAmount: 80,
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Oil Block Bid Strategy Optimizer - Petrolord Suite</title>
        <meta name="description" content="Strategic bid round optimization with probabilistic analysis and portfolio management." />
      </Helmet>
      <div className="flex h-full">
        <div className="w-full md:w-1/3 xl:w-1/4 p-6 bg-slate-900/50 backdrop-blur-lg border-r border-white/10 overflow-y-auto">
          <InputPanel onAnalyze={handleAnalyze} loading={loading} initialInputs={initialInputs} />
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          {!results && !loading && (
            <EmptyState onAnalyze={() => handleAnalyze(initialInputs)} />
          )}
          {loading && (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-lime-400 mx-auto"></div>
                    <p className="text-white mt-4 text-lg">Running Portfolio Optimization...</p>
                    <p className="text-lime-300">Please wait while we calculate the optimal bid strategy.</p>
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

export default OilBlockBidOptimizer;