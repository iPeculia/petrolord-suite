import React from 'react';
import { ArrowRight, GitCommit, GitMerge, Layers } from 'lucide-react';

const Node = ({ title, phase, status }) => (
    <div className={`
        w-48 p-3 rounded-lg border text-sm font-medium relative
        ${status === 'done' ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-200' : 
          status === 'active' ? 'bg-blue-900/20 border-blue-500/50 text-blue-200' : 
          'bg-slate-900 border-slate-700 text-slate-500'}
    `}>
        <div className="text-[10px] opacity-70 uppercase mb-1">Phase {phase}</div>
        {title}
        {/* Simple connector lines implied by layout for this visual component */}
    </div>
);

const Connector = () => (
    <div className="flex items-center justify-center text-slate-600">
        <ArrowRight className="w-5 h-5" />
    </div>
);

const DependencyGraphVelocity = () => {
  return (
    <div className="p-8 h-full bg-slate-950 overflow-auto flex items-center justify-center min-h-[500px]">
      <div className="flex flex-col gap-8 items-center">
        
        {/* Row 1: Foundation */}
        <div className="flex items-center gap-4">
            <Node phase={1} title="Inputs & Workflow" status="done" />
            <Connector />
            <Node phase={2} title="Physics Engine" status="done" />
            <Connector />
            <Node phase={3} title="Time-Depth Conversion" status="done" />
        </div>

        {/* Connector Down */}
        <div className="h-8 w-0.5 bg-slate-700"></div>

        {/* Row 2: UI & Modes */}
        <div className="flex items-center gap-4">
            <Node phase={4} title="QC & Visualization" status="done" />
            <Connector />
            <Node phase={5} title="Guided Mode" status="done" />
            <Connector />
            <Node phase={6} title="Expert Mode" status="active" />
        </div>

        {/* Connector Down Split */}
        <div className="grid grid-cols-2 gap-32 w-full max-w-2xl relative">
             <div className="absolute top-0 left-1/2 h-4 w-0.5 bg-slate-700 -translate-x-1/2"></div>
             <div className="absolute top-4 left-1/4 right-1/4 h-0.5 bg-slate-700"></div>
             <div className="absolute top-4 left-1/4 h-4 w-0.5 bg-slate-700"></div>
             <div className="absolute top-4 right-1/4 h-4 w-0.5 bg-slate-700"></div>
        </div>

        {/* Row 3: Integration & External */}
        <div className="flex gap-12 mt-2">
            <div className="flex flex-col gap-4 items-center">
                <Node phase={7} title="Petrolord Integration" status="planned" />
                <div className="h-4 w-0.5 bg-slate-700"></div>
                <Node phase={9} title="Collaboration" status="active" />
            </div>
            <div className="flex flex-col gap-4 items-center">
                <Node phase={8} title="External Tools" status="planned" />
                <div className="h-4 w-0.5 bg-slate-700"></div>
                <Node phase={10} title="Performance" status="future" />
            </div>
        </div>

      </div>
    </div>
  );
};

export default DependencyGraphVelocity;