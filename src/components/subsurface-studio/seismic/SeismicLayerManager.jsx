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
                    className="scale-75 data-[state=checked]:bg-cyan-500"
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

const SeismicLayerManager = ({ layers, setLayers }) => {
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
                    <Layers className="w-3 h-3 mr-2" /> Visibility & Opacity
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <LayerControl 
                    id="seismic" 
                    label="Base Seismic Data" 
                    visible={layers.seismic.visible} 
                    opacity={layers.seismic.opacity}
                    onToggle={(v) => updateLayer('seismic', { visible: v })}
                    onOpacityChange={(v) => updateLayer('seismic', { opacity: v })}
                />
                <LayerControl 
                    id="horizons" 
                    label="Interpreted Horizons" 
                    visible={layers.horizons.visible} 
                    onToggle={(v) => updateLayer('horizons', { visible: v })}
                />
                <LayerControl 
                    id="faults" 
                    label="Fault Sticks" 
                    visible={layers.faults.visible} 
                    onToggle={(v) => updateLayer('faults', { visible: v })}
                />
                <LayerControl 
                    id="wells" 
                    label="Projected Wells" 
                    visible={layers.wells.visible} 
                    opacity={layers.wells.opacity}
                    onToggle={(v) => updateLayer('wells', { visible: v })}
                    onOpacityChange={(v) => updateLayer('wells', { opacity: v })}
                />
                <LayerControl 
                    id="grid" 
                    label="Reference Grid" 
                    visible={layers.grid.visible} 
                    opacity={layers.grid.opacity}
                    onToggle={(v) => updateLayer('grid', { visible: v })}
                    onOpacityChange={(v) => updateLayer('grid', { opacity: v })}
                />
            </CardContent>
        </Card>
    );
};

export default SeismicLayerManager;