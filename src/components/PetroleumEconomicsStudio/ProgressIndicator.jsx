import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProgressIndicator = ({ progress }) => {
  // progress: { setup: boolean, inputs: boolean, ready: boolean, results: boolean }
  const steps = [
    { id: 'setup', label: 'Setup', done: progress.setup },
    { id: 'inputs', label: 'Inputs', done: progress.inputs },
    { id: 'ready', label: 'Ready', done: progress.ready },
    { id: 'results', label: 'Results', done: progress.results },
  ];

  const completedCount = steps.filter(s => s.done).length;
  const percentage = (completedCount / steps.length) * 100;

  return (
    <div className="w-64">
      <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1.5 uppercase tracking-wider font-semibold">
        <span>Model Completion</span>
        <span>{percentage.toFixed(0)}%</span>
      </div>
      <Progress value={percentage} className="h-1.5 bg-slate-800" indicatorClassName={cn(
          "transition-all duration-500",
          percentage === 100 ? "bg-emerald-500" : "bg-blue-500"
      )} />
      <div className="flex justify-between mt-2">
          {steps.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center gap-1">
                  <div className={cn(
                      "w-2 h-2 rounded-full transition-colors duration-300",
                      step.done ? "bg-emerald-500" : "bg-slate-800"
                  )} />
                  <span className={cn(
                      "text-[9px]",
                      step.done ? "text-slate-300" : "text-slate-600"
                  )}>{step.label}</span>
              </div>
          ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;