import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ScatterChart, Scatter, ZAxis, ErrorBar } from 'recharts';
import { ArrowDown, ArrowUp, Minus, TrendingUp, Activity, List } from 'lucide-react';

const StatCard = ({ label, value, subtext, color }) => (
    <div className={`p-4 rounded-lg border ${color} bg-slate-900/50`}>
        <p className="text-xs text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
        {subtext && <p className="text-[10px] text-slate-500 mt-1">{subtext}</p>}
    </div>
);

const ProbabilisticResults = ({ results, unit }) => {
    // Process Histogram Data
    const histData = useMemo(() => {
        if (!results || !results.histogram) return [];
        
        const { histogram } = results;
        const min = Math.min(...histogram);
        const max = Math.max(...histogram);
        const bins = 20;
        const step = (max - min) / bins;
        const data = Array(bins).fill(0).map((_, i) => ({
            bin: (min + i * step).toFixed(0),
            count: 0,
            cumulative: 0
        }));
        
        histogram.forEach(val => {
            const idx = Math.min(bins - 1, Math.floor((val - min) / step));
            data[idx].count++;
        });
        
        let cum = 0;
        const total = histogram.length;
        data.forEach(d => {
            cum += d.count;
            d.cumulative = (cum / total) * 100;
        });

        return data;
    }, [results]);

    // Process Tornado Data
    const tornadoData = useMemo(() => {
        if (!results || !results.sensitivity) return [];

        const { sensitivity } = results;
        return sensitivity.map(s => ({
            name: s.variable.toUpperCase(),
            low: s.low,
            high: s.high,
            base: s.base,
            swing: s.swing
        })).sort((a,b) => b.swing - a.swing); // Ensure sorted by impact
    }, [results]);

    if (!results) return null;

    const { stats } = results;

    // Formatter
    const fmt = (v) => v >= 1e6 ? `${(v/1e6).toFixed(1)} M` : (v >= 1000 ? `${(v/1000).toFixed(1)} k` : v.toFixed(0));
    const unitLabel = unit === 'oil' ? 'MMstb' : 'Bscf';
    const divFactor = unit === 'oil' ? 1e6 : 1e9;
    const valFmt = (v) => (v / divFactor).toFixed(2);

    return (
        <div className="h-full flex flex-col gap-4 p-4 overflow-y-auto">
            <div className="grid grid-cols-3 gap-4">
                <StatCard label="P90 (Low)" value={valFmt(stats.p90)} subtext={unitLabel} color="border-yellow-500/30" />
                <StatCard label="P50 (Best)" value={valFmt(stats.p50)} subtext={unitLabel} color="border-blue-500/30" />
                <StatCard label="P10 (High)" value={valFmt(stats.p10)} subtext={unitLabel} color="border-green-500/30" />
            </div>

            <Tabs defaultValue="charts" className="flex-1">
                <TabsList className="bg-slate-900 border border-slate-800">
                    <TabsTrigger value="charts"><TrendingUp className="w-4 h-4 mr-2" /> Distributions</TabsTrigger>
                    <TabsTrigger value="sensitivity"><Activity className="w-4 h-4 mr-2" /> Sensitivity</TabsTrigger>
                </TabsList>

                <TabsContent value="charts" className="h-[400px] bg-slate-950 border border-slate-800 rounded-lg p-4 mt-2">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={histData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="bin" stroke="#94a3b8" tick={{fontSize: 10}} tickFormatter={(v) => valFmt(parseFloat(v))} />
                            <YAxis yAxisId="left" stroke="#94a3b8" tick={{fontSize: 10}} />
                            <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" tick={{fontSize: 10}} unit="%" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                formatter={(val, name) => [name === 'Frequency' ? val : val.toFixed(1)+'%', name]}
                            />
                            <Bar yAxisId="left" dataKey="count" name="Frequency" fill="#8b5cf6" opacity={0.6} />
                            <ReferenceLine x={histData.find(d => parseFloat(d.bin) >= stats.p50)?.bin} stroke="white" strokeDasharray="3 3" label={{ value: 'P50', fill: 'white', fontSize: 10 }} />
                        </BarChart>
                    </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="sensitivity" className="h-[400px] bg-slate-950 border border-slate-800 rounded-lg p-4 mt-2">
                    <div className="h-full w-full flex flex-col">
                        <h4 className="text-sm text-slate-400 mb-4 text-center">Tornado Chart: Impact on Reserves ({unitLabel})</h4>
                        <div className="flex-1 relative">
                            {/* Custom HTML/CSS Tornado for better control than Recharts default */}
                            <div className="space-y-3 absolute inset-0 overflow-y-auto">
                                {tornadoData.map((item, idx) => {
                                    // Normalize bars relative to max swing
                                    const maxSwing = tornadoData[0].swing; 
                                    const leftWidth = Math.abs(item.base - item.low);
                                    const rightWidth = Math.abs(item.high - item.base);
                                    const totalWidth = leftWidth + rightWidth;
                                    
                                    const widthPct = (totalWidth / maxSwing) * 80; // Max 80% width
                                    const leftPct = (leftWidth / totalWidth) * 100;
                                    const rightPct = (rightWidth / totalWidth) * 100;

                                    return (
                                        <div key={idx} className="flex items-center text-xs">
                                            <div className="w-24 text-slate-400 text-right pr-3 truncate" title={item.name}>{item.name}</div>
                                            <div className="flex-1 h-6 flex items-center">
                                                {/* Center Line */}
                                                <div className="w-px h-full bg-slate-600 mx-auto relative">
                                                    {/* Bars */}
                                                    <div className="absolute top-1/2 -translate-y-1/2 right-0 h-4 bg-red-500/60 rounded-l-sm flex items-center justify-end pr-1" style={{ width: `${(leftWidth / (maxSwing/2)) * 50}%` }}>
                                                        <span className="text-[9px] text-white/80 hidden group-hover:block">{valFmt(item.low)}</span>
                                                    </div>
                                                    <div className="absolute top-1/2 -translate-y-1/2 left-0 h-4 bg-green-500/60 rounded-r-sm flex items-center pl-1" style={{ width: `${(rightWidth / (maxSwing/2)) * 50}%` }}>
                                                        <span className="text-[9px] text-white/80 hidden group-hover:block">{valFmt(item.high)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-12 text-slate-500 pl-2">{valFmt(item.swing)}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ProbabilisticResults;