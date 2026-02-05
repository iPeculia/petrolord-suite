import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ContactDepthInput = ({ fluidType, owc, goc, onChange, unit }) => {
    const handleChange = (field, value) => {
        onChange(field, parseFloat(value) || 0);
    };

    if (fluidType === 'gas') {
        return (
            <div className="space-y-2 p-3 bg-slate-950 rounded border border-slate-800">
                <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-400">Gas-Water Contact (GWC)</Label>
                    <span className="text-[10px] text-slate-600">TVDSS ({unit})</span>
                </div>
                <Input 
                    type="number" 
                    value={goc ?? ''} 
                    onChange={e => handleChange('goc', e.target.value)}
                    className="h-8 bg-slate-900 border-slate-700 text-amber-400 font-mono"
                    placeholder="Depth"
                />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2 p-3 bg-slate-950 rounded border border-slate-800">
                <div className="flex items-center justify-between">
                    <Label className="text-xs text-slate-400">OWC</Label>
                    <span className="text-[10px] text-slate-600">{unit}</span>
                </div>
                <Input 
                    type="number" 
                    value={owc ?? ''} 
                    onChange={e => handleChange('owc', e.target.value)}
                    className="h-8 bg-slate-900 border-slate-700 text-blue-400 font-mono"
                    placeholder="Oil-Water"
                />
            </div>

            {fluidType === 'oil_gas' && (
                <div className="space-y-2 p-3 bg-slate-950 rounded border border-slate-800">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs text-slate-400">GOC</Label>
                        <span className="text-[10px] text-slate-600">{unit}</span>
                    </div>
                    <Input 
                        type="number" 
                        value={goc ?? ''} 
                        onChange={e => handleChange('goc', e.target.value)}
                        className="h-8 bg-slate-900 border-slate-700 text-amber-400 font-mono"
                        placeholder="Gas-Oil"
                    />
                </div>
            )}
        </div>
    );
};

export default ContactDepthInput;