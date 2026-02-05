import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { calculateCentroidEffect } from '@/utils/centroidAdjustmentEngine';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getProperlyInvertedDepthAxisConfig, getPressureAxisConfig, getCommonChartProps, getGridConfig, getTooltipStyle } from '@/utils/chartConfigUtils';

const Step6CentroidAdjustment = ({ ppData, depths, onComplete }) => {
    const [params, setParams] = useState({
        centroidDepth: 12500,
        fluidGradient: 0.1 // Gas
    });
    const [results, setResults] = useState(null);

    useEffect(() => {
        if (ppData && depths) {
            const pp_adjusted = calculateCentroidEffect({
                depths,
                pp_psi: ppData.pp_psi,
                params
            });

            const pp_adj_ppg = pp_adjusted.map((p, i) => {
                const d = depths[i];
                return d > 0 ? p / (0.052 * d) : 0;
            });

            const chartData = depths.map((d, i) => ({
                depth: d,
                pp_base: ppData.pp_ppg[i],
                pp_adj: pp_adj_ppg[i]
            })).filter((_, i) => i % 50 === 0);

            setResults({ chartData });
            onComplete({ pp_adj_ppg });
        }
    }, [ppData, depths, params]);

    return (
        <div className="h-full flex gap-4 p-4">
            <Card className="w-80 bg-slate-900 border-slate-800 shrink-0">
                <CardContent className="p-4 space-y-6">
                    <h3 className="font-bold text-slate-200 mb-4">Centroid / Buoyancy</h3>
                    
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-400">Centroid Depth (ft)</Label>
                        <Slider 
                            value={[params.centroidDepth]} 
                            min={5000} max={15000} step={100}
                            onValueChange={(v) => setParams({ ...params, centroidDepth: v[0] })}
                        />
                        <div className="text-right font-mono text-emerald-400">{params.centroidDepth} ft</div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-slate-400">Fluid Gradient (psi/ft)</Label>
                        <Slider 
                            value={[params.fluidGradient]} 
                            min={0.05} max={0.5} step={0.01}
                            onValueChange={(v) => setParams({ ...params, fluidGradient: v[0] })}
                        />
                        <div className="text-right font-mono text-emerald-400">{params.fluidGradient} (Gas/Oil)</div>
                    </div>
                </CardContent>
            </Card>

            <Card className="flex-1 bg-slate-900 border-slate-800">
                <CardContent className="h-full p-4">
                    {results && (
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={results.chartData} {...getCommonChartProps()}>
                                <CartesianGrid {...getGridConfig()} />
                                <XAxis {...getPressureAxisConfig('PP (ppg)', [8, 18])} />
                                <YAxis {...getProperlyInvertedDepthAxisConfig()} />
                                <Tooltip contentStyle={getTooltipStyle()} />
                                <Legend />
                                <Line dataKey="pp_base" stroke="#64748b" name="Regional PP" dot={false} strokeDasharray="3 3" />
                                <Line dataKey="pp_adj" stroke="#ef4444" name="Reservoir PP (Centroid)" dot={false} strokeWidth={2} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Step6CentroidAdjustment;