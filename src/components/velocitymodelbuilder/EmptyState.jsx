import React from 'react';
import { motion } from 'framer-motion';
import { Layers, ArrowLeft } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md text-center"
      >
        <div className="mx-auto w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-700 shadow-xl">
          <Layers className="w-10 h-10 text-emerald-500/50" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-3">Ready to Build Model</h2>
        <p className="text-slate-400 leading-relaxed mb-8">
          Start by defining your project parameters and adding velocity layers in the panel on the left.
          Once configured, click "Build Model" to generate time-depth curves and velocity profiles.
        </p>

        <div className="grid grid-cols-2 gap-4 text-left text-sm">
            <div className="bg-slate-900/50 p-4 rounded border border-slate-800">
                <h4 className="font-semibold text-emerald-400 mb-1">Layer Definition</h4>
                <p className="text-slate-500">Define intervals with constant velocity or gradients (v = v0 + kz).</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded border border-slate-800">
                <h4 className="font-semibold text-blue-400 mb-1">Visualization</h4>
                <p className="text-slate-500">Instant QC with interactive interval velocity and time-depth plots.</p>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmptyState;