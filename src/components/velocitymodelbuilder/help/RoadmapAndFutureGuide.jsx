import React from 'react';
import { Map } from 'lucide-react';

const RoadmapAndFutureGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Map className="w-6 h-6 text-emerald-400"/> Product Roadmap
      </h2>
      <div className="space-y-4">
        <div className="flex gap-4">
            <div className="bg-blue-900/20 text-blue-400 px-3 py-1 rounded text-xs font-bold h-fit">Q1 2026</div>
            <div>
                <h4 className="text-white font-bold">Real-Time Drilling Integration</h4>
                <p className="text-sm text-slate-400">Update velocity models instantly as LWD sonic data streams in from the rig.</p>
            </div>
        </div>
        <div className="flex gap-4">
            <div className="bg-purple-900/20 text-purple-400 px-3 py-1 rounded text-xs font-bold h-fit">Q3 2026</div>
            <div>
                <h4 className="text-white font-bold">Generative AI for Geology</h4>
                <p className="text-sm text-slate-400">AI that suggests geologically plausible velocity trends based on basin descriptions.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapAndFutureGuide;