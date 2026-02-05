import React from 'react';
import { motion } from 'framer-motion';
import { Milestone } from 'lucide-react';

const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/5 border border-dashed border-white/20 rounded-xl"
    >
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full mb-6">
        <Milestone className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Welcome to Project Management Pro</h2>
      <p className="text-lime-200 max-w-md mb-6">
        Select a project from the panel on the left, or create a new one to get started.
      </p>
    </motion.div>
  );
};

export default EmptyState;