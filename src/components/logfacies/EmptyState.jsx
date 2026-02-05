import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BrainCircuit, UploadCloud } from 'lucide-react';

const EmptyState = ({ onUploadClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-700"
    >
      <div className="p-6 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full mb-6 shadow-lg shadow-rose-500/20">
        <BrainCircuit className="w-16 h-16 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">Log Facies Analysis</h2>
      <p className="text-lg text-lime-200 max-w-md mb-8">
        Unlock geological insights by identifying rock types from well logs using powerful machine learning algorithms.
      </p>
      <Button
        onClick={onUploadClick}
        className="bg-gradient-to-r from-lime-400 to-green-500 text-white font-bold py-3 px-6 text-lg hover:scale-105 transition-transform"
      >
        <UploadCloud className="w-6 h-6 mr-3" />
        Upload LAS/CSV File
      </Button>
      <p className="text-sm text-gray-400 mt-4">
        Start by uploading your well log data to begin the analysis.
      </p>
    </motion.div>
  );
};

export default EmptyState;