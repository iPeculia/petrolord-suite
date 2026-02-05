import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Droplets, Flame, Layers } from 'lucide-react';

const FluidTypeSelector = ({ value, onChange }) => {
    return (
        <div className="space-y-3">
            <Label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Fluid System</Label>
            <RadioGroup 
                value={value} 
                onValueChange={onChange}
                className="grid grid-cols-3 gap-3"
            >
                <div>
                    <RadioGroupItem value="oil" id="ft-oil" className="peer sr-only" />
                    <Label htmlFor="ft-oil" className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-slate-800 bg-slate-950 p-3 hover:bg-slate-900 hover:border-slate-700 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-950/20 cursor-pointer transition-all group">
                        <Droplets className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 peer-data-[state=checked]:text-emerald-500" />
                        <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 peer-data-[state=checked]:text-emerald-400">Oil</span>
                    </Label>
                </div>
                <div>
                    <RadioGroupItem value="gas" id="ft-gas" className="peer sr-only" />
                    <Label htmlFor="ft-gas" className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-slate-800 bg-slate-950 p-3 hover:bg-slate-900 hover:border-slate-700 peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:bg-amber-950/20 cursor-pointer transition-all group">
                        <Flame className="w-5 h-5 text-slate-500 group-hover:text-amber-400 peer-data-[state=checked]:text-amber-500" />
                        <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 peer-data-[state=checked]:text-amber-400">Gas</span>
                    </Label>
                </div>
                <div>
                    <RadioGroupItem value="oil_gas" id="ft-mixed" className="peer sr-only" />
                    <Label htmlFor="ft-mixed" className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-slate-800 bg-slate-950 p-3 hover:bg-slate-900 hover:border-slate-700 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-950/20 cursor-pointer transition-all group">
                        <Layers className="w-5 h-5 text-slate-500 group-hover:text-blue-400 peer-data-[state=checked]:text-blue-500" />
                        <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 peer-data-[state=checked]:text-blue-400">Oil + Gas</span>
                    </Label>
                </div>
            </RadioGroup>
        </div>
    );
};

export default FluidTypeSelector;