import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calculator, Sliders } from 'lucide-react';

const Step1 = ({ data, updateData }) => {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-xl font-bold text-white">Select Calculation Method</h3>
                <p className="text-slate-400 mt-2">Choose how you want to calculate reserves.</p>
            </div>
            
            <RadioGroup value={data.method} onValueChange={(val) => updateData({ method: val })} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${data.method === 'deterministic' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 hover:border-slate-600'}`}>
                    <RadioGroupItem value="deterministic" id="det" className="sr-only" />
                    <Label htmlFor="det" className="cursor-pointer flex flex-col items-center gap-4">
                        <Calculator className="w-12 h-12 text-emerald-400" />
                        <div className="text-center">
                            <div className="font-bold text-lg text-white">Deterministic</div>
                            <p className="text-sm text-slate-400 mt-1">Single value inputs for a single result. Best for quick estimates.</p>
                        </div>
                    </Label>
                </div>

                <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${data.method === 'probabilistic' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 hover:border-slate-600'}`}>
                    <RadioGroupItem value="probabilistic" id="prob" className="sr-only" />
                    <Label htmlFor="prob" className="cursor-pointer flex flex-col items-center gap-4">
                        <Sliders className="w-12 h-12 text-blue-400" />
                        <div className="text-center">
                            <div className="font-bold text-lg text-white">Probabilistic</div>
                            <p className="text-sm text-slate-400 mt-1">Range inputs with Monte Carlo simulation. Best for risk analysis.</p>
                        </div>
                    </Label>
                </div>
            </RadioGroup>
        </div>
    );
};
export default Step1;