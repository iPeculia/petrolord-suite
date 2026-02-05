import React from 'react';
import Plot from 'react-plotly.js';

const ResidualPlot = ({ roStats, tempStats }) => {
    if (!roStats || !tempStats) return null;

    // Prepare data for plotting
    // Bar chart of residuals vs depth
    
    const roTrace = {
        x: roStats.map(r => r.residual),
        y: roStats.map(r => r.depth),
        type: 'bar',
        orientation: 'h',
        name: 'Ro Residuals',
        marker: { color: '#f472b6' }
    };

    const tempTrace = {
        x: tempStats.map(r => r.residual),
        y: tempStats.map(r => r.depth),
        type: 'bar',
        orientation: 'h',
        name: 'Temp Residuals',
        xaxis: 'x2',
        yaxis: 'y2',
        marker: { color: '#fbbf24' }
    };

    return (
        <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-lg p-1 overflow-hidden">
            <Plot
                data={[roTrace, tempTrace]}
                layout={{
                    grid: { rows: 1, columns: 2, pattern: 'independent' },
                    title: { text: 'Residual Analysis (Measured - Modeled)', font: { size: 12, color: '#e2e8f0' } },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    font: { color: '#94a3b8', size: 10 },
                    showlegend: false,
                    margin: { l: 50, r: 20, t: 40, b: 40 },
                    xaxis: { title: 'Ro Residual (%)', gridcolor: '#334155' },
                    yaxis: { title: 'Depth (m)', autorange: 'reversed', gridcolor: '#334155' },
                    xaxis2: { title: 'Temp Residual (°C)', gridcolor: '#334155' },
                    yaxis2: { showticklabels: false, autorange: 'reversed', gridcolor: '#334155' }
                }}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
                config={{ displayModeBar: false }}
            />
        </div>
    );
};

export default ResidualPlot;