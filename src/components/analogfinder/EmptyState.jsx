import React from 'react';
import { motion } from 'framer-motion';
import { Search, Target, BarChart3, Layers, Brain, Database } from 'lucide-react';
import DatabaseStats from './DatabaseStats';

const EmptyState = () => {
  return (
    <>
      <DatabaseStats />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6"
      >
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Ready for AI-Powered Analog Search</h2>
          <p className="text-lime-200 mb-6">
            Enter your field characteristics and click "Find Analogs" to discover similar reservoirs using our intelligent search system.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-white/5 rounded-lg p-4">
              <Brain className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">AI-Powered Matching</h3>
              <p className="text-lime-300 text-sm">Advanced AI generates new analogs when database results are limited</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <Database className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Growing Database</h3>
              <p className="text-lime-300 text-sm">Each search adds new analogs, building comprehensive global coverage</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <BarChart3 className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <h3 className="text-white font-semibold mb-1">Smart Search Logic</h3>
              <p className="text-lime-300 text-sm">Searches database first, then uses AI to fill gaps intelligently</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-6 border border-green-500/20">
            <h3 className="text-lg font-semibold text-white mb-3">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start space-x-3">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">1</div>
                <div>
                  <p className="text-white font-medium">Database Search</p>
                  <p className="text-lime-300">Searches local database for existing matches</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">2</div>
                <div>
                  <p className="text-white font-medium">AI Generation</p>
                  <p className="text-lime-300">AI creates new analogs if more results needed</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">3</div>
                <div>
                  <p className="text-white font-medium">Database Growth</p>
                  <p className="text-lime-300">New analogs stored for future searches</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default EmptyState;