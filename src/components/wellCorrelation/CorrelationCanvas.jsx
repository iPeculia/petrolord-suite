import React from 'react';
import { useWellManager } from '@/hooks/useWellCorrelation';

const CorrelationCanvas = () => {
  const { wells } = useWellManager();

  return (
    <div className="flex-1 bg-[#1a1a1a] relative overflow-auto flex items-center justify-center">
      {wells.length === 0 ? (
        <div className="text-center text-slate-600">
          <p className="text-lg font-medium">Empty Canvas</p>
          <p className="text-sm">Add wells from the left sidebar to begin correlation.</p>
        </div>
      ) : (
        <div className="flex gap-4 p-8 h-full min-w-max">
          {wells.map((well, idx) => (
            <div key={well.id} className="w-40 h-full bg-white flex flex-col border border-slate-400 shadow-lg relative">
              <div className="h-20 border-b border-slate-300 bg-slate-100 flex flex-col items-center justify-center p-2">
                <span className="font-bold text-sm text-slate-800">{well.name}</span>
                <span className="text-[10px] text-slate-500">KB: {well.kb}m</span>
              </div>
              {/* Mock Tracks */}
              <div className="flex-1 flex relative">
                <div className="w-8 border-r border-slate-200 bg-slate-50 h-full flex flex-col justify-between py-2 items-center text-[8px] text-slate-400">
                  <span>0</span>
                  <span>{well.totalDepth / 2}</span>
                  <span>{well.totalDepth}</span>
                </div>
                <div className="flex-1 bg-white relative">
                  {/* Mock Curve */}
                  <svg className="absolute inset-0 w-full h-full opacity-50" preserveAspectRatio="none" viewBox={`0 0 100 ${well.totalDepth}`}>
                    <path d={`M 10,0 Q 50,${well.totalDepth/4} 20,${well.totalDepth/2} T 80,${well.totalDepth}`} fill="none" stroke="green" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CorrelationCanvas;