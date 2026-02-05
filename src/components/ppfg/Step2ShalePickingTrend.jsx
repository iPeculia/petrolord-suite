import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { calculateNCT } from '@/utils/nctCalculator';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ComposedChart } from 'recharts';
import { getProperlyInvertedDepthAxisConfig, getTooltipStyle } from '@/utils/chartConfigUtils';
import { Loader2, CheckCircle2, AlertTriangle, TrendingUp, Info, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useDebounce } from '@/hooks/useDebounce';

const Step2ShalePickingTrend = ({ data, onComplete }) => {
    const { toast } = useToast();
    const [vshaleCutoff, setVshaleCutoff] = useState(75);
    const debouncedVshaleCutoff = useDebounce(vshaleCutoff, 300);

    const [nctResult, setNctResult] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    
    const memoizedCalculation = useMemo(() => {
        if (data && data.depths && data.depths.length > 0) {
            setIsCalculating(true);
            try {
                const result = calculateNCT(data, debouncedVshaleCutoff);
                return result;
            } catch (e) {
                console.error("Step2: Calculation Error:", e);
                return { valid: false, message: "Calculation crashed", shalePointsCount: 0 };
            } finally {
                // This will be set to false once the result is processed in useEffect
            }
        }
        return null;
    }, [data, debouncedVshaleCutoff]);

    useEffect(() => {
        if(memoizedCalculation) {
            setNctResult(memoizedCalculation);
            setIsCalculating(false);
            setConfirmed(false); // Reset confirmation on new calculation
        }
    }, [memoizedCalculation]);

    const trendLineData = useMemo(() => {
        if (nctResult?.valid && nctResult.intercept > 0 && data?.depths) {
            const maxDepth = Math.max(...data.depths);
            const trend = [];
            for (let d = 0; d <= maxDepth; d += 200) {
                trend.push({
                    depth: d,
                    dtNct: nctResult.intercept * Math.exp(-nctResult.slope * d)
                });
            }
            return trend;
        }
        return [];
    }, [nctResult, data?.depths]);

    const handleConfirm = () => {
        if (!nctResult?.valid) return;
        
        // UI responds instantly
        setConfirmed(true);
        setIsConfirming(true); // Keep spinner on button for async action
        
        toast({
            title: "Trend Confirmed",
            description: "NCT parameters saved. You can now proceed.",
            className: "bg-emerald-900 border-emerald-800 text-emerald-100"
        });

        // Backend/State update happens asynchronously
        setTimeout(() => {
            if (onComplete) {
                onComplete({
                    nctParams: {
                        a: nctResult.intercept,
                        b: nctResult.slope,
                        r2: nctResult.rSquared,
                        valid: nctResult.valid
                    },
                    shalePointsCount: nctResult.shalePointsCount,
                    trendLine: trendLineData
                });
            }
            setIsConfirming(false); // Remove spinner from button
        }, 300); // Simulate short async save
    };

    const fmt = (val, fixed = 2) => val !== undefined && val !== null ? val.toFixed(fixed) : "--";
    const fmtExp = (val) => val !== undefined && val !== null ? val.toExponential(2) : "--";

    return (
        <div className="h-full flex gap-4 p-4">
            {/* LEFT PANEL: CONTROLS */}
            <div className="w-80 space-y-4 shrink-0 flex flex-col h-full overflow-y-auto pr-2">
                 
                 {/* 1. Cutoff Slider */}
                 <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-4">
                    <div className="flex justify-between items-center">
                        <Label className="text-slate-300 font-semibold">Vshale Cutoff</Label>
                        <span className="text-xs text-slate-500">GR API</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Slider 
                            value={[vshaleCutoff]} 
                            min={0} max={150} step={1} 
                            onValueChange={(v) => setVshaleCutoff(v[0])} 
                            className="flex-1" 
                        />
                        <div className="font-mono text-sm font-bold text-cyan-400 bg-slate-950 py-1 px-2 rounded border border-slate-800 min-w-[3rem] text-center">
                            {vshaleCutoff}
                        </div>
                    </div>
                 </div>

                 {/* 2. Parameters Box */}
                 <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 space-y-4 relative overflow-hidden flex-1">
                    <div className="flex items-center gap-2 mb-2 border-b border-slate-800 pb-2">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        <Label className="text-slate-300 text-xs uppercase font-bold tracking-wider">NCT Parameters</Label>
                    </div>
                    
                    {isCalculating ? (
                        <div className="flex flex-col items-center justify-center h-32 gap-3 text-slate-500">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            <span className="text-xs">Calculating...</span>
                        </div>
                    ) : nctResult ? (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-950 p-3 rounded border border-slate-800/50">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wide block mb-1">Intercept (a)</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="font-mono text-lg font-bold text-white">
                                            {fmt(nctResult.intercept, 1)}
                                        </span>
                                        <span className="text-[10px] text-slate-600">us/ft</span>
                                    </div>
                                </div>
                                <div className="bg-slate-950 p-3 rounded border border-slate-800/50">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wide block mb-1">Slope (b)</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="font-mono text-lg font-bold text-white">
                                            {fmtExp(nctResult.slope)}
                                        </span>
                                        <span className="text-[10px] text-slate-600">/ft</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center px-1 border-t border-slate-800/30 pt-2">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-500">R-Squared</span>
                                    <span className={`font-mono text-sm font-bold ${nctResult.rSquared > 0.5 ? 'text-emerald-400' : 'text-yellow-500'}`}>
                                        {fmt(nctResult.rSquared, 2)}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-slate-500">Shale Points</span>
                                    <span className="font-mono text-sm font-bold text-slate-300">
                                        {nctResult.shalePointsCount}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2 pt-2">
                                <div className="flex items-center gap-2 text-xs">
                                    {nctResult.shalePointsCount >= 10 
                                        ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 
                                        : <XCircle className="w-3.5 h-3.5 text-red-500" />
                                    }
                                    <span className="text-slate-400">
                                        {nctResult.shalePointsCount >= 10 ? "Sufficient shale points" : "Insufficient points"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    {nctResult.valid 
                                        ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 
                                        : <XCircle className="w-3.5 h-3.5 text-red-500" />
                                    }
                                    <span className={nctResult.valid ? "text-slate-400" : "text-red-400"}>
                                        {nctResult.message}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-slate-600 text-xs py-8">No data available</div>
                    )}
                 </div>
                 
                 <TooltipProvider>
                     <UITooltip>
                        <TooltipTrigger asChild>
                             <div className="pt-2">
                                 <Button 
                                    className={`w-full h-12 text-sm font-bold uppercase tracking-wide transition-all duration-200 
                                        ${confirmed 
                                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/20' 
                                            : nctResult?.valid 
                                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20' 
                                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                        } shadow-lg`}
                                    onClick={handleConfirm}
                                    disabled={isCalculating || isConfirming || !nctResult?.valid}
                                 >
                                    {isCalculating ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                                    ) : isConfirming ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                                    ) : confirmed ? (
                                        <><CheckCircle2 className="w-5 h-5 mr-2" /> Trend Confirmed</>
                                    ) : (
                                        "Confirm Trend"
                                    )}
                                 </Button>
                             </div>
                        </TooltipTrigger>
                        {!nctResult?.valid && (
                            <TooltipContent>
                                <p>Cannot confirm: {nctResult?.message || "Invalid parameters"}</p>
                            </TooltipContent>
                        )}
                     </UITooltip>
                 </TooltipProvider>
                 
                 {confirmed && (
                     <div className="text-center text-[10px] text-emerald-500 animate-in fade-in slide-in-from-top-1">
                         ✓ Parameters saved. You can proceed to the next step.
                     </div>
                 )}
            </div>

            {/* RIGHT PANEL: CHART */}
            <Card className="flex-1 bg-slate-950 border-slate-800 overflow-hidden relative shadow-inner">
                {!data || data.depths.length === 0 ? (
                     <div className="absolute inset-0 flex items-center justify-center text-slate-600 flex-col gap-2">
                         <AlertTriangle className="w-8 h-8 opacity-50" />
                         <span>No log data available</span>
                     </div>
                ) : (
                    <CardContent className="h-full p-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <defs>
                                    <linearGradient id="shaleGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                                        <stop offset="100%" stopColor="#059669" stopOpacity={0.4}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis 
                                    type="number" 
                                    dataKey="dt" 
                                    name="DT" 
                                    unit="us/ft" 
                                    domain={[40, 180]} 
                                    stroke="#64748b" 
                                    tick={{fontSize: 10, fill: '#64748b'}} 
                                    label={{ value: 'Sonic Transit Time (us/ft)', position: 'top', offset: 10, fill: '#94a3b8', fontSize: 11 }} 
                                    orientation="top" 
                                />
                                <YAxis 
                                    {...getProperlyInvertedDepthAxisConfig()}
                                    stroke="#64748b"
                                    tick={{fontSize: 10, fill: '#64748b'}}
                                />
                                <Tooltip 
                                    cursor={{strokeDasharray: '3 3', stroke: '#475569'}} 
                                    contentStyle={getTooltipStyle()} 
                                    formatter={(val, name) => [val.toFixed(1), name === 'dtNct' ? 'NCT' : name]}
                                    labelFormatter={(label) => `Depth: ${Math.round(label)} ft`}
                                />
                                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                                
                                <Scatter 
                                    name="Non-Shale Points" 
                                    data={data.depths.map((d, i) => ({ depth: d, dt: data.dt[i] })).filter((p, i) => i % 20 === 0 && p.dt > 40 && p.dt < 200)} 
                                    fill="#334155" 
                                    opacity={0.2} 
                                    shape="circle" 
                                    legendType="circle"
                                />
                                
                                {nctResult?.shalePoints && (
                                    <Scatter 
                                        name="Shale Points" 
                                        data={nctResult.shalePoints.filter((_, i) => i % 10 === 0)} 
                                        fill="url(#shaleGradient)" 
                                        shape="circle" 
                                        legendType="circle"
                                    />
                                )}
                                
                                <Line 
                                    name="NCT Trend" 
                                    data={trendLineData} 
                                    dataKey="dtNct" 
                                    stroke="#ef4444" 
                                    strokeWidth={3} 
                                    dot={false} 
                                    isAnimationActive={false}
                                    type="monotone"
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </CardContent>
                )}
            </Card>
        </div>
    );
};

export default Step2ShalePickingTrend;