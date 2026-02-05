import React from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ModelValidationDashboard = () => {
    // Mock Confusion Matrix Data
    const zValues = [
        [50, 2, 1, 0, 0],
        [3, 45, 5, 1, 0],
        [0, 4, 40, 2, 1],
        [0, 1, 3, 35, 5],
        [0, 0, 0, 4, 20]
    ];
    const labels = ['Sand', 'Shale', 'Lime', 'Dolo', 'Coal'];

    const data = [{
        z: zValues,
        x: labels,
        y: labels,
        type: 'heatmap',
        colorscale: 'Blues'
    }];

    const layout = {
        title: 'Confusion Matrix',
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        font: { color: '#94a3b8' },
        margin: { l: 50, r: 20, t: 50, b: 50 }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader><CardTitle>Confusion Matrix</CardTitle></CardHeader>
                <CardContent className="h-[300px]">
                    <Plot
                        data={data}
                        layout={layout}
                        useResizeHandler={true}
                        style={{ width: '100%', height: '100%' }}
                        config={{ displayModeBar: false }}
                    />
                </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader><CardTitle>Class Performance Metrics</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {labels.map((label, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-300">{label}</span>
                                    <span className="text-slate-400">F1-Score: {(0.8 + Math.random() * 0.15).toFixed(2)}</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-blue-500" 
                                        style={{ width: `${(0.8 + Math.random() * 0.15) * 100}%` }} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ModelValidationDashboard;