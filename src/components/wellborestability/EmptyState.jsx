import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, FileInput, BrainCircuit, BarChartHorizontal, Play } from 'lucide-react';
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
        <ShieldAlert className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Wellbore Stability Analysis</h2>
        <p className="text-purple-200 mb-6 max-w-2xl mx-auto">
          Enter your wellbore geometry, geomechanical properties, and stress state on the left to calculate the safe mud weight window, or run a default scenario to get started.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          <div className="bg-white/5 rounded-lg p-4">
            <FileInput className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">1. Define Inputs</h3>
            <p className="text-purple-300 text-sm">Enter well data, pressures, and rock properties.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <BrainCircuit className="w-8 h-8 text-pink-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">2. Calculate</h3>
            <p className="text-purple-300 text-sm">Run geomechanical models to find the safe window.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <BarChartHorizontal className="w-8 h-8 text-fuchsia-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">3. Analyze</h3>
            <p className="text-purple-300 text-sm">Review the mud window plot and risk zones.</p>
          </div>
        </div>

        <Button onClick={onAnalyze} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Play className="w-4 h-4 mr-2" />
          Run Default Simulation
        </Button>
      </div>
    </motion.div>
  );
};

export default EmptyState;