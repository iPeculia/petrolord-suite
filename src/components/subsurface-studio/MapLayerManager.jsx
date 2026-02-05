import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

const MapLayerManager = ({ layers, setLayers }) => {
    // Defensive check: if layers is undefined/null, render nothing
    if (!layers || typeof layers !== 'object') return null;

    const handleToggle = (layerKey) => {
        setLayers(prev => ({
            ...prev,
            [layerKey]: {
                ...prev[layerKey],
                visible: !prev[layerKey]?.visible
            }
        }));
    };

    const handleOpacityChange = (layerKey, newVal) => {
        setLayers(prev => ({
            ...prev,
            [layerKey]: {
                ...prev[layerKey],
                opacity: newVal[0]
            }
        }));
    };

    const layerConfig = [
        { key: 'wells', label: 'Wells', badge: 'Points' },
        { key: 'seismic', label: 'Seismic Nav', badge: 'Lines' },
        { key: 'faults', label: 'Fault Traces', badge: 'Polylines' },
        { key: 'horizons', label: 'Horizons', badge: 'Contours' },
        { key: 'grid', label: 'Grid Boundary', badge: 'Polygons' },
        { key: 'drawings', label: 'Drawings', badge: 'User' }
    ];

    return (
        <div className="space-y-4">
            {layerConfig.map(({ key, label, badge }) => {
                const layer = layers[key];
                // Skip if this layer key doesn't exist in the state
                if (!layer) return null;

                return (
                    <div key={key} className="space-y-2 bg-slate-800/50 p-2 rounded border border-slate-700/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Switch 
                                    id={`layer-${key}`}
                                    checked={!!layer.visible}
                                    onCheckedChange={() => handleToggle(key)}
                                    className="data-[state=checked]:bg-lime-500"
                                />
                                <Label htmlFor={`layer-${key}`} className="cursor-pointer text-slate-200 font-medium">{label}</Label>
                            </div>
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-slate-900 border-slate-600 text-slate-400">
                                {badge}
                            </Badge>
                        </div>
                        
                        {layer.visible && (
                            <div className="pl-11 pr-2 pt-1">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] text-slate-500 w-12">Opacity</span>
                                    <Slider 
                                        value={[layer.opacity || 1]} 
                                        min={0} 
                                        max={1} 
                                        step={0.1} 
                                        onValueChange={(val) => handleOpacityChange(key, val)}
                                        className="flex-grow py-1"
                                    />
                                    <span className="text-[10px] text-slate-400 w-6 text-right">{Math.round((layer.opacity || 1) * 100)}%</span>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default MapLayerManager;