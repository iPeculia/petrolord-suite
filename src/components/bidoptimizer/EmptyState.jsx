import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Target, Play } from 'lucide-react';

const EmptyState = ({ onAnalyze }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/5 border border-dashed border-white/20 rounded-xl"
    >
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-full mb-6">
        <Target className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Oil Block Bid Strategy Optimizer</h2>
      <p className="text-lime-200 max-w-md mb-6">
        Define your blocks, set constraints, and let our AI-powered engine recommend the optimal bid strategy to maximize your portfolio's value.
      </p>
      <Button onClick={onAnalyze} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 text-lg px-8">
        <Play className="w-5 h-5 mr-2" />
        Run Demo Optimization
      </Button>
    </motion.div>
  );
};

export default EmptyState;