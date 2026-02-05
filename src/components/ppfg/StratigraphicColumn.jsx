import React from 'react';
import { getLithologyColor, getLithologyPatternId } from '@/utils/lithologyColorMap';
import { LithologyPatterns } from '@/utils/lithologyPatternGenerator.jsx';

/**
 * Industry Standard Stratigraphic Column
 * - Colors based on lithology (not formation name)
 * - Patterns for lithology types
 * - Inverted depth scale (0 at top) matches PP chart
 */
const StratigraphicColumn = ({ data, formations, casing, maxDepth }) => {
    if (!data || data.length === 0) return null;

    // Determine max depth for scaling
    const safeMaxDepth = maxDepth || Math.max(...data.map(d => d.depth));
    
    // Helper to scale depth to percentage
    // 0 at Top, maxDepth at Bottom
    const toPct = (depth) => (depth / safeMaxDepth) * 100;

    // Optimize rendering: Group continuous lithology intervals
    // Instead of rendering 10,000 1px divs, we merge adjacent same-lithology points
    const lithologyIntervals = [];
    let currentBlock = null;

    data.forEach((point) => {
        if (!currentBlock) {
            currentBlock = { 
                lithology: point.lithology, 
                top: point.depth, 
                bottom: point.depth 
            };
        } else if (point.lithology !== currentBlock.lithology) {
            // End current block
            lithologyIntervals.push(currentBlock);
            // Start new
            currentBlock = { 
                lithology: point.lithology, 
                top: point.depth, 
                bottom: point.depth 
            };
        } else {
            // Extend current
            currentBlock.bottom = point.depth;
        }
    });
    if (currentBlock) lithologyIntervals.push(currentBlock);

    return (
        <div className="w-full h-full bg-white border-r border-slate-300 relative overflow-hidden select-none text-xs">
            <LithologyPatterns />
            
            {/* Header */}
            <div className="h-8 border-b border-slate-400 bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-[9px] uppercase tracking-wider sticky top-0 z-20 shadow-sm">
                Lithology
            </div>
            
            {/* Content Area */}
            <div className="relative w-full h-[calc(100%-32px)]">
                
                {/* Lithology Blocks */}
                {lithologyIntervals.map((block, i) => {
                    const top = toPct(block.top);
                    const height = toPct(block.bottom) - top;
                    
                    // Filter out tiny slivers < 0.1% height to save DOM nodes if needed, unless it's very thin log
                    if (height < 0.05) return null;

                    return (
                        <div
                            key={i}
                            className="absolute w-full border-b border-slate-300/20"
                            style={{
                                top: `${top}%`,
                                height: `${height}%`,
                                backgroundColor: getLithologyColor(block.lithology),
                                backgroundImage: getLithologyPatternId(block.lithology),
                                backgroundSize: '10px 10px'
                            }}
                            title={`${block.lithology} (${Math.round(block.top)}-${Math.round(block.bottom)} ft)`}
                        />
                    );
                })}

                {/* Formation Labels (Overlay) */}
                {formations && formations.map((fmt, i) => {
                     const top = toPct(fmt.top);
                     const height = toPct(fmt.bottom) - top;
                     return (
                        <div 
                            key={`fmt-${i}`}
                            className="absolute w-full flex items-center justify-center pointer-events-none z-10 border-t border-dashed border-slate-800/30"
                            style={{ top: `${top}%`, height: `${height}%` }}
                        >
                            <span className="bg-white/80 px-1 py-0.5 text-[9px] font-bold text-slate-900 rounded shadow-sm backdrop-blur-sm border border-slate-200 truncate max-w-[90%]">
                                {fmt.name}
                            </span>
                        </div>
                     );
                })}

                {/* Casing Shoes */}
                {casing && casing.map((csg, i) => (
                    <div 
                        key={`csg-${i}`}
                        className="absolute w-full z-20 flex items-center justify-end pr-1"
                        style={{ top: `${toPct(csg.depth)}%` }}
                    >
                         <div className="border-t-2 border-black w-1/2 absolute right-0"></div>
                         <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-black absolute right-0 translate-y-[3px]"></div>
                         <span className="text-[8px] font-bold bg-white border border-black px-0.5 -translate-y-full mr-2 text-black relative z-30">
                            {csg.size}"
                         </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StratigraphicColumn;