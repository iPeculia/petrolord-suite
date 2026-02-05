import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Play, UploadCloud } from 'lucide-react';
    import DataUpload from './DataUpload';


    const EmptyState = ({ onRunDemo, onDataLoaded }) => {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center h-full text-center bg-slate-800/30 rounded-lg border-2 border-dashed border-slate-700 p-8"
        >
          <div className="bg-lime-900/50 p-4 rounded-full mb-6">
            <UploadCloud className="w-12 h-12 text-lime-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Start Your Well Test Analysis</h2>
          <p className="text-slate-400 max-w-md mb-6">
            Drag & drop your pressure transient data (.csv, .txt, .las) file, or run a quick analysis with our sample dataset to see the app in action.
          </p>
          <div className="w-full max-w-sm mb-6">
            <DataUpload onDataLoaded={onDataLoaded} />
          </div>
          <Button
            onClick={onRunDemo}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-3 px-6 text-lg rounded-lg shadow-lg"
          >
            <Play className="w-6 h-6 mr-2" />
            Run Analysis
          </Button>
        </motion.div>
      );
    };

    export default EmptyState;