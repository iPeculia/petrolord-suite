import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { DollarSign, ArrowLeft } from 'lucide-react';
import InputPanel from '@/components/fiscalcomparator/InputPanel';
import ResultsPanel from '@/components/fiscalcomparator/ResultsPanel';
import EmptyState from '@/components/fiscalcomparator/EmptyState';
import { runFiscalComparison } from '@/utils/fiscalComparatorCalculations';

const FiscalRegimeComparator = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleRunComparison = async (inputs) => {
    setLoading(true);
    setResults(null);
    toast({
      title: "Running Fiscal Comparison... 📊",
      description: `Comparing ${inputs.regimes.length} fiscal regimes. This may take a moment.`,
    });

    try {
      const comparisonResults = await runFiscalComparison(inputs);
      setResults(comparisonResults);
      toast({
        title: "Comparison Complete! ✅",
        description: `Successfully analyzed the fiscal regimes.`,
      });
    } catch (error) {
      console.error("Fiscal Comparison Error:", error);
      toast({
        title: "Comparison Failed",
        description: "An error occurred during the fiscal simulation.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Fiscal Regime Comparator - Petrolord Suite</title>
        <meta name="description" content="Side-by-side comparison of oil and gas fiscal regimes." />
      </Helmet>
      <div className="p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link to="/dashboard/economic-risk">
              <Button variant="outline" size="sm" className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Economic & Risk
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white">Fiscal Regime Comparator</h1>
              <p className="text-lime-200 text-md md:text-lg">Side-by-Side Economic & Fiscal Analysis</p>
            </div>
          </div>
        </motion.div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/5">
            <InputPanel onRunComparison={handleRunComparison} loading={loading} />
          </div>
          <div className="lg:w-3/5">
            {loading ? (
              <div className="flex items-center justify-center h-full bg-white/5 rounded-xl border border-white/10 p-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto"></div>
                  <p className="text-white mt-4 text-lg">Comparing Regimes...</p>
                  <p className="text-lime-300">Please wait, running complex calculations.</p>
                </div>
              </div>
            ) : results ? (
              <ResultsPanel results={results} />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FiscalRegimeComparator;