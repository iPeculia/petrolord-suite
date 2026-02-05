import React from 'react';

const DepthTrack = ({ minDepth, maxDepth, unit = 'M', height = 600 }) => {
  // Generate ticks
  const range = maxDepth - minDepth;
  const step = range / 10; // 10 major ticks
  const ticks = [];
  
  for (let d = minDepth; d <= maxDepth; d += step) {
    ticks.push(d);
  }

  return (
    <div className="w-16 flex flex-col h-full border-r border-slate-800 bg-slate-900/50 select-none">
      <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center justify-center">
        <span className="text-[10px] font-bold text-slate-500">{unit}</span>
      </div>
      <div className="flex-1 relative overflow-hidden">
        {ticks.map((tick, i) => (
          <div 
            key={i}
            className="absolute w-full border-t border-slate-700 text-[10px] text-slate-500 font-mono text-right pr-1"
            style={{ top: `${((tick - minDepth) / range) * 100}%` }}
          >
            {tick.toFixed(0)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepthTrack;