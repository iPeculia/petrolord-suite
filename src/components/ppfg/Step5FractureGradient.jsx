import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { calculateFractureGradient } from '@/utils/fractureGradientCalculator';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getProperlyInvertedDepthAxisConfig, getPressureAxisConfig, getCommonChartProps, getGridConfig, getTooltipStyle } from '@/utils/chartConfigUtils';

const Step5FractureGradient = ({ ppData, obgData, onComplete }) => {
    const [poisson, setPoisson] = useState(0.4);
    const [results, setResults] = useState(null);

    useEffect(() => {
        if (ppData && obgData) {
            const depths = obgData.depths;
            const { fg_ppg } = calculateFractureGradient({
                depths,
                obg_psi: obgData.obg_psi,
                pp_psi: ppData.pp_psi,
                params: { poisson }
            });
            
            const chartData = depths.map((d, i) => ({
                depth: d,
                pp: ppData.pp_ppg[i],
                obg: obgData.obg_ppg[i],
                fg: fg_ppg[i]
            })).filter((_, i) => i % 50 === 0);

            setResults({ fg_ppg, chartData });
            onComplete({ fg_ppg });
        }
    }, [ppData, obgData, poisson]);

    return (
        <div className="h-full flex gap-4 p-4">
            <Card className="w-80 bg-slate-900 border-slate-800 shrink-0">
                <CardContent className="p-4 space-y-6">
                    <h3 className="font-bold text-slate-200 mb-4">Fracture Gradient Settings</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-slate-400">
                            <Label>Poisson's Ratio</Label>
                            <span>{poisson}</span>
                        </div>
                        <Slider 
                            value={[poisson]} 
                            min={0.2} max={0.5} step={0.01}
                            onValueChange={(v) => setPoisson(v[0])}
                        />
                    </div>
                </CardContent>
            </Card>
            
            <Card className="flex-1 bg-slate-900 border-slate-800">
                <CardContent className="h-full p-4">
                    {results && (
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={results.chartData} {...getCommonChartProps()}>
                                <CartesianGrid {...getGridConfig()} />
                                <XAxis {...getPressureAxisConfig('Gradient (ppg)', [8, 20])} />
                                <YAxis {...getProperlyInvertedDepthAxisConfig()} />
                                <Tooltip contentStyle={getTooltipStyle()} />
                                <Legend />
                                <Area dataKey="pp" stroke="none" fill="#ef4444" fillOpacity={0.2} name="Pore Pressure" />
                                <Line dataKey="pp" stroke="#ef4444" dot={false} strokeWidth={2} />
                                <Line dataKey="fg" stroke="#3b82f6" name="Fracture Gradient" dot={false} strokeWidth={3} />
                                <Line dataKey="obg" stroke="#f59e0b" name="Overburden" dot={false} strokeWidth={2} strokeDasharray="5 5" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Step5FractureGradient;