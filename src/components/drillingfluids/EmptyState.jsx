import React from 'react';
import { motion } from 'framer-motion';
import { Beaker, FileInput, BrainCircuit, BarChart } from 'lucide-react';

const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 h-full flex flex-col justify-center"
    >
      <div className="text-center py-12">
        <Beaker className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Drilling Fluids Formulation</h2>
        <p className="text-lime-200 mb-6 max-w-2xl mx-auto">
          Define your well parameters, build your fluid recipe with base fluids and additives, then click calculate to see the predicted properties, costs, and rheology.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          <div className="bg-white/5 rounded-lg p-4">
            <FileInput className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">1. Formulate</h3>
            <p className="text-lime-300 text-sm">Enter well data, target properties, and additives.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <BrainCircuit className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">2. Calculate</h3>
            <p className="text-lime-300 text-sm">Run advanced models to predict fluid behavior.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <BarChart className="w-8 h-8 text-teal-400 mx-auto mb-2" />
            <h3 className="text-white font-semibold mb-1">3. Analyze</h3>
            <p className="text-lime-300 text-sm">Review KPIs, costs, and rheology curves.</p>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-cyan-500/20">
          <h3 className="text-lg font-semibold text-white mb-3">Live Backend Connection</h3>
          <p className="text-lime-200 text-sm max-w-3xl mx-auto">
            The "Calculate Properties & Cost" button triggers a live API call to a powerful backend service. This service runs complex fluid dynamics simulations to return a full set of predicted properties for your specific formulation.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmptyState;