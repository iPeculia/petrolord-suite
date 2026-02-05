import React from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRightCircle } from 'lucide-react';

const FaciesTransitionMatrixVisualizer = () => {
    // Mock Markov Chain Data
    const labels = ['Sand', 'Shale', 'Lime', 'Dolo', 'Coal'];
    const zValues = [
        [0.75, 0.20, 0.05, 0.00, 0.00],
        [0.15, 0.80, 0.05, 0.00, 0.00],
        [0.00, 0.05, 0.70, 0.25, 0.00],
        [0.00, 0.00, 0.20, 0.75, 0.05],
        [0.05, 0.15, 0.00, 0.00, 0.80]
    ];

    const layout = {
        xaxis: { title: 'To Facies', side: 'top', ticks: '' },
        yaxis: { title: 'From Facies', autorange: 'reversed', ticks: '' },
        margin: { l: 60, r: 20, t: 60, b: 40 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: '#94a3b8' },
        annotations: []
    };

    // Add text annotations
    labels.forEach((rowLabel, i) => {
        labels.forEach((colLabel, j) => {
            const val = zValues[i][j];
            layout.annotations.push({
                x: colLabel, y: rowLabel,
                text: val > 0.01 ? val.toFixed(2) : '',
                font: { color: val > 0.5 ? 'white' : 'black', size: 11 },
                showarrow: false
            });
        });
    });

    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader className="py-3 border-b border-slate-800">
                <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
                    <ArrowRightCircle className="w-4 h-4 text-pink-400" /> Markov Transition Probabilities
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[350px]">
                <Plot
                    data={[{
                        z: zValues,
                        x: labels,
                        y: labels,
                        type: 'heatmap',
                        colorscale: 'Purples',
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

export default FaciesTransitionMatrixVisualizer;