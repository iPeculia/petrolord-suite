import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, FileInput, BrainCircuit, BarChart, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmptyState = ({ onAnalyze }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 h-full flex flex-col justify-center"
    >
      <div className="text-center py-12">
        <RotateCcw className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Torque & Drag Analysis</h2>
        <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
          Define your well trajectory, drill string, and operational parameters on the left, or run a default simulation to get started.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          <div className="bg-white/5 rounded-lg p-4">
            <FileInput className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">1. Define Inputs</h3>
            <p className="text-slate-400 text-sm">Enter trajectory, string components, and fluid data.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <BrainCircuit className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">2. Simulate</h3>
            <p className="text-slate-400 text-sm">Run complex friction models for each scenario.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <BarChart className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">3. Review Results</h3>
            <p className="text-slate-400 text-sm">Analyze T&D plots and check against operational limits.</p>
          </div>
        </div>
        
        <Button onClick={onAnalyze} className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
          <Play className="w-4 h-4 mr-2" />
          Run Default Simulation
        </Button>
      </div>
    </motion.div>
  );
};

export default EmptyState;