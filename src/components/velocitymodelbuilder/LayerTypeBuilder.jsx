import React, { useState } from 'react';
import { Calculator, TrendingUp, ArrowDown, Waves } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const LayerTypeBuilder = ({ layer, onChange }) => {
    const [method, setMethod] = useState('linear');

    const renderInputs = () => {
        switch(method) {
            case 'constant':
                return (
                    <div className="space-y-2">
                        <Label className="text-xs">Constant Velocity (V0)</Label>
                        <Input type="number" className="h-8 bg-slate-950 border-slate-700" placeholder="m/s" />
                    </div>
                );
            case 'linear':
                return (
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <Label className="text-xs">Initial V (V0)</Label>
                            <Input type="number" className="h-8 bg-slate-950 border-slate-700" placeholder="m/s" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Gradient (k)</Label>
                            <Input type="number" className="h-8 bg-slate-950 border-slate-700" placeholder="1/s" />
                        </div>
                    </div>
                );
            case 'compaction':
                return (
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <Label className="text-xs">V Matrix (Vmat)</Label>
                            <Input type="number" className="h-8 bg-slate-950 border-slate-700" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Decay Factor (c)</Label>
                            <Input type="number" className="h-8 bg-slate-950 border-slate-700" />
                        </div>
                    </div>
                );
            case 'water':
                return (
                    <div className="space-y-2">
                        <Label className="text-xs">Water Velocity (Vw)</Label>
                        <Input type="number" defaultValue={1480} className="h-8 bg-slate-950 border-slate-700" />
                        <p className="text-[10px] text-slate-500">Usually 1450 - 1550 m/s</p>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <Card className="bg-slate-900 border-slate-800 p-3">
            <div className="flex items-center gap-2 mb-3">
                <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="h-8 w-full bg-slate-800 border-slate-700 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="constant">Constant Velocity</SelectItem>
                        <SelectItem value="linear">Linear (V0 + kZ)</SelectItem>
                        <SelectItem value="compaction">Exponential Compaction</SelectItem>
                        <SelectItem value="water">Water Layer</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="p-3 bg-slate-950/50 rounded border border-slate-800">
                {renderInputs()}
                <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
                    <span className="font-mono text-xs text-emerald-400">
                        {method === 'linear' ? 'V(z) = V0 + k*z' : 
                         method === 'constant' ? 'V(z) = V0' : 
                         method === 'compaction' ? 'V(z) = Vm*(1-e^-cz)' : 'V(z) = Vw'}
                    </span>
                    <Calculator className="w-3 h-3" />
                </div>
            </div>
        </Card>
    );
};

export default LayerTypeBuilder;