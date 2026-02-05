import React from 'react';
import { useTrackConfiguration } from '@/hooks/useTrackConfiguration';
import { GripHorizontal, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TrackRenderer = ({ 
  track, 
  wellData, 
  depths, 
  depthRange, 
  height,
  onResizeStart 
}) => {
  // Simple implementation for log tracks
  return (
    <div 
      className="relative h-full border-r border-slate-800 bg-slate-950 group shrink-0 transition-all duration-200 ease-out flex flex-col"
      style={{ width: track.width }}
    >
      {/* Header */}
      <div className="h-8 border-b border-slate-800 bg-slate-900 flex items-center px-1 justify-between select-none">
        <span className="text-[10px] font-bold truncate tracking-tight text-slate-300 pl-1">
          {track.title}
        </span>
        <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Settings className="w-3 h-3 text-slate-500" />
        </Button>
      </div>

      {/* Canvas */}
      <div className="relative w-full flex-1 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-slate-600 text-[9px]">
          {track.type === 'LOG' ? 'Log Curves' : 'Track Content'}
        </div>
        {/* Placeholder for actual curve rendering */}
      </div>

      {/* Resize Handle */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/50 z-20 group-hover:bg-slate-700/30 transition-colors flex items-center justify-center group/handle outline-none"
        onMouseDown={(e) => onResizeStart(e, track.id)}
      >
        <div className="h-8 w-3 bg-blue-500/80 rounded-l opacity-0 group-hover/handle:opacity-100 flex items-center justify-center transition-opacity shadow-lg">
           <GripHorizontal className="w-2 h-2 text-white rotate-90" />
        </div>
      </div>
    </div>
  );
};

export default TrackRenderer;