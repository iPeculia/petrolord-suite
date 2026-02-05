import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const LogTrack = ({ name, min, max, data, color, unit }) => (
  <div className="min-w-[150px] h-full border-r border-slate-800 relative flex flex-col">
    <div className="h-8 border-b border-slate-800 px-2 flex flex-col justify-center bg-slate-900/50">
      <span className="text-[10px] font-bold text-slate-300 text-center">{name}</span>
      <div className="flex justify-between text-[9px] text-slate-500">
        <span>{min}</span>
        <span>{unit}</span>
        <span>{max}</span>
      </div>
    </div>
    <div className="flex-1 relative bg-slate-950/30">
      {/* Mock curve drawing using SVG */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <polyline
          points={data.map((val, idx) => `${((val - min) / (max - min)) * 100},${idx * 2}`).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
        />
      </svg>
      {/* Depth lines */}
      {Array.from({length: 10}).map((_, i) => (
        <div key={i} className="absolute w-full border-t border-slate-800/50" style={{ top: `${i * 10}%` }}></div>
      ))}
    </div>
  </div>
);

const PetrophysicalDepthProfile = () => {
  // Mock log data generator
  const generateLog = (count, base, varr) => Array.from({length: count}, () => base + (Math.random() - 0.5) * varr);
  const depthPoints = 200;
  
  return (
    <Card className="h-full bg-slate-900 border-slate-800 flex flex-col">
      <CardHeader className="py-3">
        <CardTitle className="text-white text-sm">Well Log Viewer: Well-A1</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="flex h-[600px] w-full">
            {/* Depth Track */}
            <div className="w-16 h-full border-r border-slate-800 bg-slate-900 flex flex-col">
              <div className="h-8 border-b border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">MD</div>
              <div className="flex-1 relative text-[10px] text-slate-500">
                {Array.from({length: 10}).map((_, i) => (
                  <div key={i} className="absolute w-full border-t border-slate-800 text-right pr-1" style={{ top: `${i * 10}%` }}>
                    {2000 + (i * 50)}
                  </div>
                ))}
              </div>
            </div>
            
            <LogTrack name="Gamma Ray" min={0} max={150} unit="gAPI" color="#22c55e" data={generateLog(depthPoints, 60, 40)} />
            <LogTrack name="Resistivity" min={0.2} max={2000} unit="ohm.m" color="#ef4444" data={generateLog(depthPoints, 10, 100)} />
            <LogTrack name="Neutron" min={0.45} max={-0.15} unit="v/v" color="#3b82f6" data={generateLog(depthPoints, 0.25, 0.15)} />
            <LogTrack name="Density" min={1.95} max={2.95} unit="g/cc" color="#eab308" data={generateLog(depthPoints, 2.4, 0.3)} />
            <LogTrack name="Effective Porosity" min={0} max={0.4} unit="v/v" color="#a855f7" data={generateLog(depthPoints, 0.18, 0.1)} />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PetrophysicalDepthProfile;