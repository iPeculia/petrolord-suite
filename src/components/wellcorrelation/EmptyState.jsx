import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmptyState = ({ onAddWell }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 bg-slate-950 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md space-y-6 bg-slate-900/80 backdrop-blur p-8 rounded-2xl border border-slate-800 shadow-2xl"
      >
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-slate-800 ring-offset-4 ring-offset-slate-950">
            <Layout className="w-10 h-10 text-rose-500" />
        </div>
        
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">Start Correlation</h2>
            <p className="text-slate-400">
                Create a stratigraphic cross-section by adding wells manually or importing them via the Data Hub.
            </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <Button onClick={onAddWell} className="bg-rose-600 hover:bg-rose-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Well Track
            </Button>
            <Button variant="outline" className="border-slate-700 hover:bg-slate-800" disabled>
                <Upload className="w-4 h-4 mr-2" />
                Upload Project
            </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default EmptyState;