import React from 'react';
import { useCasingWearAnalyzer } from '../contexts/CasingWearAnalyzerContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import { ZoomIn, ZoomOut, RotateCcw, HelpCircle, Keyboard } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

const UXControls = ({ onToggleHelp, onToggleShortcuts }) => {
  const { zoomLevel, setZoomLevel, resetView, uiPreferences, toggleUiPreference } = useCasingWearAnalyzer();

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-full shadow-xl p-2 flex items-center gap-4 z-40 px-6">
      
      {/* Zoom Controls */}
      <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}>
          <ZoomOut className="w-4 h-4 text-slate-400" />
        </Button>
        <div className="w-24">
          <Slider 
            value={[zoomLevel]} 
            min={0.5} max={2.0} step={0.1} 
            onValueChange={([val]) => setZoomLevel(val)}
          />
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setZoomLevel(Math.min(2.0, zoomLevel + 0.1))}>
          <ZoomIn className="w-4 h-4 text-slate-400" />
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full ml-1" onClick={resetView}>
                <RotateCcw className="w-3 h-3 text-slate-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Reset View</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle 
                pressed={uiPreferences.showTooltips} 
                onPressedChange={() => toggleUiPreference('showTooltips')}
                className="data-[state=on]:bg-amber-500/20 data-[state=on]:text-amber-500 h-8 px-3 text-xs"
              >
                Tips
              </Toggle>
            </TooltipTrigger>
            <TooltipContent><p>Show/Hide Tooltips</p></TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Help & Shortcuts */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-800" onClick={onToggleShortcuts}>
          <Keyboard className="w-4 h-4 text-slate-400" />
        </Button>
        <Button variant="default" size="sm" className="h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 text-xs px-4" onClick={onToggleHelp}>
          <HelpCircle className="w-3 h-3 mr-2" /> Help
        </Button>
      </div>

    </div>
  );
};

export default UXControls;