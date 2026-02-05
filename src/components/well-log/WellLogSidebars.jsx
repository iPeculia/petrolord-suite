import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Trash2, Play, Settings2, Activity, BarChart2, Share2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ScatterChart, Scatter, CartesianGrid } from 'recharts';

// 1. CURVE DISPLAY
export const CurveDisplayPanel = ({ tracks, onToggleTrack, onUpdateCurve }) => (
    <div className="space-y-4 p-4">
        <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tracks & Curves</h3>
            <Button size="icon" variant="ghost" className="h-6 w-6"><Settings2 className="w-3 h-3" /></Button>
        </div>
        <ScrollArea className="h-[400px] pr-3">
            <div className="space-y-3">
                {tracks.map((track, tIdx) => (
                    <Card key={track.id} className="bg-slate-900 border-slate-800">
                        <CardContent className="p-3 space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-semibold text-slate-200">{track.title}</Label>
                                <Switch checked={track.visible} onCheckedChange={() => onToggleTrack(track.id)} />
                            </div>
                            {track.visible && track.curves.map((curve, cIdx) => (
                                <div key={curve.name} className="pl-2 border-l-2 border-slate-700 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono" style={{color: curve.color}}>{curve.name}</span>
                                        <Input 
                                            type="color" 
                                            className="h-5 w-5 p-0 bg-transparent border-none" 
                                            value={curve.color}
                                            onChange={(e) => onUpdateCurve(track.id, cIdx, 'color', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-2 items-center">
                                         <Label className="text-[9px] text-slate-500 w-6">Scale</Label>
                                         <Input 
                                            className="h-6 flex-1 text-[10px] bg-slate-950 border-slate-700 px-1" 
                                            value={curve.min} 
                                            type="number"
                                            onChange={(e) => onUpdateCurve(track.id, cIdx, 'min', Number(e.target.value))}
                                         />
                                         <span className="text-slate-600 text-[10px]">-</span>
                                         <Input 
                                            className="h-6 flex-1 text-[10px] bg-slate-950 border-slate-700 px-1" 
                                            value={curve.max} 
                                            type="number"
                                            onChange={(e) => onUpdateCurve(track.id, cIdx, 'max', Number(e.target.value))}
                                         />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    </div>
);

// 2. PETROPHYSICS
export const PetrophysicsPanel = ({ params, setParams, onCalculate }) => (
    <div className="space-y-4 p-4">
        <div className="bg-indigo-900/20 p-3 rounded border border-indigo-500/30">
             <h4 className="text-xs font-bold text-indigo-400 mb-2">Archie Parameters</h4>
             <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                     <Label className="text-[10px] text-slate-400">a (Tortuosity)</Label>
                     <Input className="h-7 bg-slate-950 border-slate-700" type="number" value={params.a} onChange={e => setParams({...params, a: Number(e.target.value)})} />
                 </div>
                 <div className="space-y-1">
                     <Label className="text-[10px] text-slate-400">m (Cementation)</Label>
                     <Input className="h-7 bg-slate-950 border-slate-700" type="number" value={params.m} onChange={e => setParams({...params, m: Number(e.target.value)})} />
                 </div>
                 <div className="space-y-1">
                     <Label className="text-[10px] text-slate-400">n (Saturation)</Label>
                     <Input className="h-7 bg-slate-950 border-slate-700" type="number" value={params.n} onChange={e => setParams({...params, n: Number(e.target.value)})} />
                 </div>
                 <div className="space-y-1">
                     <Label className="text-[10px] text-slate-400">Rw (Res. Water)</Label>
                     <Input className="h-7 bg-slate-950 border-slate-700" type="number" value={params.Rw} onChange={e => setParams({...params, Rw: Number(e.target.value)})} />
                 </div>
             </div>
        </div>
        <div className="bg-slate-900 p-3 rounded border border-slate-800">
             <h4 className="text-xs font-bold text-slate-400 mb-2">Matrix Properties</h4>
             <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                     <Label className="text-[10px] text-slate-400">Matrix Density</Label>
                     <Input className="h-7 bg-slate-950 border-slate-700" type="number" value={params.matrixRho} onChange={e => setParams({...params, matrixRho: Number(e.target.value)})} />
                 </div>
                 <div className="space-y-1">
                     <Label className="text-[10px] text-slate-400">Fluid Density</Label>
                     <Input className="h-7 bg-slate-950 border-slate-700" type="number" value={params.fluidRho} onChange={e => setParams({...params, fluidRho: Number(e.target.value)})} />
                 </div>
             </div>
        </div>
        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs" onClick={onCalculate}>
            <Play className="w-3 h-3 mr-2" /> Run Analysis
        </Button>
    </div>
);

// 3. QUALITY
export const LogQualityPanel = ({ qualityReport }) => {
    if (!qualityReport) return <div className="p-4 text-xs text-slate-500">Run analysis to see quality report.</div>;
    
    const { score, anomalies, gapCount, spikeCount } = qualityReport;
    
    return (
        <div className="space-y-4 p-4">
            <div className="text-center p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="text-[10px] uppercase text-slate-500 mb-1">Quality Score</div>
                <div className={`text-3xl font-bold ${score > 80 ? 'text-green-400' : score > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {score.toFixed(0)}
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
                <Card className="bg-slate-900 border-slate-800 p-2">
                    <div className="text-[10px] text-slate-500">Data Gaps</div>
                    <div className="text-xl font-mono text-slate-200">{gapCount}</div>
                </Card>
                <Card className="bg-slate-900 border-slate-800 p-2">
                    <div className="text-[10px] text-slate-500">Spikes</div>
                    <div className="text-xl font-mono text-slate-200">{spikeCount}</div>
                </Card>
            </div>

            <ScrollArea className="h-[200px] rounded border border-slate-800 bg-slate-900/50">
                <div className="p-2 space-y-1">
                    {anomalies.slice(0, 20).map((a, i) => (
                        <div key={i} className="text-[10px] flex justify-between text-slate-400 hover:bg-slate-800 p-1 rounded">
                            <span>{a.type === 'gap' ? 'Gap' : 'Spike'} @ {a.depth.toFixed(1)}m</span>
                            {a.zScore && <span className="text-red-400">Z: {a.zScore.toFixed(1)}</span>}
                        </div>
                    ))}
                    {anomalies.length > 20 && <div className="text-[10px] text-center text-slate-600 pt-2">...and {anomalies.length - 20} more</div>}
                </div>
            </ScrollArea>
        </div>
    );
};

// 4. STATISTICS (Histogram)
export const StatisticsPanel = ({ logData, curves }) => {
    const [selectedCurve, setSelectedCurve] = React.useState(curves[0] || 'GR');
    
    const statsData = React.useMemo(() => {
        if (!logData.length) return [];
        const values = logData.map(d => d[selectedCurve]).filter(v => v!=null && !isNaN(v) && v!==-999.25);
        if (!values.length) return [];
        
        const min = Math.min(...values);
        const max = Math.max(...values);
        const bins = 20;
        const step = (max - min) / bins;
        
        const hist = Array(bins).fill(0).map((_, i) => ({
            bin: (min + i * step).toFixed(1),
            count: 0
        }));
        
        values.forEach(v => {
            const idx = Math.min(bins - 1, Math.floor((v - min) / step));
            if(hist[idx]) hist[idx].count++;
        });
        return hist;
    }, [logData, selectedCurve]);

    return (
        <div className="space-y-4 p-4">
             <div className="space-y-2">
                 <Label className="text-xs text-slate-400">Select Curve</Label>
                 <Select value={selectedCurve} onValueChange={setSelectedCurve}>
                     <SelectTrigger className="h-8 text-xs bg-slate-900 border-slate-700">
                         <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                         {curves.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                     </SelectContent>
                 </Select>
             </div>

             <div className="h-[200px] w-full bg-slate-900 border border-slate-800 rounded p-2">
                 <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={statsData}>
                         <XAxis dataKey="bin" hide />
                         <YAxis hide />
                         <Tooltip 
                            contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', fontSize: '10px', color: '#f8fafc'}}
                            cursor={{fill: 'rgba(255,255,255,0.1)'}}
                         />
                         <Bar dataKey="count" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                     </BarChart>
                 </ResponsiveContainer>
             </div>
        </div>
    );
};

// 5. CORRELATION (Heatmap)
export const CorrelationPanel = ({ correlationMatrix }) => {
    if (!correlationMatrix || correlationMatrix.length === 0) return <div className="p-4 text-xs text-slate-500">No correlation data.</div>;

    return (
        <div className="p-4">
            <h4 className="text-xs font-bold text-slate-400 mb-3">Correlation Matrix</h4>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[10px]">
                    <thead>
                        <tr>
                            <th className="p-1"></th>
                            {correlationMatrix.map(r => <th key={r.name} className="p-1 text-slate-500">{r.name}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {correlationMatrix.map(row => (
                            <tr key={row.name}>
                                <td className="p-1 font-bold text-slate-500">{row.name}</td>
                                {correlationMatrix.map(col => {
                                    const val = row.values[col.name];
                                    const color = val > 0 ? `rgba(34, 197, 94, ${val})` : `rgba(239, 68, 68, ${Math.abs(val)})`;
                                    return (
                                        <td key={col.name} className="p-1 text-center border border-slate-800" style={{backgroundColor: color, color: Math.abs(val) > 0.5 ? 'white' : '#94a3b8'}}>
                                            {val.toFixed(2)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// 6. INTERPRETATION
export const InterpretationPanel = ({ picks, onRemovePick, activeTool, setActiveTool }) => (
    <div className="p-4 space-y-4">
        <div className="flex gap-2">
             <Button 
                variant={activeTool === 'picker' ? 'default' : 'outline'} 
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={() => setActiveTool(activeTool === 'picker' ? null : 'picker')}
             >
                <Activity className="w-3 h-3 mr-2" /> Pick Horizon
             </Button>
        </div>
        <ScrollArea className="h-[300px]">
            {picks.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500 italic">No picks yet.</div>
            ) : (
                <div className="space-y-1">
                    {picks.map((pick, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-slate-900/50 rounded border border-slate-800">
                            <div>
                                <div className="text-xs font-bold text-white">{pick.name}</div>
                                <div className="text-[10px] text-slate-500">{pick.depth.toFixed(2)}m</div>
                            </div>
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-500 hover:text-red-400" onClick={() => onRemovePick(i)}>
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </ScrollArea>
    </div>
);

// 7. EXPORT
export const ExportPanel = ({ onExport }) => (
    <div className="p-4 space-y-3">
        <Button variant="outline" className="w-full justify-start border-slate-700 text-xs h-9" onClick={() => onExport('csv')}>
            <Share2 className="w-3.5 h-3.5 mr-2 text-emerald-400" /> Export Data (CSV)
        </Button>
        <Button variant="outline" className="w-full justify-start border-slate-700 text-xs h-9" onClick={() => onExport('las')}>
            <Download className="w-3.5 h-3.5 mr-2 text-blue-400" /> Export LAS
        </Button>
        <Button variant="outline" className="w-full justify-start border-slate-700 text-xs h-9" onClick={() => onExport('json')}>
            <Activity className="w-3.5 h-3.5 mr-2 text-amber-400" /> Export Project (JSON)
        </Button>
    </div>
);