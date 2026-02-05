import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChevronRight, ChevronLeft, PlayCircle } from 'lucide-react';
import { useReservoirCalc } from '../../contexts/ReservoirCalcContext';
import { useToast } from '@/components/ui/use-toast';

// Helper Input Component
const DistInput = ({ label, value, onChange }) => (
    <div className="space-y-1">
        <Label className="text-[10px] text-slate-400">{label}</Label>
        <div className="flex gap-2">
            <Input 
                placeholder="P90" 
                className="h-7 text-xs bg-slate-950 border-slate-700" 
                value={value?.p90 || ''} 
                onChange={e => onChange({...value, p90: e.target.value})}
            />
            <Input 
                placeholder="P50" 
                className="h-7 text-xs bg-slate-950 border-slate-700"
                value={value?.p50 || ''} 
                onChange={e => onChange({...value, p50: e.target.value})}
            />
            <Input 
                placeholder="P10" 
                className="h-7 text-xs bg-slate-950 border-slate-700"
                value={value?.p10 || ''} 
                onChange={e => onChange({...value, p10: e.target.value})}
            />
        </div>
    </div>
);

const ProbabilisticPanel = () => {
    const { state } = useReservoirCalc();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSimulating, setIsSimulating] = useState(false);

    // Internal state for probabilistic parameters
    const [distParams, setDistParams] = useState({
        porosity: { p90: 0.15, p50: 0.20, p10: 0.25 },
        sw: { p90: 0.40, p50: 0.30, p10: 0.20 },
        thickness: { p90: 50, p50: 75, p10: 100 },
        area: { p90: 1000, p50: 1200, p10: 1500 },
        boi: { p90: 1.1, p50: 1.2, p10: 1.3 }
    });

    const steps = [
        { id: 'inputs', title: 'Distributions' },
        { id: 'correlations', title: 'Correlations' },
        { id: 'simulate', title: 'Simulation' }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleParamChange = (key, val) => {
        setDistParams(prev => ({ ...prev, [key]: val }));
    };

    const runSimulation = () => {
        setIsSimulating(true);
        // Mock simulation
        setTimeout(() => {
            setIsSimulating(false);
            toast({
                title: "Simulation Complete",
                description: "10,000 iterations completed successfully."
            });
        }, 1500);
    };

    // FIX: Bounds check for step navigation to prevent accessing undefined steps
    const safeStepIndex = Math.max(0, Math.min(currentStep, steps.length - 1));
    const activeStep = steps[safeStepIndex];

    // Prevent render if somehow activeStep is still undefined
    if (!activeStep) return <div className="p-4 text-red-400">Error: Invalid Step State</div>;

    return (
        <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
            <div className="p-3 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between flex-shrink-0">
                <h3 className="text-sm font-bold text-white">Probabilistic Analysis</h3>
                <div className="flex gap-1">
                    {steps.map((s, i) => (
                        <div 
                            key={s.id} 
                            className={`h-1.5 w-6 rounded-full transition-colors ${i === safeStepIndex ? 'bg-blue-500' : i < safeStepIndex ? 'bg-blue-900' : 'bg-slate-800'}`}
                            title={s.title}
                        />
                    ))}
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                <div className="mb-4">
                    <h4 className="text-md font-medium text-slate-200 mb-1">{activeStep.title}</h4>
                    <p className="text-xs text-slate-500">Configure parameters for Monte Carlo simulation.</p>
                </div>

                {safeStepIndex === 0 && (
                    <div className="space-y-4">
                        <DistInput 
                            label="Porosity (fraction)" 
                            value={distParams.porosity} 
                            onChange={v => handleParamChange('porosity', v)} 
                        />
                        <DistInput 
                            label="Water Saturation (fraction)" 
                            value={distParams.sw} 
                            onChange={v => handleParamChange('sw', v)} 
                        />
                        <DistInput 
                            label="Gross Thickness (ft)" 
                            value={distParams.thickness} 
                            onChange={v => handleParamChange('thickness', v)} 
                        />
                        <DistInput 
                            label="Area (acres)" 
                            value={distParams.area} 
                            onChange={v => handleParamChange('area', v)} 
                        />
                        <DistInput 
                            label="Oil FVF (rb/stb)" 
                            value={distParams.boi} 
                            onChange={v => handleParamChange('boi', v)} 
                        />
                    </div>
                )}

                {safeStepIndex === 1 && (
                    <div className="space-y-4">
                        <div className="p-6 border border-dashed border-slate-700 rounded-lg text-center text-slate-500 text-sm bg-slate-950/30">
                            <p>Correlation Matrix feature coming soon.</p>
                            <p className="text-xs mt-2 opacity-70">Assumes independent variables for now.</p>
                        </div>
                    </div>
                )}

                {safeStepIndex === 2 && (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <div className={`p-4 rounded-full bg-emerald-900/20 ${isSimulating ? 'animate-pulse' : ''}`}>
                            <PlayCircle className="w-12 h-12 text-emerald-500" />
                        </div>
                        <div className="text-center">
                            <h5 className="text-sm font-medium text-white">Ready to Simulate</h5>
                            <p className="text-xs text-slate-500">Run 10,000 iterations</p>
                        </div>
                        <Button 
                            className="bg-emerald-600 hover:bg-emerald-700 w-full max-w-[200px]"
                            onClick={runSimulation}
                            disabled={isSimulating}
                        >
                            {isSimulating ? "Running..." : "Run Simulation"}
                        </Button>
                    </div>
                )}
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-950/50 flex justify-between flex-shrink-0">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleBack} 
                    disabled={safeStepIndex === 0 || isSimulating}
                    className="text-slate-400 hover:text-white"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button 
                    size="sm" 
                    onClick={handleNext} 
                    disabled={safeStepIndex === steps.length - 1 || isSimulating}
                    className={`${safeStepIndex === steps.length - 1 ? 'opacity-0 pointer-events-none' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
};

export default ProbabilisticPanel;