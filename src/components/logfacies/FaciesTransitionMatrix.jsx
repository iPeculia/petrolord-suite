import React from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FaciesTransitionMatrix = () => {
    // Mock Data: Probability of transitioning from Row Facies to Col Facies
    const labels = ['Sand', 'Shale', 'Lime', 'Dolo', 'Coal'];
    const zValues = [
        [0.80, 0.15, 0.05, 0.00, 0.00], // From Sand
        [0.10, 0.85, 0.05, 0.00, 0.00], // From Shale
        [0.05, 0.05, 0.70, 0.20, 0.00], // From Lime
        [0.00, 0.00, 0.15, 0.80, 0.05], // From Dolo
        [0.00, 0.10, 0.00, 0.00, 0.90]  // From Coal
    ];

    const layout = {
        annotations: [],
        xaxis: { ticks: '', side: 'top', title: 'To Facies' },
        yaxis: { ticks: '', title: 'From Facies', autorange: 'reversed' },
        margin: { l: 60, r: 20, t: 60, b: 40 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: '#94a3b8' },
        height: 350
    };

    // Add text annotations
    for (let i = 0; i < labels.length; i++) {
        for (let j = 0; j < labels.length; j++) {
            const val = zValues[i][j];
            layout.annotations.push({
                xref: 'x1', yref: 'y1',
                x: labels[j], y: labels[i],
                text: val > 0.01 ? val.toFixed(2) : '',
                font: { color: val > 0.5 ? 'white' : 'black', size: 10 },
                showarrow: false
            });
        }
    }

    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader className="py-3">
                <CardTitle className="text-sm">Vertical Transition Probability</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Plot
                    data={[{
                        z: zValues,
                        x: labels,
                        y: labels,
                        type: 'heatmap',
                        colorscale: 'Greens',
                        showscale: false
                    }]}
                    layout={layout}
                    useResizeHandler={true}
                    style={{ width: '100%', height: '100%' }}
                    config={{ displayModeBar: false }}
                />
            </CardContent>
        </Card>
    );
};

export default FaciesTransitionMatrix;