import React from 'react';

const TubingVisualizer = ({ activeString }) => {
    if (!activeString || !activeString.sections || activeString.sections.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-xs text-slate-600 bg-slate-950">
                No active string to visualize.
            </div>
        );
    }

    const sections = activeString.sections;
    const components = activeString.components || [];
    
    const maxDepth = Math.max(
        ...sections.map(s => parseFloat(s.bottom_depth)),
        ...(components.length ? components.map(c => parseFloat(c.depth)) : [0])
    ) * 1.1;
    
    // Scale mostly fixed width for simplicity in schematic
    const maxOD = 10; // Nominal display width

    // SVG Dimensions
    const width = 200;
    const height = 400; 
    
    const scaleY = (depth) => (depth / maxDepth) * height;
    const scaleX = (od) => (od / maxOD) * width; // Simple scaling

    return (
        <div className="w-full h-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMin slice" className="max-h-full">
                {/* Background Grid */}
                <defs>
                    <pattern id="grid-tubing" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-tubing)" />

                {/* Ground Line */}
                <line x1="0" y1="0" x2={width} y2="0" stroke="#94a3b8" strokeWidth="2" />

                {/* Center Line */}
                <line x1={width/2} y1="0" x2={width/2} y2={height} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

                {/* Tubing Sections */}
                {sections.map((sec, idx) => {
                    const topY = scaleY(parseFloat(sec.top_depth));
                    const bottomY = scaleY(parseFloat(sec.bottom_depth));
                    const sectionHeight = bottomY - topY;
                    const sectionWidth = 10; // Fixed schematic width for tubing
                    const startX = (width - sectionWidth) / 2;
                    
                    return (
                        <g key={sec.id}>
                            <rect 
                                x={startX} 
                                y={topY} 
                                width={sectionWidth} 
                                height={sectionHeight} 
                                fill="#3b82f6" 
                                fillOpacity="0.4" 
                                stroke="#60a5fa" 
                                strokeWidth="1"
                            />
                        </g>
                    );
                })}

                {/* Components */}
                {components.map((comp, idx) => {
                    const depthY = scaleY(parseFloat(comp.depth));
                    const cx = width / 2;
                    
                    let shape;
                    if (comp.type.includes('Packer')) {
                        // Diamond for packer
                        shape = <polygon points={`${cx-15},${depthY} ${cx},${depthY-8} ${cx+15},${depthY} ${cx},${depthY+8}`} fill="#ef4444" stroke="white" strokeWidth="0.5" />;
                    } else if (comp.type.includes('Valve')) {
                        // Circle for valve
                        shape = <circle cx={cx} cy={depthY} r="6" fill="#f97316" stroke="white" strokeWidth="0.5" />;
                    } else {
                        // Rect for others
                        shape = <rect x={cx-12} y={depthY-3} width="24" height="6" fill="#eab308" stroke="white" strokeWidth="0.5" />;
                    }

                    return (
                        <g key={comp.id} className="group cursor-pointer">
                            {shape}
                            <title>{comp.type} @ {comp.depth}m</title>
                        </g>
                    );
                })}

                {/* Depth Markers */}
                <text x="5" y="15" fill="#64748b" fontSize="8" fontFamily="monospace">0m</text>
                <text x="5" y={height - 5} fill="#64748b" fontSize="8" fontFamily="monospace">{Math.round(maxDepth)}m</text>
            </svg>
            
            <div className="absolute bottom-2 right-2 bg-slate-900/80 p-2 rounded border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] text-slate-400 font-mono">
                    Blue: Tubing
                    <br />Red: Packer
                </div>
            </div>
        </div>
    );
};

export default TubingVisualizer;