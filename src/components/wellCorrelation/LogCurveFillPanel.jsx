import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PaintBucket, X, Check, Palette } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const FILL_TYPES = [
  { value: 'none', label: 'None' },
  { value: 'left', label: 'Track to Curve (Left)' },
  { value: 'right', label: 'Curve to Track (Right)' },
  { value: 'constant', label: 'Curve to Value' },
  { value: 'curve-to-curve', label: 'Between Curves' },
];

const PATTERNS = [
  { value: 'solid', label: 'Solid' },
  { value: 'diagonal', label: 'Diagonal Lines' },
  { value: 'crosshatch', label: 'Crosshatch' },
  { value: 'dots', label: 'Dots' },
];

const LogCurveFillPanel = ({ log, otherLogs, onUpdate }) => {
  const fillSettings = log.fill || { type: 'none', color: log.color, opacity: 0.2, pattern: 'solid' };

  const update = (updates) => {
    onUpdate({ ...fillSettings, ...updates });
  };

  return (
    <div className="space-y-3 p-2 bg-slate-900/50 rounded border border-slate-800/50">
      <div className="flex items-center gap-2">
        <PaintBucket className="w-3 h-3 text-slate-400" />
        <span className="text-[10px] font-bold text-slate-400 uppercase">Fill Settings</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-[10px] text-slate-500">Type</Label>
          <Select value={fillSettings.type} onValueChange={(v) => update({ type: v })}>
            <SelectTrigger className="h-6 text-[10px] bg-slate-950 border-slate-800"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
              {FILL_TYPES.map(t => <SelectItem key={t.value} value={t.value} className="text-[10px]">{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-[10px] text-slate-500">Pattern</Label>
          <Select value={fillSettings.pattern || 'solid'} onValueChange={(v) => update({ pattern: v })}>
            <SelectTrigger className="h-6 text-[10px] bg-slate-950 border-slate-800"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
              {PATTERNS.map(p => <SelectItem key={p.value} value={p.value} className="text-[10px]">{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {fillSettings.type !== 'none' && (
        <div className="space-y-3 animate-in slide-in-from-top-1 fade-in">
          {/* Color & Opacity */}
          <div className="flex items-center gap-2">
             <div className="flex-1 space-y-1">
                <Label className="text-[10px] text-slate-500">Color</Label>
                <div className="flex gap-2">
                    <Input 
                        type="color" 
                        value={fillSettings.color || log.color} 
                        onChange={(e) => update({ color: e.target.value })}
                        className="h-6 w-8 p-0 border-none bg-transparent cursor-pointer"
                    />
                    <div className="text-[10px] text-slate-400 font-mono self-center">{fillSettings.color || log.color}</div>
                </div>
             </div>
             <div className="flex-[2] space-y-1">
                <div className="flex justify-between">
                    <Label className="text-[10px] text-slate-500">Opacity</Label>
                    <span className="text-[10px] text-slate-400">{Math.round((fillSettings.opacity || 0.2) * 100)}%</span>
                </div>
                <Slider 
                    min={0} max={1} step={0.05} 
                    value={[fillSettings.opacity || 0.2]} 
                    onValueChange={([v]) => update({ opacity: v })}
                    className="[&>.relative>.absolute]:bg-slate-500"
                />
             </div>
          </div>

          {/* Conditional Inputs */}
          {fillSettings.type === 'constant' && (
             <div className="space-y-1">
                <Label className="text-[10px] text-slate-500">Reference Value</Label>
                <Input 
                    type="number" 
                    value={fillSettings.constantValue || 0} 
                    onChange={(e) => update({ constantValue: e.target.value })}
                    className="h-6 text-xs bg-slate-950 border-slate-800"
                />
             </div>
          )}

          {fillSettings.type === 'curve-to-curve' && (
             <div className="space-y-1">
                <Label className="text-[10px] text-slate-500">Reference Curve</Label>
                <Select value={fillSettings.referenceCurveId} onValueChange={(v) => update({ referenceCurveId: v })}>
                    <SelectTrigger className="h-6 text-[10px] bg-slate-950 border-slate-800"><SelectValue placeholder="Select curve..." /></SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-300">
                        {otherLogs.filter(l => l.id !== log.id).map(l => (
                            <SelectItem key={l.id} value={l.id} className="text-[10px]">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{background: l.color}}></span>
                                    {l.mnemonic}
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LogCurveFillPanel;