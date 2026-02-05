import React from 'react';
import { motion } from 'framer-motion';
import { Zap, FileInput, BrainCircuit, Activity, Play } from 'lucide-react';
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
        <Zap className="w-16 h-16 text-lime-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Real-Time Drilling Optimization</h2>
        <p className="text-lime-200 mb-6 max-w-2xl mx-auto">
          Set your optimization parameters on the left to connect to a live data stream, or run a default simulation to see the RTO engine in action.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          <div className="bg-white/5 rounded-lg p-4">
            <FileInput className="w-8 h-8 text-lime-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">1. Define Parameters</h3>
            <p className="text-lime-300 text-sm">Set WOB, RPM, and other operational limits.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <BrainCircuit className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">2. Connect & Optimize</h3>
            <p className="text-lime-300 text-sm">AI engine analyzes live data and provides recommendations.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <Activity className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">3. Monitor Live</h3>
            <p className="text-lime-300 text-sm">View live KPIs, plots, alerts, and connection times.</p>
          </div>
        </div>

        <Button onClick={onAnalyze} className="bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700">
          <Play className="w-4 h-4 mr-2" />
          Run Default Simulation
        </Button>
      </div>
    </motion.div>
  );
};

export default EmptyState;