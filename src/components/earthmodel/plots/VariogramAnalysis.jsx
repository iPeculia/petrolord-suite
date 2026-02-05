import React from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useResizeDetector } from 'react-resize-detector';

const VariogramAnalysis = () => {
  const { width, ref } = useResizeDetector();

  // Sample variogram data
  const lags = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  const gamma = [0, 0.15, 0.35, 0.5, 0.6, 0.68, 0.75, 0.8, 0.82, 0.83, 0.84];
  const model = [0, 0.18, 0.38, 0.55, 0.65, 0.72, 0.78, 0.81, 0.83, 0.84, 0.85];

  return (
    <Card className="h-full bg-slate-900 border-slate-800" ref={ref}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-200">Experimental Variogram (Major Axis)</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-3rem)]">
        <Plot
          data={[
            {
              x: lags,
              y: gamma,
              type: 'scatter',
              mode: 'markers',
              marker: { color: '#3b82f6', size: 8 },
              name: 'Experimental'
            },
            {
              x: lags,
              y: model,
              type: 'scatter',
              mode: 'lines',
              line: { color: '#ef4444', width: 2 },
              name: 'Spherical Model'
            }
          ]}
          layout={{
            width: width || 400,
            height: 300,
            margin: { t: 10, b: 40, l: 40, r: 10 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#94a3b8' },
            xaxis: { title: 'Lag Distance (m)', gridcolor: '#1e293b' },
            yaxis: { title: 'Semivariance', gridcolor: '#1e293b' },
            legend: { x: 0.7, y: 0.1, bgcolor: 'rgba(0,0,0,0.5)' }
          }}
          config={{ responsive: true, displayModeBar: false }}
        />
      </CardContent>
    </Card>
  );
};

export default VariogramAnalysis;