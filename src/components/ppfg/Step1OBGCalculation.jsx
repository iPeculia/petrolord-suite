import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { calculateOBG } from '@/utils/obgCalculator';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getProperlyInvertedDepthAxisConfig, getPressureAxisConfig, getCommonChartProps, getGridConfig, getTooltipStyle } from '@/utils/chartConfigUtils';
import ContextHelp from './ContextHelp';

const Step1OBGCalculation = ({ data, onComplete, initialParams }) => {
    const [params, setParams] = useState(initialParams?.data || { waterDepth: 500, airGap: 80 });
    const [results, setResults] = useState(null);

    const runCalculation = () => {
        const res = calculateOBG(data, params);
        setResults(res);
        onComplete(res);
    };

    useEffect(() => {
        if(data.length > 0 && !results) runCalculation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const chartData = results ? results.obg_ppg.map((val, i) => ({
        depth: results.depths[i],
        obg_ppg: val
    })) : [];

    return (
        <div className="h-full flex gap-4 p-4">
            <Card className="w-80 bg-slate-900 border-slate-800 h-full shrink-0">
                <CardHeader>
                    <CardTitle className="text-slate-100 flex items-center">
                        OBG Parameters
                        <ContextHelp content="Configure parameters for Overburden Gradient integration." />
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-slate-400 flex items-center">
                            Water Depth (ft)
                            <ContextHelp content="Distance from sea surface to seabed. Used to calculate hydrostatic pressure of water column." />
                        </Label>
                        <Input 
                            type="number" 
                            value={params.waterDepth} 
                            onChange={(e) => setParams({...params, waterDepth: parseFloat(e.target.value)})}
                            className="bg-slate-950 border-slate-700 text-slate-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-400 flex items-center">
                            Air Gap (ft)
                            <ContextHelp content="Distance from rotary table (RKB) to sea surface." />
                        </Label>
                        <Input 
                            type="number" 
                            value={params.airGap} 
                            onChange={(e) => setParams({...params, airGap: parseFloat(e.target.value)})}
                            className="bg-slate-950 border-slate-700 text-slate-200"
                        />
                    </div>
                    <div className="pt-4">
                        <Button onClick={runCalculation} className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                            Calculate OBG
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="flex-1 bg-slate-900 border-slate-800 h-full overflow-hidden">
                <CardContent className="h-full p-4">
                    {results ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} {...getCommonChartProps()}>
                                <CartesianGrid {...getGridConfig()} />
                                <XAxis {...getPressureAxisConfig('Gradient (ppg)', [8, 22])} dataKey="obg_ppg" />
                                <YAxis {...getProperlyInvertedDepthAxisConfig()} />
                                <Tooltip contentStyle={getTooltipStyle()} />
                                <Legend />
                                <Line dataKey="obg_ppg" stroke="#f59e0b" name="Overburden (OBG)" dot={false} strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-500">
                            Enter parameters to calculate Overburden Gradient
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Step1OBGCalculation;