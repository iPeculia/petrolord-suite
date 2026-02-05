import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

const CrossSectionPropertyColoringPanel = ({ colorSettings, setColorSettings, availableProperties }) => {
    
    const handleRangeChange = (val) => {
        setColorSettings(p => ({ ...p, min: val[0], max: val[1] }));
    };

    return (
        <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
                <Label className="text-xs text-slate-300">Enable Coloring</Label>
                <Switch 
                    checked={colorSettings.mode === 'property'}
                    onCheckedChange={(c) => setColorSettings(p => ({...p, mode: c ? 'property' : 'solid'}))}
                />
            </div>

            {colorSettings.mode === 'property' && (
                <>
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-400">Property</Label>
                        <Select value={colorSettings.property} onValueChange={v => setColorSettings(p => ({...p, property: v}))}>
                            <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {availableProperties.map(prop => (
                                    <SelectItem key={prop} value={prop}>{prop}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-slate-400">Color Scale</Label>
                        <Select value={colorSettings.scale} onValueChange={v => setColorSettings(p => ({...p, scale: v}))}>
                            <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="rainbow">Rainbow</SelectItem>
                                <SelectItem value="jet">Jet</SelectItem>
                                <SelectItem value="viridis">Viridis</SelectItem>
                                <SelectItem value="plasma">Plasma</SelectItem>
                                <SelectItem value="grayscale">Grayscale</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>Min: {colorSettings.min}</span>
                            <span>Max: {colorSettings.max}</span>
                        </div>
                        <Slider 
                            value={[colorSettings.min, colorSettings.max]} 
                            min={0} max={200} step={1} 
                            onValueChange={handleRangeChange} 
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default CrossSectionPropertyColoringPanel;