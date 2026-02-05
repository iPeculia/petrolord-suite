import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import Plot from 'react-plotly.js';
import { useBasinFlow } from '../contexts/BasinFlowContext';
import { useTheme } from 'next-themes';

const VisualizationPanel = () => {
    const { state } = useBasinFlow();
    const { theme } = useTheme();
    const isDark = theme === 'dark' || true; // Force dark for this app usually
    
    // Prepare data for simple 1D visualization (Depth vs Age)
    // This is a simplified visualization for the prototype
    const preparePlotData = () => {
        let currentDepth = 0;
        const shapes = [];
        const annotations = [];
        
        // Sort layers by age (youngest to oldest usually for depth) 
        // But usually we render from top (depth 0) down.
        // Assuming array order is Top -> Bottom
        
        state.stratigraphy.forEach((layer) => {
            const thickness = layer.thickness || 0;
            const top = currentDepth;
            const bottom = currentDepth + thickness;
            
            // Color mapping
            const colors = {
                sandstone: '#f4a261',
                shale: '#264653',
                limestone: '#2a9d8f',
                salt: '#e9c46a',
                coal: '#1d1d1d'
            };

            shapes.push({
                type: 'rect',
                x0: 0,
                x1: 1, // Full width relative
                y0: top,
                y1: bottom,
                fillcolor: colors[layer.lithology] || '#888',
                line: { width: 1, color: '#000' },
                xref: 'paper',
                yref: 'y'
            });
            
            annotations.push({
                x: 0.5,
                y: (top + bottom) / 2,
                text: `${layer.name} (${layer.lithology})`,
                showarrow: false,
                font: { color: layer.lithology === 'coal' || layer.lithology === 'shale' ? 'white' : 'black', size: 10 },
                xref: 'paper',
                yref: 'y'
            });

            currentDepth = bottom;
        });

        return { shapes, annotations, maxDepth: currentDepth };
    };

    const { shapes, annotations, maxDepth } = preparePlotData();

    return (
        <div className="h-full w-full bg-slate-900/50 p-4 flex flex-col">
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden relative">
                <Plot
                    data={[]}
                    layout={{
                        title: { text: 'Stratigraphic Column', font: { color: '#fff' } },
                        paper_bgcolor: 'rgba(0,0,0,0)',
                        plot_bgcolor: 'rgba(0,0,0,0)',
                        shapes: shapes,
                        annotations: annotations,
                        xaxis: { 
                            visible: false, 
                            range: [0, 1] 
                        },
                        yaxis: { 
                            title: 'Depth (m)', 
                            autorange: 'reversed', 
                            gridcolor: '#333',
                            zerolinecolor: '#666',
                            tickfont: { color: '#aaa' },
                            titlefont: { color: '#aaa' },
                            range: [0, Math.max(maxDepth * 1.1, 100)]
                        },
                        autosize: true,
                        margin: { l: 60, r: 20, t: 40, b: 20 }
                    }}
                    useResizeHandler={true}
                    style={{ width: '100%', height: '100%' }}
                    config={{ displayModeBar: false, responsive: true }}
                />
            </div>
            <div className="mt-4 p-3 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 flex gap-4 justify-center">
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#f4a261]"></div> Sandstone</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#264653]"></div> Shale</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#2a9d8f]"></div> Limestone</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#e9c46a]"></div> Salt</div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#1d1d1d]"></div> Coal</div>
            </div>
        </div>
    );
};

export default VisualizationPanel;