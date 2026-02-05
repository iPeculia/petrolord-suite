import React from 'react';
import { Card } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Layers, Activity, Box, Waves, Eye, Maximize, RotateCcw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const AdvancedViewerControls = ({ layers, toggleLayer, onReset }) => {
  return (
    <Card className="absolute top-4 right-4 w-64 bg-slate-900/90 border-slate-800 backdrop-blur-md p-3 flex flex-col gap-4 z-10">
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Layers</h4>
        <div className="flex flex-wrap gap-2">
          <Toggle 
            pressed={layers.grid} 
            onPressedChange={() => toggleLayer('grid')}
            className="data-[state=on]:bg-blue-600 data-[state=on]:text-white border-slate-700"
            size="sm"
          >
            <Box className="w-4 h-4 mr-1" /> Grid
          </Toggle>
          <Toggle 
            pressed={layers.faults} 
            onPressedChange={() => toggleLayer('faults')}
            className="data-[state=on]:bg-rose-600 data-[state=on]:text-white border-slate-700"
            size="sm"
          >
            <Activity className="w-4 h-4 mr-1" /> Faults
          </Toggle>
          <Toggle 
            pressed={layers.seismic} 
            onPressedChange={() => toggleLayer('seismic')}
            className="data-[state=on]:bg-emerald-600 data-[state=on]:text-white border-slate-700"
            size="sm"
          >
            <Waves className="w-4 h-4 mr-1" /> Seismic
          </Toggle>
          <Toggle 
            pressed={layers.wells} 
            onPressedChange={() => toggleLayer('wells')}
            className="data-[state=on]:bg-amber-600 data-[state=on]:text-white border-slate-700"
            size="sm"
          >
            <Maximize className="w-4 h-4 mr-1" /> Wells
          </Toggle>
        </div>
      </div>

      <Separator className="bg-slate-800" />

      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Clipping (Z-Slice)</h4>
        <Slider defaultValue={[50]} max={100} step={1} className="py-2" />
      </div>

      <Separator className="bg-slate-800" />

      <div className="flex justify-between">
        <Button variant="ghost" size="sm" onClick={onReset} className="text-slate-400 hover:text-white">
          <RotateCcw className="w-4 h-4 mr-2" /> Reset View
        </Button>
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
          <Eye className="w-4 h-4 mr-2" /> Options
        </Button>
      </div>
    </Card>
  );
};

export default AdvancedViewerControls;