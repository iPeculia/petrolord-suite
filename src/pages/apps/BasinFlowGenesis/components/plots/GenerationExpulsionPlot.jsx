import React from 'react';
import Plot from 'react-plotly.js';

const GenerationExpulsionPlot = ({ results }) => {
    const { data, meta } = results;
    const { transformation } = data; // transformation = TR (0-1)

    // Only plot source rocks?
    // Filter layers that are source rocks or just plot all and let user see flat lines for non-source
    
    // Let's filter for traces that actually have some transformation > 0.01
    const traces = meta.layers.map((layer, index) => {
        const hist = transformation[index];
        if (!hist || hist.length === 0) return null;
        
        const maxTR = Math.max(...hist.map(h => h.value));
        if (maxTR < 0.01) return null;

        return {
            x: hist.map(h => h.age),
            y: hist.map(h => h.value),
            type: 'scatter',
            mode: 'lines',
            name: `${layer.name} (TR)`
        };
    }).filter(t => t !== null);

    if (traces.length === 0) {
        return (
             <div className="w-full h-full flex items-center justify-center bg-slate-900/50 rounded-lg border border-slate-800">
                <p className="text-slate-400">No significant hydrocarbon generation detected.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[400px] bg-slate-900/50 rounded-lg border border-slate-800 overflow-hidden">
             <Plot
                data={traces}
                layout={{
                    title: { text: 'Transformation Ratio', font: { color: '#e2e8f0' } },
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
                        title: 'TR (Fraction)', 
                        gridcolor: '#334155',
                        zerolinecolor: '#475569',
                        range: [0, 1.05]
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

export default GenerationExpulsionPlot;