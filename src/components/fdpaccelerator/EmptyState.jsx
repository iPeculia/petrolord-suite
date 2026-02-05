import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FilePlus2, Play } from 'lucide-react';

const EmptyState = ({ onGenerate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/5 border border-dashed border-white/20 rounded-xl"
    >
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full mb-6">
        <FilePlus2 className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Field Development Plan Accelerator</h2>
      <p className="text-lime-200 max-w-md mb-6">
        Input your project data, select a template, and let our AI engine generate a comprehensive FDP draft in seconds.
      </p>
      <Button onClick={onGenerate} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 text-lg px-8">
        <Play className="w-5 h-5 mr-2" />
        Generate Demo FDP
      </Button>
    </motion.div>
  );
};

export default EmptyState;