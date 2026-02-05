import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Maximize2, Minus, MoreHorizontal } from 'lucide-react';

// A single log track component to visualize gamma ray, resistivity, etc.
const LogTrack = ({ well, height = 500 }) => {
    // Generate mock curve data if none exists (Audit Fix: handle missing data)
    const data = useMemo(() => {
        if (well.curves && well.curves.length > 0) return well.curves;
        
        // Mock generator for UI demonstration if real data isn't imported yet
        return Array.from({ length: 50 }, (_, i) => ({
            depth: i * 20,
            gr: 30 + Math.random() * 90 + (Math.sin(i/5) * 20),
            res: Math.max(0.1, 2 + Math.cos(i/3) * 10)
        }));
    }, [well]);

    return (
        <div className="w-[200px] flex-shrink-0 bg-slate-900/50 border-r border-slate-800 relative group">
            <div className="h-10 border-b border-slate-700 flex items-center justify-between px-2 bg-slate-800">
                <span className="text-xs font-bold text-slate-200 truncate max-w-[150px]" title={well.well_name}>{well.well_name}</span>
                <MoreHorizontal className="w-4 h-4 text-slate-500 cursor-pointer hover:text-white" />
            </div>
            
            <div style={{ height: height - 40 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={false} />
                        <XAxis type="number" domain={[0, 150]} hide />
                        <YAxis type="number" dataKey="depth" reversed domain={['dataMin', 'dataMax']} stroke="#64748b" tick={{fontSize: 10}} width={40} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', fontSize: '12px' }}
                            itemStyle={{ color: '#cbd5e1' }}
                            labelFormatter={(v) => `${v} m`}
                        />
                        {/* Gamma Ray (Green) */}
                        <Line type="monotone" dataKey="gr" stroke="#10b981" strokeWidth={1.5} dot={false} />
                        {/* Resistivity (Red - Log Scale simulated via value mapping usually, kept linear for simplicity here) */}
                        <Line type="monotone" dataKey="res" stroke="#ef4444" strokeWidth={1.5} dot={false} strokeDasharray="2 2" />

                        {/* Tops Markers */}
                        {well.tops?.map((top, idx) => (
                             <ReferenceLine key={idx} y={top.depth} stroke="#facc15" strokeWidth={2} label={{ value: top.name, position: 'insideTopRight', fill: '#facc15', fontSize: 10 }} />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            {/* Hover Controls */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button className="p-2 bg-slate-800 rounded-full shadow-lg hover:bg-slate-700"><Maximize2 className="w-4 h-4 text-white" /></button>
            </div>
        </div>
    );
};

const SectionPanel = ({ wells, project }) => {
  return (
    <div className="w-full h-full flex flex-col">
        <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center px-4 text-xs text-slate-400 justify-between">
            <span>Datum: {project.datum_type} @ {project.datum_depth}m</span>
            <span>Scale: 1:200</span>
        </div>
        <ScrollArea className="flex-1 w-full whitespace-nowrap">
            <div className="flex h-full min-w-max p-4 gap-1">
                {wells.map((well) => (
                    <LogTrack key={well.id} well={well} height={600} />
                ))}
                
                {/* Ghost Track for Drop Target */}
                <div className="w-[100px] h-[600px] border-2 border-dashed border-slate-800 rounded-lg flex items-center justify-center opacity-50 hover:opacity-100 hover:border-rose-500 transition-all cursor-pointer">
                    <span className="text-slate-600 text-sm">+ Add Track</span>
                </div>
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    </div>
  );
};

export default SectionPanel;