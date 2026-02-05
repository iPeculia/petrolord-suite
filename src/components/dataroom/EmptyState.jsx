import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FolderSync, Play } from 'lucide-react';

const EmptyState = ({ onGenerate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/5 border border-dashed border-white/20 rounded-xl"
    >
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-4 rounded-full mb-6">
        <FolderSync className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Deal Data Room Automator</h2>
      <p className="text-lime-200 max-w-md mb-6">
        Set up a new data room, define its structure, upload documents, and manage permissions to begin your M&A or farm-out process.
      </p>
      <Button onClick={onGenerate} className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-3 text-lg px-8">
        <Play className="w-5 h-5 mr-2" />
        Create Demo Data Room
      </Button>
    </motion.div>
  );
};

export default EmptyState;