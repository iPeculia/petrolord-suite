import React from 'react';
import { useGuidedMode } from '../../contexts/GuidedModeContext';
import { HeatFlowPresets } from '../../data/HeatFlowPresets';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Thermometer } from 'lucide-react';

const HeatFlowTemplateStep = () => {
    const { wizardData, setWizardData } = useGuidedMode();

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Thermal Boundary Conditions</h2>
                <p className="text-slate-400">Select a heat flow model that represents the tectonic history.</p>
            </div>

            <RadioGroup 
                value={wizardData.heatFlowId} 
                onValueChange={(val) => setWizardData(prev => ({ ...prev, heatFlowId: val }))}
                className="grid grid-cols-1 gap-4"
            >
                {HeatFlowPresets.map(preset => (
                    <div key={preset.id}>
                        <RadioGroupItem value={preset.id} id={preset.id} className="peer sr-only" />
                        <Label 
                            htmlFor={preset.id}
                            className="flex flex-col p-4 rounded-lg border-2 border-slate-800 bg-slate-900 cursor-pointer hover:bg-slate-800/50 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-900/10 transition-all"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2 font-bold text-white">
                                    <Thermometer className="w-5 h-5 text-slate-400" />
                                    {preset.name}
                                </div>
                                <div className="text-sm font-mono text-emerald-400 font-bold">
                                    {preset.type === 'constant' ? `${preset.value} mW/m²` : 'Variable'}
                                </div>
                            </div>
                            <p className="text-sm text-slate-400">{preset.description}</p>
                        </Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    );
};

export default HeatFlowTemplateStep;