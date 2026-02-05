import React from 'react';
import { BrainCircuit, Wand2 } from 'lucide-react';

const AIFeatureExplanations = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <BrainCircuit className="w-6 h-6 text-emerald-400" />
        <h2 className="text-xl font-bold text-white">AI Features Explained</h2>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
        <div className="flex gap-4">
            <div className="mt-1"><Wand2 className="w-5 h-5 text-purple-400" /></div>
            <div>
                <h3 className="text-white font-bold text-base">Smart Layer Picking</h3>
                <p className="text-sm text-slate-400 mt-1">
                    The AI analyzes sonic log character and regional stratigraphy to automatically suggest major velocity boundaries, saving hours of manual correlation.
                </p>
            </div>
        </div>
        
        <div className="flex gap-4">
            <div className="mt-1"><BrainCircuit className="w-5 h-5 text-blue-400" /></div>
            <div>
                <h3 className="text-white font-bold text-base">Auto-Outlier Detection</h3>
                <p className="text-sm text-slate-400 mt-1">
                    Machine learning models trained on global checkshot databases flag anomalous points (e.g., cycle skips, datum errors) with 94% accuracy.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AIFeatureExplanations;