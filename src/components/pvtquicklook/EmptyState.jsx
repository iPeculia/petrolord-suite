import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Beaker, TestTube } from 'lucide-react';

const EmptyState = ({ onRunSample }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/5 border border-dashed border-white/20 rounded-xl"
    >
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full mb-6">
        <Beaker className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">PVT QuickLook</h2>
      <p className="text-lime-200 max-w-md mb-6">
        Enter your fluid properties in the left panel, or load a sample dataset to get started.
      </p>
      <Button onClick={onRunSample} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-3 text-lg px-8">
        <TestTube className="w-5 h-5 mr-2" />
        Load Sample Data
      </Button>
    </motion.div>
  );
};

export default EmptyState;