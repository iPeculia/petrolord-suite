import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Filter, Map, BarChart2, BrainCircuit } from 'lucide-react';

const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-800/30 rounded-xl p-6 h-full flex flex-col justify-center items-center border border-slate-700"
    >
      <div className="text-center py-12">
        <div className="relative w-24 h-24 mx-auto mb-6">
            <BrainCircuit className="absolute w-20 h-20 text-green-400 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
            <FileSearch className="relative w-16 h-16 text-green-400 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Global Incident Intelligence</h2>
        <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
          Leverage our AI engine to scan a global database of drilling reports. Uncover historical incidents, identify regional trends, and receive actionable recommendations to de-risk your operations.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-slate-700/50 rounded-lg p-4 text-left">
            <Filter className="w-6 h-6 text-green-400 mb-2" />
            <h3 className="text-white font-semibold">Filter Precisely</h3>
            <p className="text-slate-400 text-sm">Narrow your search by location, incident type, depth, and more.</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 text-left">
            <Map className="w-6 h-6 text-emerald-400 mb-2" />
            <h3 className="text-white font-semibold">Visualize Globally</h3>
            <p className="text-slate-400 text-sm">See incident locations geographically to spot clusters and trends.</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 text-left">
            <BarChart2 className="w-6 h-6 text-teal-400 mb-2" />
            <h3 className="text-white font-semibold">Analyze by Depth</h3>
            <p className="text-slate-400 text-sm">Identify critical depth intervals with recurring issues.</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4 text-left">
            <BrainCircuit className="w-6 h-6 text-cyan-400 mb-2" />
            <h3 className="text-white font-semibold">Get AI Insights</h3>
            <p className="text-slate-400 text-sm">Receive summaries and mitigation strategies from the AI engine.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyState;