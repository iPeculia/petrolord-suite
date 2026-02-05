import React from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DepthPlotInteractive = ({ data, faciesColors }) => {
    if (!data || data.length === 0) return null;

    const depth = data.map(d => d.DEPTH);
    const facies = data.map(d => d.Facies);
    
    // Map facies to numerical values for plotting
    const uniqueFacies = Object.keys(faciesColors);
    const faciesNum = facies.map(f => uniqueFacies.indexOf(f));

    const traces = [
        {
            x: data.map(d => d.GR),
            y: depth,
            name: 'Gamma Ray',
            type: 'scatter',
            mode: 'lines',
            line: { color: '#22c55e', width: 1 },
            xaxis: 'x1'
        },
        {
            x: faciesNum,
            y: depth,
            name: 'Facies',
            type: 'heatmap', // Using heatmap or bar to show blocks could be better, but scatter gl is fast
            xaxis: 'x2',
            visible: false // Just a placeholder, we use shapes usually for facies
        }
    ];

    // Create shapes for facies tracks
    const shapes = data.map((d, i) => {
        if (i === 0) return null;
        return {
            type: 'rect',
            xref: 'x2 domain', yref: 'y',
            x0: 0, x1: 1,
            y0: data[i-1].DEPTH, y1: d.DEPTH,
            fillcolor: faciesColors[d.Facies] || '#333',
            line: { width: 0 }
        };
    }).filter(Boolean);

    const layout = {
        grid: { rows: 1, columns: 2, pattern: 'independent' },
        yaxis: { title: 'Depth (MD)', autorange: 'reversed', gridcolor: '#334155' },
        xaxis1: { title: 'GR (API)', range: [0, 150], side: 'top', gridcolor: '#334155' },
        xaxis2: { title: 'Facies Class', side: 'top', showticklabels: false },
        shapes: shapes,
        margin: { l: 60, r: 20, t: 40, b: 20 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: '#94a3b8' },
        showlegend: false,
        height: 600
    };

    return (
        <Card className="h-full bg-slate-900 border-slate-800">
            <CardHeader className="py-3 px-4 border-b border-slate-800">
                <CardTitle className="text-sm">Interactive Depth Tracks</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[600px]">
                <Plot
                    data={traces}
                    layout={layout}
                    useResizeHandler={true}
                    style={{ width: '100%', height: '100%' }}
                    config={{ displayModeBar: true, scrollZoom: true }}
                />
            </CardContent>
        </Card>
    );
};

export default DepthPlotInteractive;