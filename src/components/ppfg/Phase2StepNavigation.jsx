import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
    "Overburden", "NCT Picking", "Effective Stress", "Pore Pressure", "Frac Gradient", "Centroid", "QC & Report"
];

const Phase2StepNavigation = ({ activeStep, setActiveStep, stepsState, onNext, onBack }) => {
  return (
    <div className="flex flex-col h-full border-r border-slate-800 bg-slate-950 w-64 shrink-0">
        <div className="p-4 border-b border-slate-800">
            <h3 className="font-bold text-slate-100">Analysis Workflow</h3>
            <p className="text-xs text-slate-500">Phase 2: Gradient Prediction</p>
        </div>
        
        <div className="flex-1 py-4 space-y-1">
            {steps.map((label, idx) => {
                const stepNum = idx + 1;
                const state = stepsState[stepNum];
                const isActive = activeStep === stepNum;
                const isCompleted = state?.status === 'completed';

                return (
                    <button
                        key={stepNum}
                        onClick={() => setActiveStep(stepNum)}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-l-2",
                            isActive ? "bg-slate-900 border-emerald-500 text-emerald-400 font-medium" : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                        )}
                    >
                        <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs border",
                            isCompleted ? "bg-emerald-500/20 border-emerald-500 text-emerald-500" : 
                            isActive ? "border-emerald-500 text-emerald-500" : "border-slate-700 bg-slate-900"
                        )}>
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                        </div>
                        <span>{label}</span>
                    </button>
                );
            })}
        </div>

        <div className="p-4 border-t border-slate-800 flex gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                onClick={onBack} 
                disabled={activeStep === 1}
                className="flex-1 border-slate-700 text-slate-300"
            >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button 
                size="sm" 
                onClick={onNext} 
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white"
            >
                Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
        </div>
    </div>
  );
};

export default Phase2StepNavigation;