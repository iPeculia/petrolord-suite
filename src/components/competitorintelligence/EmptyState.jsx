import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, Play } from 'lucide-react';

const EmptyState = ({ onAnalyze }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/5 border border-dashed border-white/20 rounded-xl"
    >
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 rounded-full mb-6">
        <Search className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Competitor Intelligence Hub</h2>
      <p className="text-lime-200 max-w-md mb-6">
        Define your watchlist, configure data sources, and let our AI engine aggregate and analyze competitor activities to generate actionable insights.
      </p>
      <Button onClick={onAnalyze} className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-3 text-lg px-8">
        <Play className="w-5 h-5 mr-2" />
        Analyze Demo Watchlist
      </Button>
    </motion.div>
  );
};

export default EmptyState;