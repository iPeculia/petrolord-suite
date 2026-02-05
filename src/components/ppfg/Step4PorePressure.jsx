import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';
import { getProperlyInvertedDepthAxisConfig, getPressureAxisConfig, getCommonChartProps, getGridConfig, getTooltipStyle } from '@/utils/chartConfigUtils';

const Step4PorePressure = ({ ppData, depths, onComplete }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (ppData && depths) {
            const data = depths.map((d, i) => ({
                depth: d,
                pp_ppg: ppData.pp_ppg[i]
            })).filter((_, i) => i % 50 === 0);
            setChartData(data);
            if(onComplete) onComplete(ppData); // Ensure data passes through if needed
        }
    }, [ppData, depths]);

    return (
         <div className="h-full p-4 flex gap-4">
            <Card className="w-64 bg-slate-900 border-slate-800 shrink-0">
                <CardContent className="p-4">
                    <h3 className="font-bold text-slate-200 mb-2">Pore Pressure Profile</h3>
                    <p className="text-xs text-slate-500">Derived from Effective Stress using Terzaghi's principle. Adjust methods in previous step.</p>
                </CardContent>
            </Card>

            <Card className="flex-1 bg-slate-900 border-slate-800">
                <CardContent className="h-full p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} {...getCommonChartProps()}>
                            <CartesianGrid {...getGridConfig()} />
                            <XAxis {...getPressureAxisConfig('Pore Pressure (ppg)', [8, 18])} dataKey="pp_ppg" />
                            <YAxis {...getProperlyInvertedDepthAxisConfig()} />
                            <Tooltip contentStyle={getTooltipStyle()} />
                            <Legend />
                            <Area dataKey="pp_ppg" stroke="none" fill="#3b82f6" fillOpacity={0.2} name="Pore Pressure" />
                            <Line dataKey="pp_ppg" stroke="#3b82f6" name="Pore Pressure" dot={false} strokeWidth={2} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default Step4PorePressure;