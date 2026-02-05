import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Thermometer, Play } from 'lucide-react';

    const EmptyState = ({ onAnalyze }) => {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/5 border border-dashed border-white/20 rounded-xl"
        >
          <div className="bg-gradient-to-r from-red-500 to-rose-500 p-4 rounded-full mb-6">
            <Thermometer className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Wellbore Flow Simulator</h2>
          <p className="text-slate-300 max-w-md mb-6">
            Configure your well, define the transient scenario, and run a high-fidelity simulation to analyze multiphase flow, heat transfer, and solids transport.
          </p>
          <Button onClick={onAnalyze} className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold py-3 text-lg px-8">
            <Play className="w-5 h-5 mr-2" />
            Run Demo Simulation
          </Button>
        </motion.div>
      );
    };

    export default EmptyState;