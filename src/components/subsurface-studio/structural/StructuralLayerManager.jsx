import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Eye, EyeOff, Layers } from 'lucide-react';

const LayerItem = ({ id, label, visible, opacity, onToggle, onOpacityChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-800/50 last:border-0">
        <div className="flex items-center gap-3">
            <Switch 
                id={`layer-${id}`} 
                checked={visible} 
                onCheckedChange={onToggle}
                className="scale-75 data-[state=checked]:bg-cyan-500"
            />
            <div className="space-y-0.5">
                <Label htmlFor={`layer-${id}`} className="text-xs font-medium text-slate-200 cursor-pointer">{label}</Label>
                <div className="text-[10px] text-slate-500">{visible ? 'Visible' : 'Hidden'}</div>
            </div>
        </div>
        {onOpacityChange && visible && (
            <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 w-6 text-right">{Math.round(opacity * 100)}%</span>
                <Slider 
                    value={[opacity * 100]} 
                    min={0} max={100} step={5} 
                    onValueChange={([val]) => onOpacityChange(val / 100)}
                    className="w-16"
                />
            </div>
        )}
    </div>
);

const StructuralLayerManager = ({ layers, setLayers }) => {
    const updateLayer = (key, changes) => {
        setLayers(prev => ({
            ...prev,
            [key]: { ...prev[key], ...changes }
        }));
    };

    return (
        <Card className="bg-slate-900 border-slate-800 shadow-none h-full">
            <CardHeader className="pb-2 px-4 pt-4 border-b border-slate-800">
                <CardTitle className="text-sm font-bold flex items-center text-slate-200">
                    <Layers className="w-4 h-4 mr-2 text-cyan-400" /> Layer Management
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pt-2">
                <LayerItem 
                    id="faults" 
                    label="Fault Surfaces" 
                    visible={layers.faults.visible} 
                    opacity={layers.faults.opacity}
                    onToggle={(v) => updateLayer('faults', { visible: v })}
                    onOpacityChange={(v) => updateLayer('faults', { opacity: v })}
                />
                <LayerItem 
                    id="horizons" 
                    label="Horizon Surfaces" 
                    visible={layers.horizons.visible} 
                    opacity={layers.horizons.opacity}
                    onToggle={(v) => updateLayer('horizons', { visible: v })}
                    onOpacityChange={(v) => updateLayer('horizons', { opacity: v })}
                />
                <LayerItem 
                    id="grids" 
                    label="Structural Grids" 
                    visible={layers.grids.visible} 
                    opacity={layers.grids.opacity}
                    onToggle={(v) => updateLayer('grids', { visible: v })}
                    onOpacityChange={(v) => updateLayer('grids', { opacity: v })}
                />
                <LayerItem 
                    id="properties" 
                    label="Property Models" 
                    visible={layers.properties.visible} 
                    opacity={layers.properties.opacity}
                    onToggle={(v) => updateLayer('properties', { visible: v })}
                    onOpacityChange={(v) => updateLayer('properties', { opacity: v })}
                />
                <LayerItem 
                    id="wells" 
                    label="Well Trajectories" 
                    visible={layers.wells.visible} 
                    opacity={layers.wells.opacity}
                    onToggle={(v) => updateLayer('wells', { visible: v })}
                    onOpacityChange={(v) => updateLayer('wells', { opacity: v })}
                />
            </CardContent>
        </Card>
    );
};

export default StructuralLayerManager;