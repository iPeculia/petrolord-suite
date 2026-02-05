import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';

// Using Recharts for Phase 2 as it's robust enough for "Basic" viewer and handles scaling/tooltips well.
// Custom SVG implementation (like LogCurve.jsx) is better for advanced filling/shading in Phase 3.

const LogTrack = ({ 
  wellName, 
  curves = [], 
  depth, 
  height = 600, 
  minDepth, 
  maxDepth,
  showGrid = true 
}) => {
  
  // Prepare data for Recharts
  // Sampling: pick every Nth point to keep performance high
  const sampleRate = Math.max(1, Math.floor(depth.length / 1000));
  
  const data = [];
  for (let i = 0; i < depth.length; i += sampleRate) {
    if (depth[i] >= minDepth && depth[i] <= maxDepth) {
      const point = { depth: depth[i] };
      curves.forEach(c => {
        point[c.mnemonic] = c.data[i];
      });
      data.push(point);
    }
  }

  return (
    <div className="flex flex-col h-full border-r border-slate-800 bg-slate-950 min-w-[200px]">
      <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center px-2 justify-between">
        <span className="text-xs font-bold text-slate-300 truncate">{wellName}</span>
        <div className="flex gap-1">
          {curves.map(c => (
            <span key={c.mnemonic} className="text-[9px] px-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
              {c.mnemonic}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            layout="vertical" 
            data={data} 
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />}
            
            <XAxis type="number" domain={['auto', 'auto']} hide />
            <YAxis 
              dataKey="depth" 
              type="number" 
              domain={[minDepth, maxDepth]} 
              reversed={true} 
              hide 
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9', fontSize: '11px' }}
              labelFormatter={(val) => `Depth: ${val.toFixed(1)}`}
            />

            {curves.map((curve, idx) => (
              <Line 
                key={curve.mnemonic} 
                type="monotone" 
                dataKey={curve.mnemonic} 
                stroke={['#10b981', '#ef4444', '#3b82f6', '#eab308'][idx % 4]} 
                strokeWidth={1} 
                dot={false} 
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LogTrack;