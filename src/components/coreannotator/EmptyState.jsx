import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Camera, Play } from 'lucide-react';

const EmptyState = ({ onGenerate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/5 border border-dashed border-white/20 rounded-xl"
    >
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-full mb-6">
        <Camera className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Core-Image Annotator</h2>
      <p className="text-lime-200 max-w-md mb-6">
        Upload your core photos and let our AI assistant detect lithofacies, add depth stamps, and generate a high-quality strip log automatically.
      </p>
      <Button onClick={onGenerate} className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 text-lg px-8">
        <Play className="w-5 h-5 mr-2" />
        Analyze Demo Core
      </Button>
    </motion.div>
  );
};

export default EmptyState;