import React from 'react';
import Plot from 'react-plotly.js';
import { useTheme } from 'next-themes';

const BurialHistoryPlot = ({ results }) => {
    const { data, meta } = results;
    const { timeSteps, burial } = data;

    // Prepare Traces
    const traces = meta.layers.map((layer, index) => {
        const layerHistory = burial[index];
        
        // We need to map age to x, and depth to y
        // Since burial history is stored chronologically (High Age -> 0), Plotly handles numeric X fine.
        // We want Age on X (reversed?), Depth on Y (reversed).
        
        // Construct polygon for filled area
        // Top curve: (age, top)
        // Bottom curve: (age, bottom) -> reversed for closing the loop
        
        const ages = layerHistory.map(h => h.age);
        const tops = layerHistory.map(h => h.top);
        const bottoms = layerHistory.map(h => h.bottom);
        
        // Polygon path: Top -> Right Edge -> Bottom (reversed) -> Left Edge -> Close
        const x = [...ages, ...ages.slice().reverse()];
        const y = [...tops, ...bottoms.slice().reverse()];
        
        const colorMap = {
            sandstone: 'rgba(244, 162, 97, 0.8)',
            shale: 'rgba(38, 70, 83, 0.8)',
            limestone: 'rgba(42, 157, 143, 0.8)',
            salt: 'rgba(233, 196, 106, 0.8)',
            coal: 'rgba(29, 29, 29, 0.8)'
        };

        return {
            x: x,
            y: y,
            fill: 'toself',
            type: 'scatter',
            mode: 'lines',
            line: { width: 0.5, color: '#333' },
            fillcolor: colorMap[layer.lithology] || '#888',
            name: layer.name,
            hoverinfo: 'name'
        };
    });

    // Add Isotherms or Iso-Ro lines if available (Optional polish)

    return (
        <div className="w-full h-full min-h-[400px] bg-slate-900/50 rounded-lg border border-slate-800 overflow-hidden">
            <Plot
                data={traces}
                layout={{
                    title: { text: 'Burial History', font: { color: '#e2e8f0' } },
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
                        title: 'Depth (m)', 
                        autorange: 'reversed',
                        gridcolor: '#334155',
                        zerolinecolor: '#475569'
                    },
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

export default BurialHistoryPlot;