import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Sliders } from 'lucide-react';

const InteractiveFaciesDepthTrack = ({ data, faciesColors, selectedDepthRange }) => {
    const plotConfig = useMemo(() => {
        if (!data || data.length === 0) return null;

        const depth = data.map(d => d.DEPTH);
        
        // Prepare tracks
        const grTrace = {
            x: data.map(d => d.GR),
            y: depth,
            name: 'Gamma Ray',
            type: 'scatter',
            mode: 'lines',
            line: { color: '#22c55e', width: 1 },
            xaxis: 'x1',
            yaxis: 'y',
            fill: 'tozerox',
            fillcolor: 'rgba(34, 197, 94, 0.1)'
        };

        // Facies Blocks (Shapes)
        const shapes = [];
        let currentFacies = data[0].Facies;
        let startDepth = data[0].DEPTH;

        for (let i = 1; i < data.length; i++) {
            const d = data[i];
            if (d.Facies !== currentFacies || i === data.length - 1) {
                const color = faciesColors[currentFacies] || '#333';
                shapes.push({
                    type: 'rect',
                    xref: 'x2 domain',
                    yref: 'y',
                    x0: 0, x1: 1,
                    y0: startDepth, y1: d.DEPTH,
                    fillcolor: color,
                    line: { width: 0 },
                    layer: 'below'
                });
                currentFacies = d.Facies;
                startDepth = d.DEPTH;
            }
        }

        // Highlight selected depth range if active
        if (selectedDepthRange) {
            shapes.push({
                type: 'rect',
                xref: 'paper',
                yref: 'y',
                x0: 0, x1: 1,
                y0: selectedDepthRange[0],
                y1: selectedDepthRange[1],
                fillcolor: 'rgba(255, 255, 255, 0.1)',
                line: { color: 'white', width: 1, dash: 'dot' }
            });
        }

        const layout = {
            grid: { rows: 1, columns: 2, pattern: 'independent', subplots: [['xy', 'x2y']] },
            yaxis: { 
                title: 'Depth (MD)', 
                autorange: 'reversed', 
                gridcolor: '#334155',
                domain: [0, 1] 
            },
            xaxis: { 
                title: 'GR (API)', 
                range: [0, 150], 
                side: 'top', 
                gridcolor: '#334155',
                domain: [0, 0.3],
                position: 1
            },
            xaxis2: { 
                title: 'Facies Class', 
                side: 'top', 
                showticklabels: false, 
                domain: [0.35, 1],
                position: 1
            },
            shapes: shapes,
            margin: { l: 60, r: 20, t: 60, b: 20 },
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: { color: '#94a3b8' },
            showlegend: false,
            height: 600
        };

        return { data: [grTrace], layout };
    }, [data, faciesColors, selectedDepthRange]);

    if (!plotConfig) return <div className="flex items-center justify-center h-full text-slate-500 border border-dashed border-slate-800 rounded">No log data available</div>;

    return (
        <Card className="h-full bg-slate-900 border-slate-800 flex flex-col">
            <CardHeader className="py-3 border-b border-slate-800 flex flex-row justify-between items-center space-y-0">
                <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-400"/> Facies Depth Track
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-6 w-6"><Settings className="w-4 h-4" /></Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden relative">
                <Plot
                    data={plotConfig.data}
                    layout={plotConfig.layout}
                    useResizeHandler={true}
                    style={{ width: '100%', height: '100%' }}
                    config={{ 
                        displayModeBar: true, 
                        scrollZoom: true,
                        modeBarButtonsToRemove: ['lasso2d', 'select2d']
                    }}
                />
            </CardContent>
        </Card>
    );
};

export default InteractiveFaciesDepthTrack;