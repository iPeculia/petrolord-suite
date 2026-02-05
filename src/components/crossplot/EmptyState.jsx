import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BarChart2, UploadCloud } from 'lucide-react';

const EmptyState = ({ onUploadClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/5 border border-dashed border-white/20 rounded-xl"
    >
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-full mb-6">
        <BarChart2 className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Crossplot Generator</h2>
      <p className="text-lime-200 max-w-md mb-6">
        Upload a LAS or CSV file to generate interactive Density-Neutron and Pickett plots for advanced petrophysical analysis.
      </p>
      <Button onClick={onUploadClick} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 text-lg px-8">
        <UploadCloud className="w-5 h-5 mr-2" />
        Upload Log File
      </Button>
    </motion.div>
  );
};

export default EmptyState;