import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Layers, UploadCloud } from 'lucide-react';

const EmptyState = ({ onUpload }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/5 border-2 border-dashed border-white/20 rounded-xl"
    >
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-4 rounded-full mb-6 shadow-lg shadow-cyan-500/30">
        <Layers className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Contour Map Digitizer</h2>
      <p className="text-lime-200 max-w-md mb-8">
        Upload a map image, geo-reference it, and let our AI detect contours to generate a 3D surface grid.
      </p>
      <Button 
        onClick={onUpload} 
        className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-3 text-lg px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <UploadCloud className="w-5 h-5 mr-3" />
        Upload Map to Get Started
      </Button>
    </motion.div>
  );
};

export default EmptyState;