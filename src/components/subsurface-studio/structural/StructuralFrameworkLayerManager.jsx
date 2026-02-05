import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Eye, EyeOff, Layers } from 'lucide-react';

const LayerControl = ({ id, label, visible, opacity, onToggle, onOpacityChange }) => (
    <div className="flex flex-col gap-1 py-2 border-b border-slate-800/50 last:border-0">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Switch 
                    id={`layer-${id}`} 
                    checked={visible} 
                    onCheckedChange={onToggle}
                    className="scale-75 data-[state=checked]:bg-purple-500"
                />
                <Label htmlFor={`layer-${id}`} className="text-xs text-slate-300 cursor-pointer hover:text-white">{label}</Label>
            </div>
            <button onClick={() => onToggle(!visible)} className="text-slate-500 hover:text-slate-300">
                {visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </button>
        </div>
        {onOpacityChange && visible && (
            <div className="px-1 pt-1">
                <Slider 
                    value={[opacity * 100]} 
                    min={0} max={100} step={5} 
                    onValueChange={([val]) => onOpacityChange(val / 100)}
                    className="w-full"
                />
            </div>
        )}
    </div>
);

const StructuralFrameworkLayerManager = ({ layers, setLayers }) => {
    const updateLayer = (key, changes) => {
        setLayers(prev => ({
            ...prev,
            [key]: { ...prev[key], ...changes }
        }));
    };

    return (
        <Card className="bg-slate-900 border-slate-800 shadow-none">
            <CardHeader className="pb-2 px-4 pt-4">
                <CardTitle className="text-xs font-bold flex items-center text-slate-400 uppercase">
                    <Layers className="w-3 h-3 mr-2" /> Model Layers
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <LayerControl 
                    id="horizons" label="Gridded Horizons" 
                    visible={layers.horizons.visible} opacity={layers.horizons.opacity}
                    onToggle={(v) => updateLayer('horizons', { visible: v })} onOpacityChange={(v) => updateLayer('horizons', { opacity: v })}
                />
                <LayerControl 
                    id="faults" label="Fault Planes" 
                    visible={layers.faults.visible} opacity={layers.faults.opacity}
                    onToggle={(v) => updateLayer('faults', { visible: v })} onOpacityChange={(v) => updateLayer('faults', { opacity: v })}
                />
                <LayerControl 
                    id="wells" label="Wells" 
                    visible={layers.wells.visible} 
                    onToggle={(v) => updateLayer('wells', { visible: v })}
                />
                <LayerControl 
                    id="picks" label="Raw Picks (Points)" 
                    visible={layers.picks.visible} 
                    onToggle={(v) => updateLayer('picks', { visible: v })}
                />
                <LayerControl 
                    id="grid" label="3D Grid" 
                    visible={layers.grid.visible} 
                    onToggle={(v) => updateLayer('grid', { visible: v })}
                />
            </CardContent>
        </Card>
    );
};

export default StructuralFrameworkLayerManager;