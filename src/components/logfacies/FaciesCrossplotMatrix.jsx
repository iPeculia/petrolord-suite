import React from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Maximize2, PenTool, MousePointer2, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FaciesCrossplotMatrix = ({ data, faciesColors }) => {
    if (!data) return null;

    // Prepare data
    const faciesList = [...new Set(data.map(d => d.Facies))];
    const colors = data.map(d => faciesColors[d.Facies] || '#888');
    
    const nphi = data.map(d => d.NPHI);
    const rhob = data.map(d => d.RHOB);
    const gr = data.map(d => d.GR);
    const dt = data.map(d => d.DT || d.AC || 80); // Fallback if DT missing

    const traces = [];
    
    // Plot 1: NPHI vs RHOB
    traces.push({
        x: nphi, y: rhob, xaxis: 'x', yaxis: 'y',
        mode: 'markers', type: 'scattergl',
        marker: { color: colors, size: 4, opacity: 0.6 },
        name: 'NPHI-RHOB'
    });

    // Plot 2: GR vs RHOB
    traces.push({
        x: gr, y: rhob, xaxis: 'x2', yaxis: 'y2',
        mode: 'markers', type: 'scattergl',
        marker: { color: colors, size: 4, opacity: 0.6 },
        name: 'GR-RHOB'
    });

    // Plot 3: NPHI vs DT
    traces.push({
        x: nphi, y: dt, xaxis: 'x3', yaxis: 'y3',
        mode: 'markers', type: 'scattergl',
        marker: { color: colors, size: 4, opacity: 0.6 },
        name: 'NPHI-DT'
    });

    // Plot 4: GR vs DT
    traces.push({
        x: gr, y: dt, xaxis: 'x4', yaxis: 'y4',
        mode: 'markers', type: 'scattergl',
        marker: { color: colors, size: 4, opacity: 0.6 },
        name: 'GR-DT'
    });

    const layout = {
        grid: { rows: 2, columns: 2, pattern: 'independent' },
        xaxis: { title: 'NPHI (v/v)', gridcolor: '#334155' },
        yaxis: { title: 'RHOB (g/cc)', autorange: 'reversed', gridcolor: '#334155' },
        xaxis2: { title: 'GR (API)', gridcolor: '#334155' },
        yaxis2: { title: 'RHOB (g/cc)', autorange: 'reversed', gridcolor: '#334155' },
        xaxis3: { title: 'NPHI (v/v)', gridcolor: '#334155' },
        yaxis3: { title: 'DT (us/ft)', gridcolor: '#334155' },
        xaxis4: { title: 'GR (API)', gridcolor: '#334155' },
        yaxis4: { title: 'DT (us/ft)', gridcolor: '#334155' },
        margin: { l: 50, r: 20, t: 30, b: 50 },
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'rgba(30, 41, 59, 0.5)',
        font: { color: '#94a3b8' },
        showlegend: false,
        height: 500
    };

    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
            <CardHeader className="py-3 border-b border-slate-800 flex flex-row justify-between items-center space-y-0">
                <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
                    <Grid className="w-4 h-4 text-indigo-400" /> Property Crossplot Matrix
                </CardTitle>
                <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7"><PenTool className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7"><Maximize2 className="w-4 h-4" /></Button>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                <Plot
                    data={traces}
                    layout={layout}
                    useResizeHandler={true}
                    style={{ width: '100%', height: '100%' }}
                    config={{ displayModeBar: false }}
                />
            </CardContent>
        </Card>
    );
};

export default FaciesCrossplotMatrix;