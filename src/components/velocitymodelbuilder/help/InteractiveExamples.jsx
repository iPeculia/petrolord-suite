import React from 'react';
import { PlayCircle } from 'lucide-react';

const InteractiveExamples = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <PlayCircle className="w-5 h-5 text-blue-400" /> Live Examples
      </h2>
      <div className="bg-slate-900 border border-slate-800 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden group cursor-pointer">
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
        <div className="z-10 text-center">
            <PlayCircle className="w-16 h-16 text-white opacity-80 mb-4 mx-auto" />
            <h3 className="text-white font-bold text-lg">Walkthrough: Building a 3-Layer Model</h3>
            <p className="text-slate-300 text-sm">Click to launch interactive tour</p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveExamples;