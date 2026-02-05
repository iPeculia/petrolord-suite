import React, { useState, useMemo, useRef, useEffect } from 'react';
import DepthTrack from './DepthTrack';
import LogTrack from './LogTrack';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, Maximize, ArrowUp, ArrowDown, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const WellLogViewer = ({ selectedWells = [] }) => {
  const [zoomLevel, setZoomLevel] = useState(1); // Scale factor 1x to 10x
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useRef(null);

  // Determine global depth range from all selected wells to unify scales
  const { minDepth, maxDepth } = useMemo(() => {
    if (!selectedWells.length) return { minDepth: 0, maxDepth: 1000 };
    let min = Infinity;
    let max = -Infinity;
    
    selectedWells.forEach(w => {
      if (w.depthInfo) {
        if (w.depthInfo.start < min) min = w.depthInfo.start;
        if (w.depthInfo.stop > max) max = w.depthInfo.stop;
      }
    });
    
    return { 
      minDepth: min === Infinity ? 0 : min, 
      maxDepth: max === -Infinity ? 1000 : max 
    };
  }, [selectedWells]);

  // Base pixel height for 1:1 view (e.g., 1 pixel per depth unit)
  // Multiplied by zoom level
  const baseHeight = 800; // Minimum viewport height
  const contentHeight = Math.max(baseHeight, (maxDepth - minDepth) * zoomLevel * 2); 

  const handleResetZoom = () => setZoomLevel(1);
  
  const handleScroll = (e) => {
    setScrollPosition(e.currentTarget.scrollTop);
  };

  if (selectedWells.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-slate-500">
        <div className="w-16 h-16 border-2 border-slate-800 rounded-lg flex items-center justify-center mb-4 border-dashed">
          <Maximize className="w-8 h-8 opacity-20" />
        </div>
        <p className="text-sm font-medium">No Wells Selected</p>
        <p className="text-xs opacity-60 mt-1">Select wells from the list to visualize logs.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Toolbar */}
      <div className="h-12 border-b border-slate-800 flex items-center px-4 gap-4 bg-slate-900 shrink-0 justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-md border border-slate-800">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.5))}>
                    <ZoomOut className="w-3 h-3 text-slate-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Zoom Out</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Slider 
              min={0.5} 
              max={10} 
              step={0.1} 
              value={[zoomLevel]} 
              onValueChange={(v) => setZoomLevel(v[0])}
              className="w-32"
            />
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setZoomLevel(z => Math.min(10, z + 0.5))}>
                    <ZoomIn className="w-3 h-3 text-slate-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Zoom In</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-400 hover:text-white" onClick={handleResetZoom}>
            <RefreshCcw className="w-3 h-3 mr-2" /> Reset View
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono bg-slate-950 px-3 py-1 rounded border border-slate-800">
          <ArrowUp className="w-3 h-3" />
          <span>{minDepth.toFixed(0)}</span>
          <span className="mx-1">-</span>
          <span>{maxDepth.toFixed(0)}</span>
          <ArrowDown className="w-3 h-3" />
          <span className="ml-1 text-slate-600">MD</span>
        </div>
      </div>

      {/* Viewer Canvas Container */}
      <div className="flex-1 overflow-hidden relative w-full">
        <ScrollArea className="h-full w-full" onScroll={handleScroll} ref={scrollRef}>
          <div className="flex min-w-max" style={{ height: contentHeight }}>
            {/* Sticky Depth Track (logic handled via sticky CSS or separate scroll sync) */}
            {/* For simplicity in this implementation, we render it inline. 
                In a robust pro app, separate scroll sync containers are better. */}
            <div className="sticky left-0 z-10 h-full shadow-xl">
              <DepthTrack 
                minDepth={minDepth} 
                maxDepth={maxDepth} 
                height="100%" // Fill container
              />
            </div>
            
            {/* Log Tracks */}
            <div className="flex h-full divide-x divide-slate-800">
              {selectedWells.map(well => (
                <LogTrack 
                  key={well.id}
                  wellName={well.name}
                  depth={well.depthInfo?.depths || []}
                  curves={well.curves}
                  minDepth={minDepth}
                  maxDepth={maxDepth}
                  height="100%"
                />
              ))}
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default WellLogViewer;