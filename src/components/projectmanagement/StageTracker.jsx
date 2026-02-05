import React from 'react';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const stages = [
  { id: 'Concept', label: 'Concept' },
  { id: 'Pre-FEED', label: 'Pre-FEED' },
  { id: 'FEED', label: 'FEED' },
  { id: 'Execution', label: 'Execution' },
  { id: 'Close-out', label: 'Close-out' },
];

const StageTracker = ({ currentStage }) => {
  // Determine index of current stage to highlight progress
  const currentIndex = stages.findIndex(s => s.id === currentStage) !== -1 
    ? stages.findIndex(s => s.id === currentStage) 
    : 0;

  return (
    <div className="w-full bg-slate-950/50 border-b border-white/10 p-4 mb-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;

          return (
            <div key={stage.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center relative z-10">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
                  isCompleted ? "bg-lime-500 border-lime-500 text-black" :
                  isCurrent ? "bg-slate-900 border-lime-400 text-lime-400 animate-pulse" :
                  "bg-slate-900 border-slate-600 text-slate-600"
                )}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                   isCurrent ? <Circle className="w-5 h-5 fill-lime-400/20" /> :
                   <Circle className="w-5 h-5" />}
                </div>
                <span className={cn(
                  "text-xs font-medium mt-2 absolute -bottom-6 whitespace-nowrap",
                  isCurrent ? "text-lime-400" : isCompleted ? "text-lime-500" : "text-slate-500"
                )}>
                  {stage.label}
                </span>
              </div>
              
              {index < stages.length - 1 && (
                <div className={cn(
                  "h-0.5 w-full mx-2 flex-1 transition-colors duration-300",
                  isCompleted ? "bg-lime-500" : "bg-slate-700"
                )} />
              )}
            </div>
          );
        })}
      </div>
      <div className="h-4"></div> {/* Spacer for labels */}
    </div>
  );
};

export default StageTracker;