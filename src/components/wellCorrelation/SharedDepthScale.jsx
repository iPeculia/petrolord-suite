import React from 'react';

const SharedDepthScale = ({ minDepth, maxDepth, height }) => {
  const range = maxDepth - minDepth;
  const majorStep = 100; // Could be dynamic based on range
  const minorStep = 20;
  
  const ticks = [];
  // Generate ticks
  for (let d = Math.ceil(minDepth / minorStep) * minorStep; d <= maxDepth; d += minorStep) {
    ticks.push({ 
      depth: d, 
      isMajor: d % majorStep === 0 
    });
  }

  return (
    <div className="w-16 flex flex-col h-full bg-slate-900 border-r border-slate-800 select-none shrink-0 z-10 shadow-lg">
      {/* Header matching Well Header Height */}
      <div className="h-[100px] border-b border-slate-800 flex items-end justify-center pb-2 bg-slate-900">
        <span className="text-xs font-bold text-slate-400 rotate-0">Depth (MD)</span>
      </div>
      
      {/* Scale */}
      <div className="flex-1 relative overflow-hidden bg-slate-950">
        {ticks.map((tick) => {
          const topPct = ((tick.depth - minDepth) / range) * 100;
          return (
            <div 
              key={tick.depth}
              className={`absolute w-full flex items-center justify-end pr-1 border-t ${tick.isMajor ? 'border-slate-600' : 'border-slate-800'}`}
              style={{ top: `${topPct}%` }}
            >
              {tick.isMajor && (
                <span className="text-[10px] font-mono text-slate-400 -mt-2 bg-slate-950 px-0.5">
                  {tick.depth}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SharedDepthScale;