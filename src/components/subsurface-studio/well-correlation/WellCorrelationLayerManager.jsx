import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Eye, EyeOff } from 'lucide-react';

const LayerControl = ({ id, label, visible, opacity, onToggle, onOpacityChange }) => (
    <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
            <Switch 
                id={`layer-${id}`} 
                checked={visible} 
                onCheckedChange={onToggle}
                className="scale-75"
            />
            <Label htmlFor={`layer-${id}`} className="text-xs text-slate-300 cursor-pointer">{label}</Label>
        </div>
        {onOpacityChange && visible && (
            <Slider 
                value={[opacity * 100]} 
                min={0} max={100} step={5} 
                onValueChange={([val]) => onOpacityChange(val / 100)}
                className="w-20"
            />
        )}
    </div>
);

const WellCorrelationLayerManager = ({ layers, setLayers }) => {
    const updateLayer = (key, changes) => {
        setLayers(prev => ({
            ...prev,
            [key]: { ...prev[key], ...changes }
        }));
    };

    return (
        <Card className="bg-slate-900 border-slate-800 shadow-none">
            <CardHeader className="pb-2 px-4 pt-4">
                <CardTitle className="text-xs uppercase tracking-wider text-slate-500">Layers</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <LayerControl 
                    id="grid" 
                    label="Grid Lines" 
                    visible={layers.grid.visible} 
                    opacity={layers.grid.opacity}
                    onToggle={(v) => updateLayer('grid', { visible: v })}
                    onOpacityChange={(v) => updateLayer('grid', { opacity: v })}
                />
                <LayerControl 
                    id="logs" 
                    label="Well Logs" 
                    visible={layers.logs.visible} 
                    opacity={layers.logs.opacity}
                    onToggle={(v) => updateLayer('logs', { visible: v })}
                    onOpacityChange={(v) => updateLayer('logs', { opacity: v })}
                />
                <LayerControl 
                    id="tops" 
                    label="Formation Tops" 
                    visible={layers.tops.visible} 
                    onToggle={(v) => updateLayer('tops', { visible: v })}
                />
                <LayerControl 
                    id="correlations" 
                    label="Correlation Lines" 
                    visible={layers.correlations.visible} 
                    onToggle={(v) => updateLayer('correlations', { visible: v })}
                />
                <LayerControl 
                    id="ghosts" 
                    label="Ghost Curves" 
                    visible={layers.ghosts.visible} 
                    opacity={layers.ghosts.opacity}
                    onToggle={(v) => updateLayer('ghosts', { visible: v })}
                    onOpacityChange={(v) => updateLayer('ghosts', { opacity: v })}
                />
            </CardContent>
        </Card>
    );
};

export default WellCorrelationLayerManager;