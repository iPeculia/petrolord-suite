import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import Plot from 'react-plotly.js';

const confusionMatrixData = {
    z: [
        [85, 5, 2, 0, 8], // Sand
        [4, 90, 1, 1, 4], // Shale
        [1, 2, 88, 5, 4], // Lime
        [0, 1, 8, 82, 9], // Dolo
        [2, 3, 1, 4, 90]  // Coal
    ],
    x: ['Sand', 'Shale', 'Lime', 'Dolo', 'Coal'],
    y: ['Sand', 'Shale', 'Lime', 'Dolo', 'Coal'],
    type: 'heatmap',
    colorscale: 'Blues'
};

const classMetrics = [
    { facies: 'Sandstone', precision: 0.88, recall: 0.85, f1: 0.86 },
    { facies: 'Shale', precision: 0.92, recall: 0.90, f1: 0.91 },
    { facies: 'Limestone', precision: 0.85, recall: 0.88, f1: 0.86 },
    { facies: 'Dolomite', precision: 0.80, recall: 0.82, f1: 0.81 },
    { facies: 'Coal', precision: 0.95, recall: 0.90, f1: 0.92 },
];

const ValidationExplainabilityDashboard = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            <Card className="bg-slate-900 border-slate-800 flex flex-col">
                <CardHeader className="py-3 border-b border-slate-800">
                    <CardTitle className="text-sm font-medium">Confusion Matrix</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-[300px] p-2">
                    <Plot
                        data={[confusionMatrixData]}
                        layout={{
                            margin: { t: 20, b: 40, l: 50, r: 20 },
                            paper_bgcolor: 'transparent',
                            plot_bgcolor: 'transparent',
                            xaxis: { title: 'Predicted', tickfont: { color: '#94a3b8' }, titlefont: { color: '#cbd5e1' } },
                            yaxis: { title: 'Actual', tickfont: { color: '#94a3b8' }, titlefont: { color: '#cbd5e1' } },
                            font: { color: '#94a3b8' }
                        }}
                        useResizeHandler
                        style={{ width: '100%', height: '100%' }}
                        config={{ displayModeBar: false }}
                    />
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 flex flex-col">
                <CardHeader className="py-3 border-b border-slate-800">
                    <CardTitle className="text-sm font-medium">Per-Facies Performance</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 min-h-[300px] p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={classMetrics} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                            <XAxis type="number" domain={[0, 1]} tick={{fill: '#94a3b8'}} />
                            <YAxis dataKey="facies" type="category" width={80} tick={{fill: '#94a3b8'}} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9' }} />
                            <Legend />
                            <Bar dataKey="precision" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Precision" />
                            <Bar dataKey="recall" fill="#a855f7" radius={[0, 4, 4, 0]} name="Recall" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default ValidationExplainabilityDashboard;