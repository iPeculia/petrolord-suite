import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

const KineticsEditor = ({ layer, onUpdate }) => {
    const params = layer.sourceRock || { isSource: false, kerogen: 'type2', toc: 2.0, hi: 450 };

    const handleChange = (field, value) => {
        onUpdate({ ...params, [field]: value });
    };

    if (!params.isSource) {
        return (
             <div className="p-3 bg-slate-950/50 rounded border border-slate-800/50 text-center">
                <p className="text-xs text-slate-500 mb-2">Not a source rock.</p>
                <button 
                    onClick={() => handleChange('isSource', true)}
                    className="text-xs text-indigo-400 hover:underline"
                >
                    Enable Source Rock
                </button>
             </div>
        );
    }

    return (
        <div className="space-y-3 p-3 bg-slate-950/50 rounded border border-slate-800/50">
            <div className="flex justify-between items-center">
                <h4 className="text-xs font-semibold text-green-300 uppercase tracking-wider">Kinetics & Richness</h4>
                <button 
                    onClick={() => handleChange('isSource', false)}
                    className="text-[10px] text-slate-500 hover:text-red-400"
                >
                    Disable
                </button>
            </div>
            
            <div className="space-y-2">
                <div>
                    <Label className="text-[10px] text-slate-500">Kerogen Type</Label>
                    <Select value={params.kerogen} onValueChange={(v) => handleChange('kerogen', v)}>
                        <SelectTrigger className="h-7 text-xs bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="type1">Type I (Lacustrine)</SelectItem>
                            <SelectItem value="type2">Type II (Marine)</SelectItem>
                            <SelectItem value="type3">Type III (Humic)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label className="text-[10px] text-slate-500">TOC (%)</Label>
                        <input 
                            type="number" step="0.1"
                            value={params.toc}
                            onChange={(e) => handleChange('toc', parseFloat(e.target.value))}
                            className="w-full h-7 bg-slate-900 border border-slate-700 rounded px-2 text-xs"
                        />
                    </div>
                    <div>
                        <Label className="text-[10px] text-slate-500">HI (mg/g)</Label>
                        <input 
                            type="number" step="10"
                            value={params.hi}
                            onChange={(e) => handleChange('hi', parseFloat(e.target.value))}
                            className="w-full h-7 bg-slate-900 border border-slate-700 rounded px-2 text-xs"
                        />
                    </div>
                </div>
            </div>
            
            <div className="text-[10px] text-slate-500 italic bg-slate-900/50 p-1 rounded">
                Using Pepper & Corvi (1995) standard kinetics for {params.kerogen}.
            </div>
        </div>
    );
};

export default KineticsEditor;