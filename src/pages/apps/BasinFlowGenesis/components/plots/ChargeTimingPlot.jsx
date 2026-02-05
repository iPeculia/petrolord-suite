import React from 'react';
import Plot from 'react-plotly.js';

const ChargeTimingPlot = ({ results }) => {
    const { data, meta } = results;
    
    // Create a "Timeline" or Gantt chart style visualization
    // Events:
    // 1. Critical Moment (Peak Generation)
    // 2. Trap Formation (e.g. Structural event or deposition of Seal)
    // 3. Preservation
    
    // For Phase 1/2/3 Genesis, we infer Trap Formation from a placeholder 'event' or just Layer Deposition.
    // Let's use Peak Generation as the main bar.
    
    const traces = [];
    const annotations = [];
    
    meta.layers.forEach((layer, index) => {
        const genHist = data.generation[index]; // rate
        if(!genHist) return;
        
        // Find range where generation is active
        // Threshold rate > 0.001
        const activeGen = genHist.filter(h => h.value > 0.001);
        if(activeGen.length === 0) return;
        
        const startAge = activeGen[0].age;
        const endAge = activeGen[activeGen.length-1].age;
        
        traces.push({
            x: [startAge, endAge],
            y: [layer.name, layer.name],
            mode: 'lines',
            line: { width: 20, color: 'rgba(74, 222, 128, 0.6)' }, // Green bar
            name: 'Generation Window',
            showlegend: false
        });

        // Critical Moment marker (Peak rate)
        const peak = activeGen.reduce((prev, current) => (prev.value > current.value) ? prev : current);
        traces.push({
            x: [peak.age],
            y: [layer.name],
            mode: 'markers',
            marker: { symbol: 'star', size: 12, color: 'gold' },
            name: 'Peak Charge',
            showlegend: false
        });
    });

    return (
        <div className="w-full h-full min-h-[400px] bg-slate-900/50 rounded-lg border border-slate-800 overflow-hidden">
            <Plot
                data={traces}
                layout={{
                    title: { text: 'Petroleum Systems Events Chart', font: { color: '#e2e8f0' } },
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
                        title: '', 
                        gridcolor: '#334155',
                        zerolinecolor: '#475569',
                        type: 'category'
                    },
                    margin: { l: 120, r: 20, t: 40, b: 60 },
                    autosize: true
                }}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
                config={{ displayModeBar: true, displaylogo: false }}
            />
        </div>
    );
};

export default ChargeTimingPlot;