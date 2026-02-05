import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Maximize2, ZoomIn, ZoomOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data generator for vertical log look
const generateLogData = (startDepth, endDepth, step) => {
    const points = Math.floor((endDepth - startDepth) / step);
    return Array.from({length: points}, (_, i) => {
        const depth = startDepth + i * step;
        return {
            depth: depth,
            gr: 20 + Math.random() * 80 + Math.sin(depth/10) * 30,
            res: Math.exp(Math.random() * 2 + 1),
            nphi: 0.45 - Math.random() * 0.3,
            rhob: 2.0 + Math.random() * 0.7,
            facies: Math.floor(Math.random() * 5)
        };
    });
};

const data = generateLogData(1000, 1100, 0.5);

const TrackHeader = ({ title, unit, min, max, color }) => (
    <div className="h-8 border-b border-slate-700 bg-slate-900 flex flex-col justify-center px-1 relative overflow-hidden">
        <div className="flex justify-between text-[10px] font-bold" style={{color}}>
            <span>{min}</span>
            <span className="text-center flex-1 truncate px-1">{title} ({unit})</span>
            <span>{max}</span>
        </div>
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-50" style={{color}} />
    </div>
);

const EnhancedWellLogViewer = () => {
    return (
        <Card className="h-full bg-slate-950 border-slate-800 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-2 bg-slate-900 border-b border-slate-800">
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6"><ZoomIn className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6"><ZoomOut className="w-4 h-4" /></Button>
                </div>
                <span className="text-xs text-slate-500 font-mono">Display: MD 1:200</span>
                <Button variant="ghost" size="icon" className="h-6 w-6"><Settings className="w-4 h-4" /></Button>
            </div>
            
            <CardContent className="p-0 flex-1 relative grid grid-cols-12 gap-0 divide-x divide-slate-800">
                {/* Depth Track */}
                <div className="col-span-1 bg-slate-900 flex flex-col">
                    <div className="h-8 border-b border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-bold">DEPTH</div>
                    <div className="flex-1 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart layout="vertical" data={data} margin={{top: 0, bottom: 0, left: 0, right: 0}}>
                                <YAxis dataKey="depth" type="number" domain={['dataMin', 'dataMax']} reversed tick={{fontSize: 10, fill: '#64748b'}} width={40} interval={0} tickCount={10} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Track 1: Gamma Ray */}
                <div className="col-span-3 flex flex-col relative">
                    <TrackHeader title="GR" unit="API" min={0} max={150} color="#22c55e" />
                    <div className="flex-1 bg-slate-950/50">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart layout="vertical" data={data} margin={{top: 0, bottom: 0, left: 0, right: 0}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={true} />
                                <XAxis type="number" domain={[0, 150]} hide />
                                <YAxis dataKey="depth" type="number" domain={['dataMin', 'dataMax']} reversed hide />
                                <Line type="monotone" dataKey="gr" stroke="#22c55e" dot={false} strokeWidth={1.5} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Track 2: Resistivity (Log) */}
                <div className="col-span-3 flex flex-col relative">
                    <TrackHeader title="RES" unit="ohm.m" min={0.2} max={2000} color="#ef4444" />
                    <div className="flex-1 bg-slate-950/50">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart layout="vertical" data={data} margin={{top: 0, bottom: 0, left: 0, right: 0}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={true} />
                                <XAxis type="number" domain={[0, 10]} hide /> {/* Mock log scale via data transform usually */}
                                <YAxis dataKey="depth" type="number" domain={['dataMin', 'dataMax']} reversed hide />
                                <Line type="monotone" dataKey="res" stroke="#ef4444" dot={false} strokeWidth={1.5} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Track 3: NPHI/RHOB */}
                <div className="col-span-3 flex flex-col relative">
                    <TrackHeader title="NPHI/RHOB" unit="v/v | g/cc" min="-0.15 | 1.95" max="0.45 | 2.95" color="#3b82f6" />
                    <div className="flex-1 bg-slate-950/50">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart layout="vertical" data={data} margin={{top: 0, bottom: 0, left: 0, right: 0}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={true} />
                                <XAxis type="number" domain={[-0.15, 0.45]} hide />
                                <YAxis dataKey="depth" type="number" domain={['dataMin', 'dataMax']} reversed hide />
                                {/* Neutron (Blue Dashed) */}
                                <Line type="monotone" dataKey="nphi" stroke="#3b82f6" dot={false} strokeWidth={1.5} strokeDasharray="4 2" isAnimationActive={false} />
                                {/* Density (Red/Orange Solid) - mapped to neutron scale visually inverse */}
                                <Line type="monotone" dataKey="rhob" stroke="#f97316" dot={false} strokeWidth={1.5} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Track 4: Facies Flag */}
                <div className="col-span-2 flex flex-col relative bg-slate-900">
                    <div className="h-8 border-b border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-bold">FACIES</div>
                    <div className="flex-1 relative w-full">
                        {/* Simplified Facies Blocks visualization using absolute positioning for demo */}
                        {data.map((d, i) => (
                            <div 
                                key={i} 
                                style={{
                                    position: 'absolute',
                                    top: `${(i / data.length) * 100}%`,
                                    height: `${100/data.length}%`,
                                    width: '100%',
                                    backgroundColor: ['#fbbf24', '#9ca3af', '#3b82f6', '#a855f7', '#1f2937'][d.facies]
                                }}
                            />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default EnhancedWellLogViewer;