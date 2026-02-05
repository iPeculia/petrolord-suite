import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { UploadCloud, Play } from 'lucide-react';

const EmptyState = ({ onUploadClick, onLoadDemo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-800/50 border border-dashed border-gray-600 rounded-xl"
    >
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full mb-6 shadow-lg">
        <UploadCloud className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Seismic Interpreter</h2>
      <p className="text-gray-300 max-w-md mb-6">
        Upload a SEG-Y file to visualize seismic sections, or start with our demo data to explore the features.
      </p>
      <Button onClick={onLoadDemo} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 text-lg px-8">
        <Play className="w-5 h-5 mr-2" />
        Load Demo Data
      </Button>
    </motion.div>
  );
};

export default EmptyState;