import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, BarChart3, TrendingUp, Gauge, WifiOff } from 'lucide-react';

const EmptyState = ({ apiHealthy }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
    >
      <div className="text-center py-12">
        {apiHealthy ? (
          <Droplets className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        ) : (
          <WifiOff className="w-16 h-16 text-red-400 mx-auto mb-4" />
        )}
        <h2 className="text-2xl font-bold text-white mb-4">
          {apiHealthy ? "Ready for Waterflood Analysis" : "Service Unavailable"}
        </h2>
        <p className="text-cyan-200 mb-6 max-w-2xl mx-auto">
          {apiHealthy 
            ? "Upload your daily injection and production data to start monitoring waterflood efficiency, or load sample data to explore the dashboard features."
            : "The waterflood analysis service is currently offline. Please try again later."
          }
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          <div className="bg-white/5 rounded-lg p-4">
            <BarChart3 className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">Real-time KPIs</h3>
            <p className="text-cyan-300 text-sm">Monitor water cut, VRR, and production metrics</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">Performance Charts</h3>
            <p className="text-cyan-300 text-sm">Interactive visualizations of waterflood trends</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <Gauge className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">Smart Insights</h3>
            <p className="text-cyan-300 text-sm">Automated alerts and optimization recommendations</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyState;