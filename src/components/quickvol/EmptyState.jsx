import React from 'react';
import { motion } from 'framer-motion';
import { Database, CheckCircle, Settings } from 'lucide-react';

const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
    >
      <div className="text-center py-12">
        <Database className="w-16 h-16 text-lime-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Ready for Analysis</h2>
        <p className="text-lime-200 mb-6">
          Enter your reservoir parameters and click "Run QuickVol" to generate P10/P50/P90 volumetrics estimates.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="bg-white/5 rounded-lg p-4">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">Monte Carlo Simulation</h3>
            <p className="text-lime-300 text-sm">Statistical analysis with uncertainty quantification</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <Settings className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">ML Analog Matching</h3>
            <p className="text-lime-300 text-sm">AI-powered field comparison and adjustment factors</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyState;