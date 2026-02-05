import React from 'react';
import { useGuidedMode } from '../../contexts/GuidedModeContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Mountain } from 'lucide-react';

const ErosionOptionStep = () => {
    const { wizardData, setWizardData } = useGuidedMode();

    const options = [
        { id: 'none', name: 'No Significant Erosion', description: 'Continuous deposition or hiatus without removal.', amount: 0 },
        { id: 'moderate', name: 'Moderate Uplift', description: 'Late stage uplift removing ~500m of section.', amount: 500 },
        { id: 'heavy', name: 'Major Unconformity', description: 'Significant erosional event removing >1000m.', amount: 1500 }
    ];

    return (
        <div className="h-full flex flex-col">
             <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Erosion Events</h2>
                <p className="text-slate-400">Specify if the basin experienced uplift and removal of overburden.</p>
            </div>

            <RadioGroup 
                value={wizardData.erosionOption} 
                onValueChange={(val) => setWizardData(prev => ({ ...prev, erosionOption: val }))}
                className="grid grid-cols-1 gap-4"
            >
                {options.map(opt => (
                    <div key={opt.id}>
                        <RadioGroupItem value={opt.id} id={opt.id} className="peer sr-only" />
                        <Label 
                            htmlFor={opt.id}
                            className="flex flex-col p-4 rounded-lg border-2 border-slate-800 bg-slate-900 cursor-pointer hover:bg-slate-800/50 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-900/10 transition-all"
                        >
                             <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2 font-bold text-white">
                                    <Mountain className="w-5 h-5 text-slate-400" />
                                    {opt.name}
                                </div>
                                {opt.amount > 0 && (
                                    <div className="text-sm font-mono text-amber-400 font-bold">
                                        ~{opt.amount}m
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-slate-400">{opt.description}</p>
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
};

export default ErosionOptionStep;