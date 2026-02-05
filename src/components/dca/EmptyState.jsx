import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Upload, Settings, BarChart3 } from 'lucide-react';

const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
    >
      <div className="text-center py-12">
        <TrendingDown className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Decline Curve Analysis</h2>
        <p className="text-purple-200 mb-6 max-w-2xl mx-auto">
          Upload your production data to get started. The app will help you fit a decline curve, 
          forecast future production, and estimate reserves.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          <div className="bg-white/5 rounded-lg p-4">
            <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">1. Upload Data</h3>
            <p className="text-purple-300 text-sm">Provide a CSV or Excel file with production rates.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <Settings className="w-8 h-8 text-pink-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">2. Map Columns</h3>
            <p className="text-purple-300 text-sm">Map your columns to Time, Rate, and Well.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <BarChart3 className="w-8 h-8 text-fuchsia-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">3. Analyze & Forecast</h3>
            <p className="text-purple-300 text-sm">Visualize the decline curve and review the forecast.</p>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
          <h3 className="text-lg font-semibold text-white mb-3">Backend Calculations</h3>
          <p className="text-purple-200 text-sm max-w-3xl mx-auto">
            This interface sends your data to a secure backend where advanced algorithms perform the curve fitting (e.g., using non-linear least squares) and calculate the forecast. The results are then visualized here for your analysis.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyState;