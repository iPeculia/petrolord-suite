import React from 'react';
import { ResponsiveContainer, BarChart, Bar, Brush, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sliders } from 'lucide-react';

const DepthWindowSelector = ({ data, onDepthChange }) => {
    // Resample data for performance in the brush histogram
    const sampledData = React.useMemo(() => {
        if (!data || data.length === 0) return [];
        const step = Math.ceil(data.length / 200); // Aim for 200 bars
        const result = [];
        for (let i = 0; i < data.length; i += step) {
            result.push(data[i]);
        }
        return result;
    }, [data]);

    if (!data || data.length === 0) return null;

    const handleBrushChange = (range) => {
        if (range && range.startIndex !== undefined && range.endIndex !== undefined) {
            const startDepth = sampledData[range.startIndex]?.DEPTH;
            const endDepth = sampledData[range.endIndex]?.DEPTH;
            if (startDepth && endDepth && onDepthChange) {
                onDepthChange([Math.min(startDepth, endDepth), Math.max(startDepth, endDepth)]);
            }
        }
    };

    return (
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2 py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-400" />
                    Depth Window Selector
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[120px] p-2 pt-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sampledData}>
                        <XAxis dataKey="DEPTH" hide />
                        <YAxis hide />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: 'none', fontSize: '12px' }}
                            labelFormatter={(label) => `Depth: ${label.toFixed(1)}m`}
                        />
                        <Bar dataKey="GR" fill="#334155" radius={[2, 2, 0, 0]} isAnimationActive={false} />
                        <Brush 
                            dataKey="DEPTH" 
                            height={30} 
                            stroke="#64748b" 
                            fill="#1e293b"
                            onChange={handleBrushChange}
                            tickFormatter={(val) => val.toFixed(0)}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default DepthWindowSelector;