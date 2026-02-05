import React, { useMemo } from 'react';

const WellboreVisualization = ({ casingStrings, tubingStrings, width = 300, height = 600 }) => {
    // 1. Determine Scales
    const maxDepth = useMemo(() => {
        let max = 1000;
        casingStrings.forEach(s => { if (s.bottom_depth > max) max = s.bottom_depth; });
        tubingStrings.forEach(s => { if (s.bottom_depth > max) max = s.bottom_depth; });
        return max * 1.1; // 10% buffer
    }, [casingStrings, tubingStrings]);

    const maxOD = useMemo(() => {
        let max = 20; // Default min 20 inch canvas width
        casingStrings.forEach(s => { 
            const od = parseFloat(s.od);
            if (od > max) max = od; 
        });
        return max * 1.5; // Padding
    }, [casingStrings]);

    // Scaling Functions
    const scaleY = (depth) => (depth / maxDepth) * height;
    const scaleX = (od) => (od / maxOD) * width;

    // Center X
    const cx = width / 2;

    // Sort casings by diameter (largest first to draw background/hole)
    const sortedCasings = [...casingStrings].sort((a, b) => parseFloat(b.od) - parseFloat(a.od));

    return (
        <div className="w-full h-full flex justify-center bg-slate-950 overflow-hidden relative">
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMin meet">
                
                {/* Grid Background */}
                <defs>
                    <pattern id="vis-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1e293b" strokeWidth="0.5"/>
                    </pattern>
                    <linearGradient id="cement-gradient" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.3" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#vis-grid)" />

                {/* Ground Line */}
                <line x1="0" y1="0" x2={width} y2="0" stroke="#64748b" strokeWidth="2" />
                <text x="5" y="15" fill="#64748b" fontSize="10" fontFamily="monospace">0 m</text>

                {/* Draw Casings */}
                {sortedCasings.map((casing, idx) => {
                    const od = parseFloat(casing.od);
                    const top = parseFloat(casing.top_depth);
                    const bot = parseFloat(casing.bottom_depth);
                    
                    const w = scaleX(od);
                    const h = scaleY(bot - top);
                    const y = scaleY(top);
                    const x = cx - (w / 2);

                    // Cement (Mock logic: Top of Cement is 500m above shoe or surface if shallow)
                    const toc = Math.max(top, bot - 500); 
                    const tocY = scaleY(toc);
                    const cementH = scaleY(bot - toc);
                    
                    // Previous casing OD (for cement outer bound) or Hole size (approx casing OD * 1.2)
                    const holeW = scaleX(od * 1.2); 
                    const holeX = cx - (holeW / 2);

                    // Color cycle
                    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
                    const color = colors[idx % colors.length];

                    return (
                        <g key={casing.id}>
                            {/* Hole/Cement Annulus */}
                            <rect 
                                x={holeX} 
                                y={tocY} 
                                width={holeW} 
                                height={cementH} 
                                fill="url(#cement-gradient)" 
                            />
                            
                            {/* Casing Pipe */}
                            <rect 
                                x={x} 
                                y={y} 
                                width={w} 
                                height={h} 
                                fill="none" 
                                stroke={color} 
                                strokeWidth="2" 
                            />
                            {/* Casing Shoe Triangle */}
                            <polygon points={`${x},${y+h} ${x+w},${y+h} ${cx},${y+h+scaleY(50)}`} fill={color} opacity="0.5" />
                            
                            {/* Label */}
                            <text x={x + w + 5} y={y + h} fill={color} fontSize="9" alignmentBaseline="middle">
                                {casing.name} ({od}") @ {bot}m
                            </text>
                        </g>
                    );
                })}

                {/* Draw Tubing */}
                {tubingStrings.map((tubing, idx) => {
                    const od = parseFloat(tubing.od);
                    const top = parseFloat(tubing.top_depth);
                    const bot = parseFloat(tubing.bottom_depth);
                    
                    const w = scaleX(od);
                    const h = scaleY(bot - top);
                    const y = scaleY(top);
                    const x = cx - (w / 2);

                    return (
                        <g key={tubing.id}>
                            <rect 
                                x={x} 
                                y={y} 
                                width={w} 
                                height={h} 
                                fill="#a855f7" // Purple
                                fillOpacity="0.3"
                                stroke="#a855f7" 
                                strokeWidth="1" 
                            />
                            <text x={x - 60} y={y + h - 10} fill="#a855f7" fontSize="9">
                                Tubing ({od}")
                            </text>
                        </g>
                    );
                })}

                {/* Components (Packers, etc) */}
                {tubingStrings.flatMap(t => t.components || []).map((comp, idx) => {
                    const d = parseFloat(comp.depth);
                    const cy = scaleY(d);
                    
                    if (comp.type.includes("Packer")) {
                        return (
                            <g key={idx}>
                                <polygon points={`${cx-15},${cy} ${cx-5},${cy-5} ${cx-5},${cy+5}`} fill="#ef4444" />
                                <polygon points={`${cx+15},${cy} ${cx+5},${cy-5} ${cx+5},${cy+5}`} fill="#ef4444" />
                                <text x={cx + 20} y={cy} fill="#ef4444" fontSize="9" alignmentBaseline="middle">Packer @ {d}m</text>
                            </g>
                        );
                    }
                    return null;
                })}

                {/* Depth Scale on Left */}
                <line x1="20" y1="0" x2="20" y2={height} stroke="#334155" strokeWidth="1" />
                {[0, 0.25, 0.5, 0.75, 1].map(f => (
                    <g key={f}>
                        <line x1="15" y1={height * f} x2="25" y2={height * f} stroke="#64748b" />
                        <text x="10" y={height * f + 3} textAnchor="end" fill="#64748b" fontSize="9">
                            {Math.round(maxDepth * f)}
                        </text>
                    </g>
                ))}

            </svg>
        </div>
    );
};

export default WellboreVisualization;