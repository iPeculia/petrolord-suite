import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LogCustomizationPanel = ({ log, onChange, onRemove }) => {
  if (!log) return null;

  return (
    <div className="space-y-4 p-3 bg-slate-950/50 rounded border border-slate-800 mt-2 animate-in slide-in-from-top-2 fade-in duration-200">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: log.color }} />
          <span className="text-xs font-bold text-slate-200">{log.mnemonic} Settings</span>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-slate-500 hover:text-white"
            onClick={() => onChange('visible', !log.visible)}
          >
            {log.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-slate-500 hover:text-red-400"
            onClick={onRemove}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[10px] text-slate-400">Line Color</Label>
          <div className="flex gap-2">
            <Input 
              type="color" 
              value={log.color} 
              onChange={(e) => onChange('color', e.target.value)}
              className="h-6 w-full p-0 border-none bg-transparent cursor-pointer"
            />
          </div>
        </div>
        
        <div className="space-y-1.5">
          <Label className="text-[10px] text-slate-400">Line Style</Label>
          <Select value={log.lineStyle || 'solid'} onValueChange={(v) => onChange('lineStyle', v)}>
            <SelectTrigger className="h-6 text-[10px] bg-slate-900 border-slate-800"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
              <SelectItem value="solid" className="text-[10px]">Solid</SelectItem>
              <SelectItem value="dashed" className="text-[10px]">Dashed</SelectItem>
              <SelectItem value="dotted" className="text-[10px]">Dotted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between">
          <Label className="text-[10px] text-slate-400">Line Width</Label>
          <span className="text-[10px] text-slate-500">{log.lineWidth || 1}px</span>
        </div>
        <Slider 
          min={0.5} 
          max={5} 
          step={0.5} 
          value={[log.lineWidth || 1]} 
          onValueChange={([v]) => onChange('lineWidth', v)}
          className="[&>.relative>.absolute]:bg-blue-500"
        />
      </div>

      <div className="space-y-2 border-t border-slate-800 pt-2">
        <Label className="text-[10px] font-bold text-slate-500 uppercase">Filling</Label>
        <div className="grid grid-cols-2 gap-3">
           <div className="space-y-1.5">
             <Label className="text-[10px] text-slate-400">Fill Type</Label>
             <Select value={log.fill || 'none'} onValueChange={(v) => onChange('fill', v)}>
                <SelectTrigger className="h-6 text-[10px] bg-slate-900 border-slate-800"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                  <SelectItem value="none" className="text-[10px]">None</SelectItem>
                  <SelectItem value="left" className="text-[10px]">Left</SelectItem>
                  <SelectItem value="right" className="text-[10px]">Right</SelectItem>
                  <SelectItem value="both" className="text-[10px]">Full</SelectItem>
                </SelectContent>
             </Select>
           </div>
           <div className="space-y-1.5">
             <Label className="text-[10px] text-slate-400">Opacity</Label>
             <Slider 
                min={0} 
                max={1} 
                step={0.1} 
                value={[log.fillOpacity || 0.2]} 
                onValueChange={([v]) => onChange('fillOpacity', v)}
                className="py-1"
             />
           </div>
        </div>
      </div>
    </div>
  );
};

export default LogCustomizationPanel;