import React from 'react';

const StripLogViewer = ({ stripLogData, topDepth, baseDepth }) => {
  const totalDepth = baseDepth - topDepth;

  const lithologyPatterns = {
    'Sandstone': 'bg-yellow-400',
    'Shale': 'bg-gray-500',
    'Limestone': 'bg-blue-400',
  };

  return (
    <div className="h-full w-full flex bg-slate-800 p-4 rounded-md overflow-hidden">
      <div className="h-full flex flex-col justify-between text-right pr-2 text-sm text-slate-400">
        <span>{topDepth}m</span>
        <span>{baseDepth}m</span>
      </div>
      <div className="relative h-full w-1/2 bg-slate-900 rounded-sm overflow-hidden">
        {stripLogData.map((item, index) => {
          const height = (item.thickness / totalDepth) * 100;
          const top = ((item.top - topDepth) / totalDepth) * 100;
          return (
            <div
              key={index}
              className={`absolute w-full ${lithologyPatterns[item.lithology] || 'bg-gray-700'}`}
              style={{ height: `${height}%`, top: `${top}%` }}
              title={`${item.lithology} from ${item.top}m to ${item.base}m`}
            ></div>
          );
        })}
      </div>
      <div className="relative h-full w-1/2 pl-4 text-xs text-slate-300">
        {stripLogData.map((item, index) => {
          const top = ((item.top - topDepth) / totalDepth) * 100;
          return (
            <div key={index} className="absolute w-full" style={{ top: `${top}%` }}>
              <p className="font-semibold">{item.lithology}</p>
              <p className="text-slate-400">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StripLogViewer;