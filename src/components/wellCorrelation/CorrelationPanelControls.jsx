import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, Lock, Unlock, RefreshCw, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const CorrelationPanelControls = ({ 
  zoom, 
  onZoomChange, 
  locked, 
  onToggleLock,
  onReset,
  onAddWell 
}) => {
  return (
    <div className="h-12 border-b border-slate-800 bg-slate-900 flex items-center px-4 justify-between shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-md border border-slate-800">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onZoomChange(Math.max(1, zoom - 0.5))}>
            <ZoomOut className="w-3.5 h-3.5 text-slate-400" />
          </Button>
          <Slider 
            value={[zoom]} 
            min={1} 
            max={10} 
            step={0.1} 
            onValueChange={(v) => onZoomChange(v[0])}
            className="w-24"
          />
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onZoomChange(Math.min(10, zoom + 0.5))}>
            <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
          </Button>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={locked ? "default" : "ghost"} 
                size="icon" 
                className={`h-8 w-8 ${locked ? 'bg-blue-600 hover:bg-blue-500' : 'text-slate-400'}`}
                onClick={onToggleLock}
              >
                {locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{locked ? "Unlock Depth Scale" : "Lock Depth Scale"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={onReset}>
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" className="bg-blue-600 hover:bg-blue-500 h-8 text-xs" onClick={onAddWell}>
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Well
        </Button>
      </div>
    </div>
  );
};

export default CorrelationPanelControls;