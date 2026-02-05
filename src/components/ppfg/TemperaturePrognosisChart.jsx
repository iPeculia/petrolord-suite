import React, { useMemo } from 'react';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Legend } from 'recharts';
import { Card } from '@/components/ui/card';
import { getDepthAxisConfig } from '@/utils/chartConfigUtils';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/95 border border-slate-700 p-3 rounded shadow-xl text-xs z-50 backdrop-blur-sm min-w-[150px]">
                <div className="font-bold text-slate-200 mb-2 border-b border-slate-700 pb-1">
                    Depth: <span className="font-mono text-orange-400">{Math.round(label)} ft</span>
                </div>
                <div className="space-y-1">
                    {payload.map((p, i) => (
                        <div key={i} className="flex justify-between gap-4">
                            <span className="text-slate-400">{p.name}:</span>
                            <span className="font-mono font-bold text-slate-200" style={{ color: p.color }}>
                                {Number(p.value).toFixed(1)} °F
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const TemperaturePrognosisChart = ({ data, formations, casing, hardData, seabedTemp = 40, geoGradient = 1.6 }) => {
    // 1. Generate Temperature Data if not present
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];
        
        return data.map(d => {
            // Calculate simplistic temperature if missing
            // T = Surface + (Gradient * Depth / 100)
            const calculatedTemp = seabedTemp + (geoGradient * d.depth / 100);
            const tempVal = d.temp || calculatedTemp;
            
            return {
                ...d,
                temp_mean: tempVal,
                temp_high: tempVal + 15, // +/- 15 degF uncertainty
                temp_low: tempVal - 15,
                // Mock measured points occasionally
                measured_temp: Math.random() > 0.95 ? tempVal + (Math.random() * 4 - 2) : null
            };
        });
    }, [data, seabedTemp, geoGradient]);

    const maxDepth = useMemo(() => {
        return chartData.length > 0 ? Math.max(...chartData.map(d => d.depth)) : 15000;
    }, [chartData]);

    return (
        <div className="flex h-full w-full bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex-1 flex flex-col h-full p-2 relative">
                {/* Title/Header Overlay */}
                <div className="absolute top-4 right-12 z-10 bg-white/80 backdrop-blur border border-slate-200 p-2 rounded shadow-sm">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        Temperature Prognosis
                    </h3>
                    <div className="text-[10px] text-slate-500 mt-1">
                        <div>Seabed: {seabedTemp}°F</div>
                        <div>Gradient: {geoGradient}°F/100ft</div>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart 
                        data={chartData} 
                        layout="vertical"
                        margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
                    >
                        <defs>
                            <linearGradient id="tempGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#ea580c" stopOpacity={0.3}/>
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={true} horizontal={true} />
                        
                        {/* X-Axis: Temperature */}
                        <XAxis 
                            type="number" 
                            orientation="top"
                            domain={[0, 350]} 
                            tickCount={8}
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            label={{ value: 'Temperature (°F)', position: 'top', offset: 10, fill: '#475569', fontSize: 12 }}
                        />
                        
                        {/* Y-Axis: Depth (Inverted) */}
                        <YAxis 
                            type="number" 
                            dataKey="depth" 
                            domain={[maxDepth, 0]} 
                            reversed={true}
                            tick={{ fontSize: 11, fill: '#64748b' }}
                            label={{ value: 'Depth (ft)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 12 }}
                        />

                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />

                        {/* Uncertainty Envelope */}
                        <Area 
                            dataKey="temp_high" 
                            dataKey1="temp_low" 
                            stroke="none" 
                            fill="url(#tempGradient)" 
                            name="Uncertainty Band" 
                        />

                        {/* Main Temperature Curve */}
                        <Line 
                            dataKey="temp_mean" 
                            stroke="#ea580c" 
                            strokeWidth={3} 
                            name="Temperature Model" 
                            dot={false}
                            isAnimationActive={true}
                        />

                        {/* Measured Points (scatter via line with dots only) */}
                        <Line
                            dataKey="measured_temp"
                            stroke="none"
                            fill="#be123c"
                            name="Measured Temp (BHT)"
                            dot={{ r: 4, strokeWidth: 1, stroke: '#fff', fill: '#be123c' }}
                            isAnimationActive={false}
                        />

                        {/* Formation Tops */}
                        {formations?.map((fmt, i) => (
                            <ReferenceLine 
                                key={`fmt-${i}`} 
                                y={fmt.top} 
                                stroke="#94a3b8" 
                                strokeDasharray="5 5"
                                label={{ 
                                    value: fmt.name, 
                                    position: 'insideTopRight', 
                                    fill: '#64748b', 
                                    fontSize: 10,
                                    offset: 10 
                                }} 
                            />
                        ))}

                        {/* Casing Shoes */}
                        {casing?.map((csg, i) => (
                            <ReferenceLine 
                                key={`csg-${i}`}
                                y={csg.depth}
                                stroke="#1e293b"
                                strokeWidth={2}
                                label={{ 
                                    value: `${csg.size}" Shoe`, 
                                    position: 'insideBottomRight', 
                                    fill: '#1e293b', 
                                    fontSize: 10, 
                                    fontWeight: 'bold'
                                }}
                            />
                        ))}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TemperaturePrognosisChart;