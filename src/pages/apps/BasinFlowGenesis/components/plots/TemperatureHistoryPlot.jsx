import React from 'react';
import Plot from 'react-plotly.js';

const TemperatureHistoryPlot = ({ results }) => {
    const { data, meta } = results;
    const { temperature } = data;

    // We want to plot Temperature vs Age for specific layers (e.g., Source Rock layers)
    // Or show the temperature evolution of the bottom-most layer.
    
    const traces = meta.layers.map((layer, index) => {
        const layerTempHistory = temperature[index];
        
        if (!layerTempHistory || layerTempHistory.length === 0) return null;

        return {
            x: layerTempHistory.map(h => h.age),
            y: layerTempHistory.map(h => h.value),
            type: 'scatter',
            mode: 'lines',
            name: layer.name,
            line: { width: 2 }
        };
    }).filter(t => t !== null);

    return (
        <div className="w-full h-full min-h-[400px] bg-slate-900/50 rounded-lg border border-slate-800 overflow-hidden">
            <Plot
                data={traces}
                layout={{
                    title: { text: 'Temperature History', font: { color: '#e2e8f0' } },
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
                        title: 'Temperature (°C)', 
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

export default TemperatureHistoryPlot;