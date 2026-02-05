import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

const WorkflowGuide = ({ steps, currentStep, onStepClick, validationState = {} }) => {
    return (
        <div className="h-full flex flex-col">
            <div className="mb-6 shrink-0">
                <h2 className="text-lg font-bold text-white tracking-wide">Workflow</h2>
                <p className="text-xs text-slate-500 mt-1">Guided Process</p>
            </div>

            <div className="relative flex flex-col space-y-6 ml-2">
                {/* Vertical Line */}
                <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-800 -z-10" />

                {steps.map((step, index) => {
                    const stepNum = index + 1;
                    const isActive = stepNum === currentStep;
                    const isCompleted = stepNum < currentStep;
                    const hasError = validationState[stepNum]?.isValid === false;
                    
                    return (
                        <div 
                            key={step.id} 
                            className={cn(
                                "group flex items-start gap-4 relative cursor-pointer transition-opacity",
                                isActive ? "opacity-100" : "opacity-70 hover:opacity-100"
                            )}
                            onClick={() => onStepClick && onStepClick(stepNum)}
                        >
                            {/* Indicator */}
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 transition-all duration-300 border-2",
                                isActive 
                                    ? "bg-indigo-600 border-indigo-500 text-white ring-4 ring-indigo-500/20 shadow-lg shadow-indigo-500/30" 
                                    : isCompleted 
                                        ? "bg-emerald-900 border-emerald-600 text-emerald-400"
                                        : "bg-slate-900 border-slate-700 text-slate-500",
                                hasError && !isActive && "border-red-500 text-red-500 bg-red-900/20"
                            )}>
                                {isCompleted && !hasError ? <CheckCircle2 className="w-4 h-4" /> : 
                                 hasError ? <AlertCircle className="w-4 h-4" /> : 
                                 stepNum}
                            </div>

                            {/* Text */}
                            <div className="pt-0.5">
                                <h4 className={cn(
                                    "text-sm font-medium transition-colors",
                                    isActive ? "text-white" : isCompleted ? "text-emerald-400" : "text-slate-500",
                                    hasError && "text-red-400"
                                )}>
                                    {step.title}
                                </h4>
                                {isActive && (
                                    <p className="text-xs text-slate-400 mt-1 animate-in fade-in slide-in-from-left-2">
                                        {step.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WorkflowGuide;