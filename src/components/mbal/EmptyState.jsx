import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Upload, Settings, BarChart3 } from 'lucide-react';

const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex items-center justify-center h-full"
    >
      <div className="text-center p-8 bg-black/20 rounded-2xl">
        <Scale className="w-16 h-16 text-orange-400 mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white mb-4">Material Balance Analysis</h2>
        <p className="text-orange-200 mb-6 max-w-2xl mx-auto">
          Upload production and pressure data, define your reservoir, select a model, and click "Analyze"
          to determine drive mechanisms and estimate original fluids in place.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          <div className="bg-white/5 rounded-lg p-4">
            <Upload className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">1. Upload Data</h3>
            <p className="text-orange-300 text-sm">Provide a CSV with production history and PVT data.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <Settings className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">2. Define Model</h3>
            <p className="text-orange-300 text-sm">Input properties and select drive mechanisms.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <BarChart3 className="w-8 h-8 text-pink-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">3. Analyze Results</h3>
            <p className="text-orange-300 text-sm">Visualize MBAL plots and review key parameters.</p>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-500/20">
          <h3 className="text-lg font-semibold text-white mb-3">On-Board Calculations</h3>
          <p className="text-orange-200 text-sm max-w-3xl mx-auto">
            This tool uses a powerful in-browser engine to perform all material balance calculations. Your data remains private and the analysis is delivered instantly without server delays.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyState;