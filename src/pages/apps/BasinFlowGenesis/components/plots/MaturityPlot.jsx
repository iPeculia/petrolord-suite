import React from 'react';
import Plot from 'react-plotly.js';

const MaturityPlot = ({ results }) => {
    const { data, meta } = results;
    const { maturity } = data;

    // Plot 1: Ro vs Age for all layers
    const traces = meta.layers.map((layer, index) => {
        const hist = maturity[index];
        if (!hist || hist.length === 0) return null;
        
        // Only show relevant layers (e.g. reach > 0.5 Ro) to avoid clutter?
        // For now show all.
        return {
            x: hist.map(h => h.age),
            y: hist.map(h => h.value),
            type: 'scatter',
            mode: 'lines',
            name: layer.name
        };
    }).filter(t => t !== null);

    // Add Oil Window Shading (Ro 0.5 - 1.3)
    // Use shapes or a filled trace
    // Plotly shapes are easier for background windows
    const shapes = [
        {
            type: 'rect',
            xref: 'paper',
            x0: 0,
            x1: 1,
            y0: 0.5,
            y1: 1.0,
            fillcolor: 'rgba(0, 255, 0, 0.1)',
            line: { width: 0 },
            layer: 'below'
        },
        {
            type: 'rect',
            xref: 'paper',
            x0: 0,
            x1: 1,
            y0: 1.0,
            y1: 1.3,
            fillcolor: 'rgba(255, 165, 0, 0.1)', // Condensate
            line: { width: 0 },
            layer: 'below'
        },
         {
            type: 'rect',
            xref: 'paper',
            x0: 0,
            x1: 1,
            y0: 1.3,
            y1: 2.6,
            fillcolor: 'rgba(255, 0, 0, 0.1)', // Gas
            line: { width: 0 },
            layer: 'below'
        }
    ];
    
    const annotations = [
        { x: 0.05, y: 0.75, xref: 'paper', text: 'Oil Window', showarrow: false, font: {color: '#4ade80', size: 10}, xanchor: 'left' },
        { x: 0.05, y: 1.15, xref: 'paper', text: 'Condensate', showarrow: false, font: {color: '#fbbf24', size: 10}, xanchor: 'left' },
        { x: 0.05, y: 2.0, xref: 'paper', text: 'Dry Gas', showarrow: false, font: {color: '#f87171', size: 10}, xanchor: 'left' }
    ];

    return (
        <div className="w-full h-full min-h-[400px] bg-slate-900/50 rounded-lg border border-slate-800 overflow-hidden">
            <Plot
                data={traces}
                layout={{
                    title: { text: 'Maturity Evolution (%Ro)', font: { color: '#e2e8f0' } },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    font: { color: '#94a3b8' },
                    xaxis: { 
                        title: 'Age (Ma)', 
                        autorange: 'reversed',
                        gridcolor: '#334155',
                        zerolinecolor: '#475569'
                    },
                    yaxis: { 
                        title: 'Vitrinite Reflectance (%Ro)', 
                        gridcolor: '#334155',
                        zerolinecolor: '#475569',
                        range: [0, 3]
                    },
                    shapes: shapes,
                    annotations: annotations,
                    showlegend: true,
                    legend: { orientation: 'h', y: -0.2 },
                    margin: { l: 60, r: 20, t: 40, b: 60 },
                    autosize: true
                }}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
                config={{ displayModeBar: true, displaylogo: false }}
            />
        </div>
    );
};

export default MaturityPlot;