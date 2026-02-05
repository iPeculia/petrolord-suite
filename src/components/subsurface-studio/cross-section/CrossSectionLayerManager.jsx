import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Eye, EyeOff, GripVertical } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const LayerItem = ({ id, label, visible, opacity, onToggle, onOpacityChange }) => {
    return (
        <div className="flex items-center justify-between p-2 bg-slate-800/50 rounded-md border border-slate-700 hover:border-slate-600 transition-colors mb-2">
            <div className="flex items-center gap-2 flex-1">
                <GripVertical className="w-4 h-4 text-slate-500 cursor-grab" />
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-200">{label}</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="w-20">
                    <Slider 
                        value={[opacity * 100]} 
                        min={0} 
                        max={100} 
                        step={5}
                        onValueChange={(val) => onOpacityChange(id, val[0] / 100)} 
                        disabled={!visible}
                        className={!visible ? 'opacity-30' : ''}
                    />
                </div>
                <button onClick={() => onToggle(id)} className="text-slate-400 hover:text-white">
                    {visible ? <Eye className="w-4 h-4 text-cyan-400" /> : <EyeOff className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
};

const CrossSectionLayerManager = ({ layers, setLayers }) => {
    const handleToggle = (id) => {
        setLayers(prev => ({
            ...prev,
            [id]: { ...prev[id], visible: !prev[id].visible }
        }));
    };

    const handleOpacity = (id, val) => {
        setLayers(prev => ({
            ...prev,
            [id]: { ...prev[id], opacity: val }
        }));
    };

    return (
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Visible Layers</h3>
            <ScrollArea className="h-[300px] pr-3">
                {Object.entries(layers).map(([key, layer]) => (
                    <LayerItem 
                        key={key}
                        id={key}
                        label={layer.label}
                        visible={layer.visible}
                        opacity={layer.opacity}
                        onToggle={handleToggle}
                        onOpacityChange={handleOpacity}
                    />
                ))}
            </ScrollArea>
        </div>
    );
};

export default CrossSectionLayerManager;