import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Zap, DatabaseZap, PlusCircle } from 'lucide-react';
    import NewWellDialog from './NewWellDialog';

    const EmptyState = ({ onAnalyze, hasData, onWellCreated, isCreatingWell, setIsCreatingWell }) => {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-900"
        >
          <div className="bg-gradient-to-br from-cyan-900 to-blue-900 p-8 rounded-full mb-6 border-4 border-cyan-700/50 shadow-2xl shadow-cyan-500/20">
            <DatabaseZap className="w-24 h-24 text-cyan-300" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">Define the Drilling Window</h2>
          <p className="text-lg text-slate-300 max-w-2xl mb-8">
            {hasData 
            ? "Select a well, dataset, methods, and calibrate with events. The engine will predict pore pressure, fracture gradient, and overburden to ensure a safe operation."
            : "No wells found in your organization. Create a new well to begin your first analysis, or use the demo data to get started."
            }
          </p>
          {hasData ? (
             <Button
                onClick={onAnalyze}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold text-lg px-8 py-6 shadow-lg"
              >
                <Zap className="w-5 h-5 mr-3" />
                Run Analysis
              </Button>
          ) : (
            <NewWellDialog onWellCreated={onWellCreated} isOpen={isCreatingWell} setIsOpen={setIsCreatingWell} />
          )}
        </motion.div>
      );
    };

    export default EmptyState;