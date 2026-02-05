import React from 'react';
import { useTrackConfigurationContext } from '@/contexts/TrackConfigurationContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GripVertical, Eye, EyeOff, Grid3X3, Layers } from 'lucide-react';

const LayerManagement = () => {
  const { layers, toggleLayer, gridSettings, updateGridSettings } = useTrackConfigurationContext();

  // Ensure gridSettings is always defined to prevent "cannot read property of undefined"
  const safeGridSettings = gridSettings || { vertical: true, horizontal: true, style: 'solid', opacity: 0.2 };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200">
      
      {/* Grid Settings Section */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/30">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4">
          <Grid3X3 className="w-3 h-3 text-blue-500" /> Grid Configuration
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 p-2 bg-slate-900 rounded border border-slate-800">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] text-slate-400">Vertical</Label>
                <Switch 
                  checked={!!safeGridSettings.vertical} 
                  onCheckedChange={(c) => updateGridSettings({ vertical: c })}
                  className="scale-75 data-[state=checked]:bg-blue-600"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-[10px] text-slate-400">Horizontal</Label>
                <Switch 
                  checked={!!safeGridSettings.horizontal} 
                  onCheckedChange={(c) => updateGridSettings({ horizontal: c })}
                  className="scale-75 data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>

            <div className="space-y-2">
               <Label className="text-[10px] text-slate-400">Line Style</Label>
               <Select value={safeGridSettings.style || 'solid'} onValueChange={(v) => updateGridSettings({ style: v })}>
                 <SelectTrigger className="h-7 text-[10px] bg-slate-900 border-slate-800 focus:ring-blue-900"><SelectValue /></SelectTrigger>
                 <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                   <SelectItem value="solid">Solid</SelectItem>
                   <SelectItem value="dashed">Dashed</SelectItem>
                   <SelectItem value="dotted">Dotted</SelectItem>
                 </SelectContent>
               </Select>
            </div>
          </div>
          
          <div className="space-y-2">
             <div className="flex justify-between text-[10px] text-slate-400">
               <span>Opacity</span>
               <span>{Math.round((safeGridSettings.opacity || 0.2) * 100)}%</span>
             </div>
             <Slider 
               value={[(safeGridSettings.opacity || 0.2) * 100]} 
               max={100} 
               step={5} 
               onValueChange={([v]) => updateGridSettings({ opacity: v / 100 })}
               className="[&>.relative>.absolute]:bg-blue-600"
             />
          </div>
        </div>
      </div>

      {/* Layers List */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/10">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-3 h-3 text-purple-500" /> Layer Visibility
        </h3>
      </div>

      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {(layers || []).map((layer, index) => (
            <div 
              key={layer.id || index} 
              className="flex items-center justify-between p-2.5 rounded-md bg-slate-900/40 hover:bg-slate-800 border border-slate-800/50 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-slate-700 cursor-move group-hover:text-slate-500 transition-colors" />
                <Label className="text-xs font-medium cursor-pointer select-none" htmlFor={`layer-${layer.id}`}>
                  {layer.name}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                {layer.visible ? 
                  <Eye className="w-3.5 h-3.5 text-emerald-500" /> : 
                  <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                }
                <Switch 
                  id={`layer-${layer.id}`}
                  checked={!!layer.visible}
                  onCheckedChange={() => toggleLayer(layer.id)}
                  className="scale-75 data-[state=checked]:bg-emerald-600"
                />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LayerManagement;