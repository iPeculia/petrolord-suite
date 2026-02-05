import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Play } from 'lucide-react';

const EmptyState = ({ onRunAnalysis }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-800/50 border border-dashed border-slate-700 rounded-xl"
    >
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-full mb-6">
        <LayoutDashboard className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Production Surveillance Dashboard</h2>
      <p className="text-lime-200 max-w-md mb-6">
        Get started by connecting to a data source or uploading data files in the 'Data Hub' tab. Or, run a demo analysis to see the dashboard in action.
      </p>
      <Button onClick={onRunAnalysis} className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 text-lg px-8">
        <Play className="w-5 h-5 mr-2" />
        Run Demo Analysis
      </Button>
    </motion.div>
  );
};

export default EmptyState;