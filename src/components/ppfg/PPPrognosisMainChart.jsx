import React, { useMemo } from 'react';
import { 
    ResponsiveContainer, 
    ComposedChart, 
    Line, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ReferenceLine, 
    Scatter 
} from 'recharts';

const PPPrognosisMainChart = ({ data, markers = [], casing, maxDepth = 12000 }) => {
    
    // Process data to ensure we have valid gradient values for visualization
    const chartData = useMemo(() => {
        if (!data) return [];
        return data.map(d => ({
            ...d,
            // Ensure gradients exist or calculate them if missing (simple fallback)
            pp_grad: d.pp_grad || d.pp_mid || 9.0, 
            fg_grad: d.fg_grad || d.fg_mid || 14.0,
            obg_grad: d.obg_grad || d.obg || 19.0,
        }));
    }, [data]);

    // Safe markers handling - ensure it is an array
    const safeMarkers = useMemo(() => {
        if (!markers) return [];
        if (Array.isArray(markers)) return markers;
        // If it's an object (like a map or dictionary), try to convert values to array if applicable, otherwise return empty
        if (typeof markers === 'object') {
             console.warn('PPPrognosisMainChart: markers prop is an object, expected array. Attempting to use empty array.');
             return [];
        }
        return [];
    }, [markers]);

    // Filter markers for different types
    const lotFitMarkers = useMemo(() => 
        safeMarkers.filter(m => ['LOT', 'FIT'].includes(m.type)).map(m => ({...m, x: m.value, y: m.depth}))
    , [safeMarkers]);

    const rftMdtMarkers = useMemo(() => 
        safeMarkers.filter(m => ['RFT', 'MDT', 'DST'].includes(m.type)).map(m => ({...m, x: m.value, y: m.depth}))
    , [safeMarkers]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/95 border border-slate-700 p-3 rounded shadow-xl text-xs text-slate-200 z-50 backdrop-blur-sm">
                    <div className="font-bold text-slate-100 mb-2 border-b border-slate-700 pb-1">
                        Depth: <span className="font-mono text-amber-400">{Math.round(label)} ft</span>
                    </div>
                    <div className="space-y-1">
                        {payload.map((p, i) => {
                            // Skip area/scatter tooltips if they are just structural
                            if (['Safe MW Window', 'Unsafe Zone'].includes(p.name)) return null;
                            
                            return (
                                <div key={i} className="flex items-center justify-between gap-4">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                                        <span className="text-slate-400">{p.name}:</span>
                                    </span>
                                    <span className="font-mono font-bold text-slate-200">
                                        {Number(p.value).toFixed(2)} ppg
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full flex flex-col bg-white relative">
            {/* Header / Title */}
            <div className="absolute top-2 left-16 z-10 bg-white/90 px-3 py-1 rounded border border-slate-200 shadow-sm backdrop-blur-sm">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Pressure Gradient Profile</h3>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    layout="vertical"
                    data={chartData}
                    margin={{ top: 20, right: 30, bottom: 20, left: 60 }}
                >
                    <defs>
                        {/* Gradients for Areas */}
                        <linearGradient id="safeWindowGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2}/>
                            <stop offset="100%" stopColor="#22c55e" stopOpacity={0.1}/>
                        </linearGradient>
                         <pattern id="unsafePattern" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                            <rect width="4" height="8" transform="translate(0,0)" fill="#ef4444" opacity="0.1" />
                        </pattern>
                    </defs>

                    <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="#e2e8f0" 
                        horizontal={true}
                        vertical={true}
                    />

                    {/* X-Axis: Pressure Gradient */}
                    <XAxis 
                        type="number" 
                        domain={[8, 20]} 
                        orientation="top"
                        ticks={[8, 10, 12, 14, 16, 18, 20]}
                        tickFormatter={(val) => val.toFixed(1)}
                        label={{ 
                            value: 'Pressure Gradient (PPG)', 
                            position: 'top', 
                            offset: 10, 
                            fill: '#475569', 
                            fontSize: 12,
                            fontWeight: 600
                        }}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        stroke="#cbd5e1"
                    />

                    {/* Y-Axis: Depth (Inverted) */}
                    <YAxis 
                        type="number" 
                        dataKey="depth" 
                        domain={[maxDepth, 0]} 
                        reversed={true}
                        ticks={[0, 2000, 4000, 6000, 8000, 10000, 12000].filter(t => t <= maxDepth)}
                        tickFormatter={(val) => `${val} ft`}
                        label={{ 
                            value: 'Depth (ft)', 
                            angle: -90, 
                            position: 'insideLeft', 
                            offset: -45, // Moved further left
                            fill: '#475569', 
                            fontSize: 12,
                            fontWeight: 600
                        }}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        stroke="#cbd5e1"
                    />

                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    
                    <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle" 
                        wrapperStyle={{ 
                            fontSize: '12px', 
                            paddingTop: '10px',
                            borderTop: '1px solid #e2e8f0'
                        }} 
                    />

                    {/* 1. Safe Mud Weight Window (Green Area) */}
                    {/* Mud Weight Window Visualization (Filling under FG curve down to min, then we'd ideally cut out PP) */}
                    {/* 
                    <Area 
                        dataKey="fg_grad" 
                        stroke="none" 
                        fill="#22c55e" 
                        fillOpacity={0.1} 
                        name="Safe Window" 
                    />
                    */}

                    {/* 2. Main Curves */}
                    
                    {/* Pore Pressure (Blue) */}
                    <Line 
                        dataKey="pp_grad" 
                        stroke="#2563eb" 
                        strokeWidth={3} 
                        name="Pore Pressure (PP)" 
                        dot={false} 
                        isAnimationActive={true}
                    />

                    {/* Fracture Gradient (Red) */}
                    <Line 
                        dataKey="fg_grad" 
                        stroke="#dc2626" 
                        strokeWidth={3} 
                        name="Fracture Gradient (FG)" 
                        dot={false}
                        strokeDasharray="5 5"
                    />

                    {/* Overburden Gradient (Black) */}
                    <Line 
                        dataKey="obg_grad" 
                        stroke="#0f172a" 
                        strokeWidth={2} 
                        name="Overburden (OBG)" 
                        dot={false}
                        strokeDasharray="2 2"
                    />

                    {/* 3. Hard Data Points */}
                    
                    {/* LOT/FIT (Blue Dots) - actually typically Orange/Yellow or distinct */}
                    {lotFitMarkers.length > 0 && (
                        <Scatter 
                            name="LOT/FIT" 
                            data={lotFitMarkers} 
                            fill="#f59e0b" 
                            shape="triangle" 
                            legendType="triangle"
                        />
                    )}

                    {/* RFT/MDT (Green Triangles) - typically circles/dots */}
                    {rftMdtMarkers.length > 0 && (
                        <Scatter 
                            name="RFT/MDT" 
                            data={rftMdtMarkers} 
                            fill="#10b981" 
                            shape="circle" 
                            legendType="circle"
                        />
                    )}

                    {/* 4. Casing Shoes (Reference Lines) */}
                    {casing?.map((c, i) => (
                        <ReferenceLine 
                            key={`csg-${i}`} 
                            y={c.depth} 
                            stroke="#64748b" 
                            strokeWidth={1} 
                            label={{ 
                                position: 'insideLeft', 
                                value: `${c.size}" Shoe`, 
                                fill: '#64748b', 
                                fontSize: 10,
                                fontWeight: 600 
                            }} 
                        />
                    ))}

                    {/* Safe Zone Annotation (Visual Guide) */}
                    <ReferenceLine x={8.5} stroke="none" label={{ value: 'Safe Zone', position: 'insideTop', fill: '#22c55e', opacity: 0.5, fontSize: 10 }} />

                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PPPrognosisMainChart;