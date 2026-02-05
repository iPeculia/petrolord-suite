import React from 'react';

const DepthTrack = ({ pixelsPerMeter, maxDepth }) => {
  const renderDepthMarkers = () => {
    const markers = [];
    const interval = 100; // Mark every 100 meters
    const maxDepthPx = maxDepth * pixelsPerMeter;

    for (let depth = 0; depth <= maxDepth + interval; depth += interval) {
      const topPx = depth * pixelsPerMeter;
      markers.push(
        <div
          key={depth}
          className="absolute left-0 w-full text-right pr-2 text-xs text-slate-400 border-b border-slate-700"
          style={{ top: `${topPx}px`, height: '1px' }}
        >
          {depth} m
        </div>
      );
    }
    return markers;
  };

  const trackHeight = Math.max(window.innerHeight, maxDepth * pixelsPerMeter + 200); // Match canvas height

  return (
    <div className="w-20 bg-slate-800/50 border-r border-slate-700 flex-shrink-0 relative overflow-hidden" style={{ height: `${trackHeight}px` }}>
      {renderDepthMarkers()}
    </div>
  );
};

export default DepthTrack;