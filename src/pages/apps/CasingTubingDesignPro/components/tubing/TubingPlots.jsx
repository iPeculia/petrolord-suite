import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const SafetyFactorPlot = ({ data, showCasing = false }) => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="py-2 px-4 border-b border-slate-800">
                <CardTitle className="text-xs font-bold text-slate-300 uppercase">Safety Factors vs Depth</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-2 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                        <XAxis type="number" domain={[0, 4]} stroke="#94a3b8" fontSize={10} label={{ value: 'SF', position: 'bottom', fill: '#94a3b8', fontSize: 10 }} />
                        <YAxis dataKey="depth" type="number" reversed stroke="#94a3b8" fontSize={10} label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                        <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                        
                        <ReferenceLine x={1.0} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'FAIL', fill: '#ef4444', fontSize: 8, position: 'insideTopRight' }} />
                        <ReferenceLine x={1.25} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'WARN', fill: '#f59e0b', fontSize: 8, position: 'insideTopRight' }} />
                        
                        <Line type="monotone" dataKey="burstSF" name="Burst" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="collapseSF" name="Collapse" stroke="#10b981" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="tensionSF" name="Tension" stroke="#f97316" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="compressionSF" name="Compression" stroke="#ef4444" strokeWidth={2} dot={false} />
                        
                        {showCasing && (
                            <Line type="monotone" dataKey="casingBurstSF" name="Casing Burst" stroke="#64748b" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export const PressurePlot = ({ data }) => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="py-2 px-4 border-b border-slate-800">
                <CardTitle className="text-xs font-bold text-slate-300 uppercase">Pressure vs Depth</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-2 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                        <XAxis type="number" stroke="#94a3b8" fontSize={10} label={{ value: 'Pressure (bar)', position: 'bottom', fill: '#94a3b8', fontSize: 10 }} />
                        <YAxis dataKey="depth" type="number" reversed stroke="#94a3b8" fontSize={10} label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                        <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                        
                        <Line type="monotone" dataKey="pressureInt" name="Internal" stroke="#ef4444" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="pressureExt" name="External" stroke="#3b82f6" strokeWidth={2} dot={false} />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export const AxialLoadPlot = ({ data }) => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="py-2 px-4 border-b border-slate-800">
                <CardTitle className="text-xs font-bold text-slate-300 uppercase">Axial Load vs Depth</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-2 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                        <XAxis type="number" stroke="#94a3b8" fontSize={10} label={{ value: 'Load (kN)', position: 'bottom', fill: '#94a3b8', fontSize: 10 }} />
                        <YAxis dataKey="depth" type="number" reversed stroke="#94a3b8" fontSize={10} label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                        <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                        <ReferenceLine x={0} stroke="#64748b" strokeWidth={1} />
                        
                        <Line type="monotone" dataKey="axialLoad" name="Total Axial" stroke="#10b981" strokeWidth={2} dot={false} />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};