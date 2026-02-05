import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, FileInput, BrainCircuit, FileOutput } from 'lucide-react';

const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 h-full flex flex-col justify-center"
    >
      <div className="text-center py-12">
        <ClipboardList className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Drilling Program Generator</h2>
        <p className="text-lime-200 mb-6 max-w-2xl mx-auto">
          Fill in the details of your well plan on the left. The AI will use your inputs to construct a comprehensive, multi-page drilling program document.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          <div className="bg-white/5 rounded-lg p-4">
            <FileInput className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">1. Provide Inputs</h3>
            <p className="text-lime-300 text-sm">Fill out the collapsible sections with your well plan data.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <BrainCircuit className="w-8 h-8 text-teal-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">2. Generate</h3>
            <p className="text-lime-300 text-sm">Our AI engine assembles the formal program document.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <FileOutput className="w-8 h-8 text-lime-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">3. Review & Download</h3>
            <p className="text-lime-300 text-sm">Download the generated PDF and review visual summaries.</p>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-lg border border-cyan-500/20">
          <h3 className="text-lg font-semibold text-white mb-3">API Stub Information</h3>
          <p className="text-lime-200 text-sm max-w-3xl mx-auto">
            This front-end application is ready to connect to a backend API. The "Generate Program" button simulates a POST request to a `/api/drilling/program-writer` endpoint and receives a dummy download URL for the generated document.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyState;