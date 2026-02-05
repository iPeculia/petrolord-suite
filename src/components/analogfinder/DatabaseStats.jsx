import React from 'react';
import { motion } from 'framer-motion';
import { Database, Globe, Search, TrendingUp } from 'lucide-react';
import { getDatabaseStats } from '@/utils/analogfinderCalculations';

const DatabaseStats = () => {
  const stats = getDatabaseStats();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 mb-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Database className="w-5 h-5 mr-2 text-green-400" />
        Analog Database Status
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <Globe className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-white">{stats.totalAnalogs}</div>
          <div className="text-xs text-lime-300">Total Analogs</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <Search className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-white">{stats.totalSearches}</div>
          <div className="text-xs text-lime-300">Searches Run</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <TrendingUp className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-white">{stats.countries}</div>
          <div className="text-xs text-lime-300">Countries</div>
        </div>
        
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <Database className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-white">{stats.lithologies}</div>
          <div className="text-xs text-lime-300">Lithologies</div>
        </div>
      </div>
      
      {stats.lastUpdated && (
        <p className="text-xs text-lime-300 mt-3 text-center">
          Last updated: {new Date(stats.lastUpdated).toLocaleDateString()}
        </p>
      )}
      
      <div className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
        <p className="text-green-200 text-sm">
          🤖 <strong>AI-Enhanced Search:</strong> Database grows with each search. AI generates new analogs when local results are limited, building a comprehensive global repository.
        </p>
      </div>
    </motion.div>
  );
};

export default DatabaseStats;