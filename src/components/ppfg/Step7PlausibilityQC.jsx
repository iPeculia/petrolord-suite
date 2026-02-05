import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { checkPlausibility } from '@/utils/plausibilityChecker';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getProperlyInvertedDepthAxisConfig, getPressureAxisConfig, getCommonChartProps, getGridConfig, getTooltipStyle } from '@/utils/chartConfigUtils';

const Step7PlausibilityQC = ({ finalData }) => {
    const [qcResult, setQcResult] = useState(null);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (finalData) {
            setQcResult(checkPlausibility(finalData));
            const data = finalData.depths.map((d, i) => ({
                depth: d,
                pp: finalData.pp_ppg[i],
                fg: finalData.fg_ppg[i],
                obg: finalData.obg_ppg[i]
            })).filter((_, i) => i % 50 === 0);
            setChartData(data);
        }
    }, [finalData]);

    if (!qcResult) return <div className="p-4 text-slate-500">Generating Quality Report...</div>;

    return (
        <div className="h-full p-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
                <Card className="bg-slate-900 border-slate-800 shrink-0">
                    <CardHeader>
                        <CardTitle className="text-slate-200 flex items-center gap-2">
                            {qcResult.isValid ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-red-500" />}
                            Model Plausibility Check
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-2">
                            {qcResult.isValid ? <span className="text-emerald-400">PASSED</span> : <span className="text-red-400">ISSUES FOUND</span>}
                        </div>
                        <p className="text-slate-400 text-sm">
                            The model has been checked against physical constraints (PP &lt; FG, PP &lt; OBG) and logical consistency rules.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 flex-1 flex flex-col overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-slate-200">Flagged Anomalies</CardTitle>
                    </CardHeader>
                    <ScrollArea className="flex-1 p-4 pt-0">
                        {qcResult.flags.length === 0 ? (
                            <div className="text-emerald-500 flex items-center gap-2">
                                <CheckCircle2 size={16} /> No anomalies detected.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {qcResult.flags.map((flag, i) => (
                                    <div key={i} className="flex items-start gap-2 p-2 bg-slate-950 rounded border border-slate-800">
                                        <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={16} />
                                        <div>
                                            <div className="text-sm font-bold text-slate-300">{flag.type} @ {Math.round(flag.depth)}ft</div>
                                            <div className="text-xs text-slate-500">{flag.message}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </Card>
            </div>

            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                 <CardContent className="h-full p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} {...getCommonChartProps()}>
                            <CartesianGrid {...getGridConfig()} />
                            <XAxis {...getPressureAxisConfig('Gradient (ppg)', [8, 20])} />
                            <YAxis {...getProperlyInvertedDepthAxisConfig()} />
                            <Tooltip contentStyle={getTooltipStyle()} />
                            <Legend />
                            <Area dataKey="pp" stroke="none" fill="#ef4444" fillOpacity={0.2} />
                            <Line dataKey="pp" stroke="#ef4444" name="PP" dot={false} strokeWidth={2} />
                            <Line dataKey="fg" stroke="#3b82f6" name="FG" dot={false} strokeWidth={2} />
                            <Line dataKey="obg" stroke="#f59e0b" name="OBG" dot={false} strokeWidth={2} strokeDasharray="5 5" />
                        </ComposedChart>
                    </ResponsiveContainer>
                 </CardContent>
            </Card>
        </div>
    );
};

export default Step7PlausibilityQC;