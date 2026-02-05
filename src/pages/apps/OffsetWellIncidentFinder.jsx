import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { FileSearch, ArrowLeft } from 'lucide-react';
import FilterPanel from '@/components/incidentfinder/FilterPanel';
import ResultsPanel from '@/components/incidentfinder/ResultsPanel';
import EmptyState from '@/components/incidentfinder/EmptyState';

const OffsetWellIncidentFinder = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleSearch = async (filters) => {
    setLoading(true);
    setResults(null);
    toast({
      title: "Engaging AI Search Engine... 🧠",
      description: "Scanning global incident database for relevant events.",
    });

    try {
      const { data, error } = await supabase.functions.invoke('incident-finder-engine', {
        body: JSON.stringify({ filters }),
      });

      if (error) throw error;

      if (!data) {
        throw new Error("No data returned from AI engine.");
      }

      setResults(data);
      toast({
        title: "AI Search Complete! ✅",
        description: `Found ${data.summary.totalFound} incidents and generated key insights.`,
        className: "bg-green-600 text-white border-green-700",
      });
    } catch (error) {
      console.error("Incident Finder Error:", error);
      toast({
        title: "Search Failed",
        description: error.message || "An error occurred while querying the AI incident engine.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Global Incident Intelligence - Petrolord Suite</title>
        <meta name="description" content="AI-powered search and analysis of global drilling incidents." />
      </Helmet>
      <div className="flex flex-col h-full bg-slate-900 text-white">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="p-4 md:p-6 border-b border-slate-700 bg-slate-800/50 backdrop-blur-lg">
           <div className="flex items-center space-x-4 mb-4">
            <Link to="/dashboard/drilling">
              <Button variant="outline" size="sm" className="border-lime-400/50 text-lime-300 hover:bg-lime-500/20 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <div className="flex items-start md:items-center space-x-4">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl mt-1">
              <FileSearch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-white">Global Incident Intelligence</h1>
              <p className="text-lime-200 text-sm md:text-md">AI-Powered Analysis of Historical Drilling Events</p>
            </div>
          </div>
        </motion.div>

        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5 p-4 md:p-6 overflow-y-auto bg-slate-800/30 border-r border-slate-700">
            <FilterPanel onSearch={handleSearch} loading={loading} />
          </div>
          <main className="flex-grow p-4 md:p-6 overflow-y-auto">
             {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto"></div>
                  <p className="text-white mt-4 text-lg">Querying AI Engine...</p>
                  <p className="text-lime-300">Analyzing terabytes of global data.</p>
                </div>
              </div>
            ) : results ? (
              <ResultsPanel results={results} />
            ) : (
              <EmptyState />
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default OffsetWellIncidentFinder;