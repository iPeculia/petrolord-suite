import React from 'react';
import { useCorrelationView } from '@/hooks/useCorrelationView';
import { 
  ZoomIn, ZoomOut, Maximize, RotateCcw, Lock, Unlock, 
  MoveHorizontal, MoveVertical, Palette, Layers, Grid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const SCALE_PRESETS = [
  { label: '1:100', value: 10 }, // Assuming 10px/m roughly maps to 1:100 on generic screens
  { label: '1:200', value: 5 },
  { label: '1:500', value: 2 },
  { label: '1:1000', value: 1 },
  { label: '1:2000', value: 0.5 },
];

const BACKGROUND_PRESETS = [
  { label: 'Dark', value: '#0f172a' },
  { label: 'Navy', value: '#001F3F' },
  { label: 'Forest', value: '#0B3D2C' },
  { label: 'Charcoal', value: '#1A1A1A' },
  { label: 'Slate', value: '#334155' },
  { label: 'Light', value: '#F8FAFC' },
];

const CorrelationViewToolbar = () => {
  const {
    zoom,
    verticalScale,
    verticalScaleLocked,
    fixedRatio,
    spacingMode,
    spacingValue,
    backgroundColor,
    backgroundOpacity,
    
    zoomIn,
    zoomOut,
    zoomToFit,
    setZoom,
    setVerticalScale,
    toggleScaleLock,
    toggleFixedRatio,
    setSpacingMode,
    setSpacingValue,
    setBackground,
    setBackgroundOpacity,
    resetView
  } = useCorrelationView();

  return (
    <div className="h-12 border-b border-slate-800 bg-slate-900 flex items-center px-2 gap-2 shadow-sm shrink-0 overflow-x-auto">
      
      {/* VIEW CONTROLS */}
      <div className="flex items-center gap-1 pr-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-400" onClick={resetView}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-[10px]">Reset View</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-400" onClick={zoomToFit}>
                <Maximize className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-[10px]">Fit All Wells</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Separator orientation="vertical" className="h-6 bg-slate-700" />

      {/* ZOOM CONTROLS */}
      <div className="flex items-center gap-2 px-2">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomOut}>
          <ZoomOut className="w-3.5 h-3.5 text-slate-400" />
        </Button>
        <div className="w-20">
          <Slider 
            value={[zoom * 100]} 
            min={10} 
            max={500} 
            step={5} 
            onValueChange={([v]) => setZoom(v / 100)}
            className="[&>.relative>.absolute]:bg-blue-500"
          />
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomIn}>
          <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
        </Button>
        <span className="text-[10px] font-mono text-slate-400 w-10 text-center">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      <Separator orientation="vertical" className="h-6 bg-slate-700" />

      {/* SCALE CONTROLS */}
      <div className="flex items-center gap-2 px-2">
        <div className="flex items-center gap-1 mr-1">
          <MoveVertical className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[10px] text-slate-400 font-medium hidden lg:inline">Scale</span>
        </div>
        
        <Select 
          value={SCALE_PRESETS.find(p => p.value === verticalScale)?.label || 'Custom'} 
          onValueChange={(val) => {
            const preset = SCALE_PRESETS.find(p => p.label === val);
            if (preset) setVerticalScale(preset.value);
          }}
          disabled={verticalScaleLocked}
        >
          <SelectTrigger className="h-7 w-[80px] text-[10px] bg-slate-950 border-slate-700">
            <SelectValue placeholder="Scale" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800">
            {SCALE_PRESETS.map(p => (
              <SelectItem key={p.label} value={p.label} className="text-[10px]">{p.label}</SelectItem>
            ))}
            <SelectItem value="Custom" className="text-[10px]">Custom</SelectItem>
          </SelectContent>
        </Select>

        <div className="w-24 mx-1">
           <Slider 
            value={[verticalScale]} 
            min={0.1} 
            max={20} 
            step={0.1} 
            onValueChange={([v]) => setVerticalScale(v)}
            disabled={verticalScaleLocked}
            className="[&>.relative>.absolute]:bg-green-500"
          />
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle 
                pressed={verticalScaleLocked} 
                onPressedChange={toggleScaleLock}
                size="sm" 
                className="h-7 w-7 p-0 data-[state=on]:bg-slate-800"
              >
                {verticalScaleLocked ? <Lock className="w-3 h-3 text-amber-500" /> : <Unlock className="w-3 h-3 text-slate-500" />}
              </Toggle>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-[10px]">Lock Scale</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Separator orientation="vertical" className="h-6 bg-slate-700" />

      {/* SPACING CONTROLS */}
      <div className="flex items-center gap-2 px-2">
        <div className="flex items-center gap-1 mr-1">
          <MoveHorizontal className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-[10px] text-slate-400 font-medium hidden xl:inline">Spacing</span>
        </div>
        
        <Select value={spacingMode} onValueChange={setSpacingMode}>
          <SelectTrigger className="h-7 w-[85px] text-[10px] bg-slate-950 border-slate-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800">
            <SelectItem value="constant" className="text-[10px]">Constant</SelectItem>
            <SelectItem value="relative" className="text-[10px]">Relative</SelectItem>
            <SelectItem value="proportional" className="text-[10px]">Prop.</SelectItem>
          </SelectContent>
        </Select>

        <div className="w-20 mx-1">
           <Slider 
            value={[spacingValue]} 
            min={spacingMode === 'constant' ? 0 : 0.1} 
            max={spacingMode === 'constant' ? 200 : 5} 
            step={spacingMode === 'constant' ? 5 : 0.1} 
            onValueChange={([v]) => setSpacingValue(v)}
            className="[&>.relative>.absolute]:bg-purple-500"
          />
        </div>
      </div>

      <Separator orientation="vertical" className="h-6 bg-slate-700" />

      {/* BACKGROUND CONTROLS */}
      <div className="flex items-center gap-2 px-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-7 w-12 px-1 bg-slate-950 border-slate-700 flex items-center justify-center gap-1">
              <div className="w-3 h-3 rounded-full border border-slate-500" style={{ backgroundColor: backgroundColor }} />
              <span className="text-[10px] text-slate-400">{Math.round(backgroundOpacity * 100)}%</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 bg-slate-900 border-slate-800 p-3" align="end">
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-slate-300 flex items-center gap-2">
                <Palette className="w-3 h-3" /> Background Settings
              </h4>
              
              <div className="grid grid-cols-6 gap-1">
                {BACKGROUND_PRESETS.map(preset => (
                  <TooltipProvider key={preset.label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={`w-8 h-8 rounded border border-slate-700 hover:scale-110 transition-transform ${backgroundColor === preset.value ? 'ring-2 ring-white border-transparent' : ''}`}
                          style={{ backgroundColor: preset.value }}
                          onClick={() => setBackground(preset.value)}
                        />
                      </TooltipTrigger>
                      <TooltipContent className="text-[10px]">{preset.label}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <Label className="text-[10px] text-slate-400">Custom Color</Label>
                  <span className="text-[10px] font-mono text-slate-500">{backgroundColor}</span>
                </div>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={backgroundColor}
                    onChange={(e) => setBackground(e.target.value)}
                    className="h-8 w-full p-0 border-none bg-transparent cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <Label className="text-[10px] text-slate-400">Opacity</Label>
                  <span className="text-[10px] font-mono text-slate-500">{Math.round(backgroundOpacity * 100)}%</span>
                </div>
                <Slider 
                  value={[backgroundOpacity * 100]} 
                  max={100} 
                  step={5} 
                  onValueChange={([v]) => setBackgroundOpacity(v / 100)}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

    </div>
  );
};

export default CorrelationViewToolbar;