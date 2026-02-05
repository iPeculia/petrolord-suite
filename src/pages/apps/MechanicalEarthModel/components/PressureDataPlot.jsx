import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ZAxis } from 'recharts';
import { getProperlyInvertedDepthAxisConfig, getPressureAxisConfig, getCommonChartProps, getGridConfig, getTooltipStyle } from '@/utils/chartConfigUtils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GitCommitVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const colors = {
    MDT: '#3b82f6', // blue
    LOT: '#ef4444', // red
    FIT: '#f59e0b', // amber
};

const shapes = {
    MDT: 'circle',
    LOT: 'triangle',
    FIT: 'square',
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div style={getTooltipStyle()}>
                <p className="font-bold">{`Depth: ${data.depth.toFixed(0)} ft`}</p>
                <p style={{ color: colors[data.type] }}>{`${data.type}: ${data.pressure.toFixed(2)} ppg`}</p>
                {data.notes && <p className="text-xs text-slate-400 mt-1 italic">{`Notes: ${data.notes}`}</p>}
            </div>
        );
    }
    return null;
};

const PressureDataPlot = ({ pressurePoints = [] }) => {
    const mdtData = pressurePoints.filter(p => p.type === 'MDT');
    const lotData = pressurePoints.filter(p => p.type === 'LOT');
    const fitData = pressurePoints.filter(p => p.type === 'FIT');

    const hasData = pressurePoints.length > 0;
    
    // Find min/max depth for Y-axis domain
    const depths = pressurePoints.map(p => p.depth);
    const yDomain = hasData ? [Math.min(...depths) - 100, Math.max(...depths) + 100] : [0, 10000];

    return (
        <Card className="h-full bg-slate-900/50 border-slate-800 flex flex-col">
            <CardHeader>
                <CardTitle className="text-lg text-slate-200">Pressure Data Visualization</CardTitle>
                <CardDescription>Measured pressure points vs. Depth</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                {hasData ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="w-full h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart {...getCommonChartProps()}>
                                <CartesianGrid {...getGridConfig()} />
                                <XAxis {...getPressureAxisConfig('Equivalent Mud Weight (ppg)', [8, 20])} dataKey="pressure" type="number" name="Pressure" />
                                <YAxis {...getProperlyInvertedDepthAxisConfig()} dataKey="depth" type="number" name="Depth" domain={yDomain} />
                                <ZAxis dataKey="z" range={[64, 100]} />
                                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                                <Legend iconType="circle" />
                                {mdtData.length > 0 && <Scatter name="MDT" data={mdtData} fill={colors.MDT} shape={shapes.MDT} />}
                                {lotData.length > 0 && <Scatter name="LOT" data={lotData} fill={colors.LOT} shape={shapes.LOT} />}
                                {fitData.length > 0 && <Scatter name="FIT" data={fitData} fill={colors.FIT} shape={shapes.FIT} />}
                            </ScatterChart>
                        </ResponsiveContainer>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                        <GitCommitVertical className="w-12 h-12 mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold">No Pressure Data</h3>
                        <p className="text-sm">Add MDT, LOT, or FIT points to visualize them here.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PressureDataPlot;