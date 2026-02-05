import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GitBranch, Play } from 'lucide-react';

const EmptyState = ({ onOptimize }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/5 border border-dashed border-white/20 rounded-xl"
    >
      <div className="bg-gradient-to-r from-blue-500 to-sky-500 p-4 rounded-full mb-6">
        <GitBranch className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Real-Time Nodal Performance Optimizer</h2>
      <p className="text-lime-200 max-w-md mb-6">
        Configure your well, define inflow performance, set optimization targets, and run the analysis to find the optimal operating point.
      </p>
      <Button onClick={onOptimize} className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-semibold py-3 text-lg px-8">
        <Play className="w-5 h-5 mr-2" />
        Run Demo Optimization
      </Button>
    </motion.div>
  );
};

export default EmptyState;