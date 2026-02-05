import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Camera, Layers, Move3d } from 'lucide-react';

const ViewerControls = ({ onCameraChange, layers, onLayerToggle, verticalExaggeration, onVeChange }) => {
  return (
    <div className="absolute top-4 right-4 w-64 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg p-4 shadow-xl">
        <div className="space-y-4">
            <div>
                <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center">
                    <Camera className="w-3 h-3 mr-2"/> Camera Presets
                </h4>
                <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="xs" onClick={() => onCameraChange('top')}>Top</Button>
                    <Button variant="outline" size="xs" onClick={() => onCameraChange('front')}>Front</Button>
                    <Button variant="outline" size="xs" onClick={() => onCameraChange('iso')}>Iso</Button>
                </div>
            </div>

            <div className="space-y-2">
                 <h4 className="text-xs font-bold text-slate-300 mb-1 flex items-center">
                    <Move3d className="w-3 h-3 mr-2"/> Z-Exaggeration
                </h4>
                <Slider 
                    defaultValue={[verticalExaggeration]} 
                    min={1} max={10} step={0.5}
                    onValueChange={(v) => onVeChange(v[0])}
                />
            </div>

            <div>
                <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center">
                    <Layers className="w-3 h-3 mr-2"/> Layers
                </h4>
                <div className="space-y-2">
                    {Object.entries(layers).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between">
                            <Label className="text-xs capitalize">{key}</Label>
                            <Switch checked={val} onCheckedChange={() => onLayerToggle(key)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default ViewerControls;