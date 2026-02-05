import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardX as ClipboardPen, MapPin, Wrench, Zap } from 'lucide-react';

const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
    >
      <div className="text-center py-12">
        <ClipboardPen className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Well-Cost Snap Pro</h2>
        <p className="text-lime-200 mb-6 max-w-2xl mx-auto">
          Start by defining your well's location and type. Then, input key cost drivers or use our AI to get suggestions based on market data, and finally, calculate your cost estimate.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          <div className="bg-white/5 rounded-lg p-4">
            <MapPin className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">1. Define Well</h3>
            <p className="text-lime-300 text-sm">Select region and well type to set the context.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <Wrench className="w-8 h-8 text-teal-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">2. Input Drivers</h3>
            <p className="text-lime-300 text-sm">Enter cost parameters or get suggestions.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <Zap className="w-8 h-8 text-lime-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">3. Calculate</h3>
            <p className="text-lime-300 text-sm">Get P10/P50/P90 costs and see visualizations.</p>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-lg border border-cyan-500/20">
          <h3 className="text-lg font-semibold text-white mb-3">Backend Integration</h3>
          <p className="text-lime-200 text-sm max-w-3xl mx-auto">
            The "Get Suggestions" feature communicates with a dedicated backend service. This service analyzes a database of historical project data to provide relevant, market-based estimates for rig rates, service spreads, and drilling durations, helping you create more accurate forecasts.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyState;