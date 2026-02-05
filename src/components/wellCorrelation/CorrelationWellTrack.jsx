import React, { useMemo } from 'react';
import WellTrackHeader from './WellTrackHeader';
import LogTrack from './LogTrack'; 
import { useMarkers } from '@/hooks/useWellCorrelation';

const CorrelationWellTrack = ({ 
  well, 
  width = 200, 
  height = 600, 
  minDepth, 
  maxDepth, 
  zoomLevel,
  onRemove,
  onMarkerClick
}) => {
  const { markers } = useMarkers();
  
  // Filter markers for this well
  const wellMarkers = useMemo(() => 
    markers.filter(m => m.wellId === well.id),
  [markers, well.id]);

  return (
    <div className="flex flex-col h-full border-r border-slate-800 bg-slate-950 relative shrink-0" style={{ width }}>
      <WellTrackHeader well={well} width={width} onRemove={onRemove} />
      
      <div className="flex-1 relative overflow-hidden">
        {/* Log Curves */}
        <LogTrack 
          wellName={well.name}
          curves={well.curves}
          depth={well.depthInfo?.depths || []}
          minDepth={minDepth}
          maxDepth={maxDepth}
          height={height}
          showGrid={true}
        />

        {/* Markers Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {wellMarkers.map(marker => {
            if (marker.depth < minDepth || marker.depth > maxDepth) return null;
            
            // Calculate Y position percentage
            const range = maxDepth - minDepth;
            const topPct = ((marker.depth - minDepth) / range) * 100;
            
            return (
              <div 
                key={marker.id}
                className="absolute w-full border-t-2 border-dashed flex items-center group pointer-events-auto cursor-pointer hover:border-solid transition-all"
                style={{ 
                  top: `${topPct}%`, 
                  borderColor: marker.color,
                  color: marker.color
                }}
                title={`${marker.name} @ ${marker.depth}m`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onMarkerClick) onMarkerClick(marker.id);
                }}
              >
                <span className="text-[9px] font-bold bg-slate-950/80 px-1 ml-1 rounded shadow-sm group-hover:bg-slate-800">
                  {marker.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CorrelationWellTrack;