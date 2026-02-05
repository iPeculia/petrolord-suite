import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { calculateEffectiveStress } from '@/utils/effectiveStressCalculator';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getProperlyInvertedDepthAxisConfig, getPressureAxisConfig, getCommonChartProps, getGridConfig, getTooltipStyle } from '@/utils/chartConfigUtils';

const Step3EffectiveStress = ({ obgData, dtData, nctParams, onComplete }) => {
    const [params, setParams] = useState({ eatonExponent: 3.0 });
    const [results, setResults] = useState(null);

    useEffect(() => {
        if (obgData && dtData && nctParams) {
            const depths = obgData.depths;
            const dt_nct = depths.map(z => nctParams.a * Math.exp(-nctParams.b * z));
            
            const sigma_e = calculateEffectiveStress({
                depths,
                obg_psi: obgData.obg_psi,
                dt: dtData.dt,
                dt_nct,
                method: 'eaton_sonic',
                params
            });
            
            const chartData = depths.map((d, i) => ({
                depth: d,
                sigma_v: obgData.obg_psi[i],
                sigma_e: sigma_e[i]
            })).filter((_, i) => i % 50 === 0);

            setResults({ sigma_e, chartData });
            onComplete({ sigma_e });
        }
    }, [obgData, dtData, nctParams, params]);

    return (
        <div className="h-full flex gap-4 p-4">
            <Card className="w-80 bg-slate-900 border-slate-800 shrink-0">
                <CardContent className="p-4 space-y-6">
                    <h3 className="font-bold text-slate-200 mb-4">Effective Stress Parameters</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-slate-400">
                            <Label>Eaton Exponent</Label>
                            <span>{params.eatonExponent}</span>
                        </div>
                        <Slider 
                            value={[params.eatonExponent]} 
                            min={0.5} max={5.0} step={0.1}
                            onValueChange={(v) => setParams({ ...params, eatonExponent: v[0] })}
                        />
                    </div>
                    <div className="text-xs text-slate-500 mt-4">
                        Higher exponent reduces effective stress for the same velocity anomaly (increasing Pore Pressure).
                    </div>
                </CardContent>
            </Card>
            
            <Card className="flex-1 bg-slate-900 border-slate-800">
                <CardContent className="h-full p-4">
                    {results && (
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={results.chartData} {...getCommonChartProps()}>
                                <CartesianGrid {...getGridConfig()} />
                                <XAxis {...getPressureAxisConfig('Stress (psi)')} />
                                <YAxis {...getProperlyInvertedDepthAxisConfig()} />
                                <Tooltip contentStyle={getTooltipStyle()} />
                                <Legend />
                                <Line dataKey="sigma_v" stroke="#f59e0b" name="Vertical Stress (Sv)" dot={false} strokeWidth={2} />
                                <Line dataKey="sigma_e" stroke="#10b981" name="Effective Stress (Se)" dot={false} strokeWidth={2} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Step3EffectiveStress;