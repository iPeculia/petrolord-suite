import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlignCenterHorizontal, Layers, ArrowDownUp } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const StructuralFlatteningPanel = ({ 
    horizons, 
    flatteningDatum, 
    setFlatteningDatum,
    isFlattened,
    setIsFlattened,
    verticalExaggeration,
    setVerticalExaggeration
}) => {
    return (
        <div className="space-y-4 p-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400 font-semibold">
                    <AlignCenterHorizontal className="w-4 h-4"/>
                    <h3>Structural Flattening</h3>
                </div>
                <Switch 
                    checked={isFlattened} 
                    onCheckedChange={setIsFlattened}
                    className="scale-75 data-[state=checked]:bg-blue-600"
                />
            </div>

            <div className={`space-y-3 transition-opacity ${isFlattened ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <div className="space-y-1">
                    <Label className="text-xs text-slate-400">Reference Datum (Horizon)</Label>
                    <Select 
                        value={flatteningDatum} 
                        onValueChange={setFlatteningDatum} 
                        disabled={!isFlattened}
                    >
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select Datum..." /></SelectTrigger>
                        <SelectContent>
                            {horizons.length === 0 && <SelectItem value="none" disabled>No horizons available</SelectItem>}
                            {horizons.map(h => (
                                <SelectItem key={h.id} value={h.name}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: h.style?.color || 'cyan' }} />
                                        {h.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                {isFlattened && !flatteningDatum && (
                    <p className="text-[10px] text-amber-400 bg-amber-950/30 p-2 rounded border border-amber-900/50">
                        Select a horizon to flatten the view. Wells will be shifted so this horizon is horizontal.
                    </p>
                )}
            </div>

            <div className="pt-2 border-t border-slate-800/50">
                <div className="flex justify-between items-center mb-2">
                    <Label className="text-xs text-slate-400 flex items-center gap-1"><ArrowDownUp className="w-3 h-3"/> Vertical Exaggeration</Label>
                    <span className="text-xs font-mono text-blue-300">{verticalExaggeration}x</span>
                </div>
                <Slider 
                    value={[verticalExaggeration]} 
                    min={0.5} max={20} step={0.5} 
                    onValueChange={([v]) => setVerticalExaggeration(v)}
                    className="py-1"
                />
            </div>
        </div>
    );
};

export default StructuralFlatteningPanel;